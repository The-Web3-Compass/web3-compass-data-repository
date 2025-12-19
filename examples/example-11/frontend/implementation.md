### Writing to the Contract (Buying Entries)

When someone wants to buy entries, we use `useEnterLottery`:

```jsx
export function useEnterLottery() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const enterLottery = async (lotteryAddress, lotteryId, entries) => {
    return writeContract({
      address: lotteryAddress,
      abi: LOTTERY_ABI,
      functionName: 'enterLottery',
      args: [lotteryId, entries],
    })
  }

  return {
    enterLottery,
    isPending,      // User hasn't signed yet
    isConfirming,   // Transaction is mining
    isSuccess,      // Transaction confirmed
    hash,
  }
}
```

This hook wraps `writeContract` and `useWaitForTransactionReceipt` to handle the full transaction lifecycle:

1. `isPending` - Waiting for user to sign
2. `isConfirming` - Transaction submitted, waiting for confirmation
3. `isSuccess` - Transaction confirmed on-chain

The component uses these states to show appropriate UI (loading spinners, success messages, etc.).

### Token Approvals (Annoying But Necessary)

Before anyone can enter the lottery, they need to approve the lottery contract to spend their RUSD. Standard ERC20 stuff. Easy to mess up if you’re not careful.

We handle it in `src/hooks/useToken.js`:

```jsx
export function useTokenApproval() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const approve = async (tokenAddress, spenderAddress, amount) => {
    return writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress, amount],
    })
  }

  return {
    approve,
    isPending,
    isConfirming,
    isSuccess,
  }
}
```

The UI flow:
1. User picks how many entries they want
2. Frontend calculates total cost (entries × entry fee)
3. Frontend checks if they’ve already approved enough
4. If not, show “Approve RUSD” button first
5. User approves, transaction confirms
6. Now show “Enter Lottery” button
7. User enters, transaction confirms, they’re in

Two transactions. But the UX makes it obvious what’s happening and why each step matters.

### Drawing the Winner (Requesting Randomness)

Once the lottery ends, anyone can trigger the draw. The `useDrawWinner` hook makes this happen:

```jsx
export function useDrawWinner() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const drawWinner = async (lotteryAddress, lotteryId) => {
    return writeContract({
      address: lotteryAddress,
      abi: LOTTERY_ABI,
      functionName: 'drawWinner',
      args: [lotteryId, 200000], // callback gas limit
      value: parseEther('0.001'), // ETH to pay for randomness callback
    })
  }

  return { drawWinner, isPending, isConfirming, isSuccess, hash }
}
```

The `value` field sends ETH along with the transaction. This pays for the randomness callback. The `200000` is the gas limit for when `onRandomnessReceived` gets called back.

After this transaction confirms, lottery state flips to DRAWING. The frontend polls the contract and updates the UI when the winner gets announced.

### Cross-Chain Claims (Where only swaps Shines)

This is where it gets interesting.

When a winner wants their prize on a different chain, they call `claimPrizeCrossChain`. The contract handles the only swaps integration, but the frontend needs to feed it the right parameters.

Look at `src/components/ClaimPrize.jsx`:

```jsx
const handleClaimCrossChain = async () => {
  const solverFee = parseUnits('0.1', 6) // 0.1 RUSD solver fee

  await claimPrizeCrossChain(
    lotteryAddress,
    lotteryId,
    otherChainId,           // 43113 for Avalanche Fuji
    otherChainAddresses.rusd, // RUSD token address on destination chain
    solverFee
  )
}
```

The solver fee goes to whoever fulfills the swap. In this case, 0.1 RUSD. Winner receives `prizePool - solverFee` on the destination chain.

The contract calls `router.requestCrossChainSwap`, creating a swap intent. Solvers watching the only swaps network see this and compete to fulfill it.

One solver sends RUSD to the winner on Avalanche, then submits proof to dcipher. Once verified, that solver gets reimbursed on Base.

From the user’s perspective: click button, sign transaction, prize shows up on Avalanche a few minutes later. No bridge UI. No wrapped tokens. No twelve-step process.

That’s only swaps.

### Using onlyswaps-js (When You Need More Control)

In this lottery, the contract handles everything only swaps-related. But if you’re building something that needs direct only swaps integration (checking swap status, monitoring solver activity, building a cross-chain DEX aggregator), you’d use `onlyswaps-js`.

Install it:

```bash
npm install onlyswaps-js
```

Basic usage:

```jsx
import { OnlySwapsClient } from 'onlyswaps-js'

const client = new OnlySwapsClient({
  chainId: 84532, // Base Sepolia
})

// Check swap status
const swapStatus = await client.getSwapStatus(swapRequestId)

// Get available routes for a token pair
const routes = await client.getRoutes({
  fromChain: 84532,
  toChain: 43113,
  fromToken: '0x...', // RUSD on Base
  toToken: '0x...',   // RUSD on Avalanche
})

// Monitor swap events
client.on('SwapFulfilled', (event) => {
  console.log('Swap completed:', event)
})
```

For this lottery, we don’t need this. The contract handles everything. But if you’re building something more complex (DEX aggregator, cross-chain bridge UI, multi-chain portfolio tracker), `onlyswaps-js` gives you direct access to the only swaps network.

The library handles:
- Querying available routes and solver liquidity
- Monitoring swap request status
- Listening for fulfillment events
- Estimating fees and execution times

It’s the JavaScript SDK for only swaps. Use it when you need programmatic access to cross-chain functionality beyond what your contract provides.

