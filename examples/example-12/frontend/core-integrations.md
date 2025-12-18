## How This Thing Actually Works

We’re not walking through every line of code. That’s what the repo is for. Instead, let’s focus on the pieces that matter. The parts that make this different from just another React app calling contract functions.

### Wagmi Configuration (How Wallets Connect)

Wagmi does the heavy lifting for wallet connections. We set it up in `src/main.jsx`:

```jsx
import { WagmiProvider, createConfig, http } from 'wagmi'
import { baseSepolia, avalancheFuji } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected } from 'wagmi/connectors'

const config = createConfig({
  chains: [baseSepolia, avalancheFuji],
  connectors: [injected()],
  transports: {
    [baseSepolia.id]: http(),
    [avalancheFuji.id]: http(),
  },
})

const queryClient = new QueryClient()

// Wrap app with providers
<WagmiProvider config={config}>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
</WagmiProvider>
```

This sets up support for Base Sepolia and Avalanche Fuji, uses the injected connector (MetaMask, Rabby, etc.), and provides the Wagmi context to the entire app.

Now any component can use Wagmi hooks like `useAccount`, `useChainId`, `useWriteContract`, etc.

### Reading Contract Data (Fetching Listings)

The `BrowseListings` component fetches all active listings from the contract. Look at `src/components/BrowseListings.jsx`:

```jsx
const { data: listingCount } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'listingCounter',
    watch: true,
})

const totalListings = listingCount ? Number(listingCount) : 0
```

This calls `listingCounter` on the contract to get the total number of listings. Then we iterate from 1 to `totalListings` and fetch each listing individually.

For each listing, we use another `useReadContract` call:

```jsx
const { data: listing } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getListing',
    args: [BigInt(listingId)],
    watch: true,
    pollingInterval: 5000,
})
```

The `watch: true` and `pollingInterval: 5000` mean this hook automatically refetches every 5 seconds. So when bids are revealed or a winner is selected, the UI updates automatically.

We use `useReadContract` for reads (free, no signatures needed). For writes, we use `useWriteContract` (costs gas, requires signatures).

### Encrypting Bids (The blocklock-js Integration)

This is where it gets interesting.

When a user wants to place a bid, they enter an amount in the bid modal. Before submitting to the contract, we need to encrypt that amount using blocklock.

Here’s the flow in `src/components/ListingCard.jsx` (inside the bid modal logic):

```jsx
import { encrypt } from 'blocklock-js'

const handleSubmitBid = async () => {
    // User entered bid amount (in RUSD)
    const bidAmount = parseUnits(bidInput, 6) // 6 decimals for RUSD

    // Encrypt the bid with the reveal block height as the condition
    const condition = listing.revealBlockHeight
    const ciphertext = await encrypt(bidAmount, condition)

    // Submit the encrypted bid to the contract
    await submitBid(
        MARKETPLACE_ADDRESS,
        listing.id,
        ciphertext,
        200000 // callback gas limit
    )
}
```

The `encrypt` function from `blocklock-js` takes the bid amount and the reveal block height, then returns a ciphertext. This ciphertext is what gets submitted to the contract.

Nobody can decrypt this ciphertext until the blockchain reaches the reveal block height. Not other bidders. Not the seller. Not even the contract. The encryption happens entirely in the browser using the dcipher network’s public parameters.

When the reveal block is reached, the dcipher network automatically decrypts all bids and calls back to the contract with the decryption keys.

### Submitting Bids (Writing to the Contract)

Once we have the encrypted ciphertext, we submit it to the contract. We use a custom hook for this:

```jsx
const { writeContract, data: hash, isPending } = useWriteContract()
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

const submitBid = async (marketplaceAddress, listingId, ciphertext, callbackGasLimit) => {
    return writeContract({
        address: marketplaceAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'submitBid',
        args: [listingId, ciphertext, callbackGasLimit],
        value: parseEther('0.001'), // ETH to pay for decryption callback
    })
}
```

The `value` field sends ETH along with the transaction. This pays for the decryption callback later. The `200000` is the gas limit for when `_onBlocklockReceived` gets called back.

After this transaction confirms, the bid is on-chain and encrypted. The frontend shows it as “Sealed” until the reveal block is reached.

This hook wraps `writeContract` and `useWaitForTransactionReceipt` to handle the full transaction lifecycle:

1. `isPending` - Waiting for user to sign
2. `isConfirming` - Transaction submitted, waiting for confirmation
3. `isSuccess` - Transaction confirmed on-chain

The component uses these states to show appropriate UI (loading spinners, success messages, etc.).

### Token Approvals (Annoying But Necessary)

Before anyone can pay for an item they won, they need to approve the marketplace contract to spend their RUSD. Standard ERC20 stuff. Easy to mess up if you’re not careful.

We handle it in the payment flow:

```jsx
const handlePayment = async () => {
    // First, approve the marketplace to spend RUSD
    await approveToken(
        RUSD_TOKEN[chainId],
        MARKETPLACE_ADDRESS,
        parseUnits(listing.winningBid, 6)
    )

    // Wait for approval to confirm
    // Then call payForItem
    await payForItem(MARKETPLACE_ADDRESS, listing.id)
}
```

The UI flow:
1. User clicks “Pay Now”
2. Frontend checks if they’ve already approved enough
3. If not, show “Approve RUSD” button first
4. User approves, transaction confirms
5. Now show “Pay” button
6. User pays, transaction confirms, seller gets paid

Two transactions. But the UX makes it obvious what’s happening and why each step matters.

### Cross-Chain Payments (Where OnlySwaps Shines)

This is where it gets really interesting.

When a winner wants to pay from a different chain, they select the destination chain from a dropdown and click “Pay Cross-Chain.”

Look at the payment component in `src/components/MyBids.jsx`:

```jsx
const handleCrossChainPayment = async () => {
    const solverFee = parseUnits('0.1', 6) // 0.1 RUSD solver fee

    await payForItemCrossChain(
        MARKETPLACE_ADDRESS,
        listing.id,
        selectedChainId,           // 43113 for Avalanche Fuji
        RUSD_TOKEN[selectedChainId], // RUSD token address on destination chain
        solverFee
    )
}
```

The solver fee goes to whoever fulfills the swap. In this case, 0.1 RUSD. Seller receives `winningBid - solverFee` on Base.

The contract calls `router.requestCrossChainSwap`, creating a swap intent. Solvers watching the OnlySwaps network see this and compete to fulfill it.

One solver sends RUSD to the seller on Base, then submits proof to dcipher. Once verified, that solver gets reimbursed on Avalanche.

From the user’s perspective: select chain, click button, sign transaction, seller gets paid on Base a few minutes later. No bridge UI. No wrapped tokens. No twelve-step process.

That’s OnlySwaps.

### Using onlyswaps-js (When You Need More Control)

In this marketplace, the contract handles everything OnlySwaps-related. But if you’re building something that needs direct OnlySwaps integration (checking swap status, monitoring solver activity, building a cross-chain DEX aggregator), you’d use `onlyswaps-js`.

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

For this marketplace, we don’t need this. The contract handles everything. But if you’re building something more complex (DEX aggregator, cross-chain bridge UI, multi-chain portfolio tracker), `onlyswaps-js` gives you direct access to the OnlySwaps network.

The library handles:
- Querying available routes and solver liquidity
- Monitoring swap request status
- Listening for fulfillment events
- Estimating fees and execution times

It’s the JavaScript SDK for OnlySwaps. Use it when you need programmatic access to cross-chain functionality beyond what your contract provides.

---
