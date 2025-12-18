## Getting Started (Yeah, The Setup Part)

Full code’s on GitHub. Grab it:

```bash
git clone [GITHUB_LINK_PLACEHOLDER]
cd example-11/frontend
npm install
```

You’ll need to set up your environment variables. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your contract address:

```
VITE_LOTTERY_ADDRESS=0xYourDeployedContractAddress
```

This is the address you got when you deployed the contract in Part 1. The frontend needs this to know which contract to interact with.

### The ABI File (Don’t Skip This)

Okay, this trips up everyone. Pay attention.

When you deployed the contract in Part 1, Hardhat generated compilation artifacts. One of those artifacts is the ABI (Application Binary Interface). Think of it as the contract’s instruction manual. It tells your frontend what functions exist, what parameters they take, what they return.

Without the ABI, your frontend is blind. It can see the contract address, but it has no idea how to talk to it.

**Copy the ABI to the frontend:**

1. Navigate to `contract/artifacts/contracts/CrossChainLottery.sol/CrossChainLottery.json`
2. Copy the entire `abi` array from that file
3. Create `frontend/src/contracts/abi.json` and paste it there

Or just do this:

```bash
# From the project root
cd contract
npx hardhat compile
cd ..
cp contract/artifacts/contracts/CrossChainLottery.sol/CrossChainLottery.json frontend/src/contracts/abi.json
```

The frontend imports this ABI in `src/config/contracts.js` and uses it for all contract interactions.

Without the ABI, the frontend can’t talk to the contract. With it, everything works.

---

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

### Reading Contract Data (The useLottery Hook)

We built a custom hook called `useLottery` that pulls lottery data from the contract. Lives in `src/hooks/useLottery.js`:

```jsx
export function useLotteryDetails(lotteryId, chainId) {
  const { lotteryAddress } = useLottery(chainId)
  const [lottery, setLottery] = useState(null)
  const publicClient = usePublicClient({ chainId })

  const fetchLottery = async () => {
    const data = await publicClient.readContract({
      address: lotteryAddress,
      abi: LOTTERY_ABI,
      functionName: 'getLottery',
      args: [lotteryId],
    })

    const [id, prizePool, entryFee, startTime, endTime, participantCount, winner, state, prizeClaimed] = data

    setLottery({
      id: Number(id),
      prizePool: formatUnits(prizePool, 6), // RUSD has 6 decimals
      entryFee: formatUnits(entryFee, 6),
      startTime: Number(startTime),
      endTime: Number(endTime),
      participantCount: Number(participantCount),
      winner,
      state: Number(state),
      prizeClaimed,
    })
  }

  useEffect(() => {
    fetchLottery()
  }, [lotteryId, lotteryAddress, chainId])

  return { lottery, refetch: fetchLottery }
}
```

This hook calls `getLottery` on the contract, parses what comes back, and formats it so the UI can actually display it. The `refetch` function lets components manually refresh after transactions complete.

We use `publicClient.readContract` for reads (free, no signatures needed). For writes, we use `writeContract` (costs gas, requires signatures).

