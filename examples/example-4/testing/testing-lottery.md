- Ticket Price: 0.01 ETH
- Max Tickets: 100
- RandomnessSender: 0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779

FairLottery deployed to: 0xYourContractAddressHere

Save this address for the frontend!

Waiting for block confirmations...
Verifying contract...
Contract verified on Etherscan
```

**Save that contract address.** You'll need it for every interaction from here on.

Your lottery is now live on Base Sepolia, connected to dcipher's randomness network, ready to accept tickets.

---

## The Frontend Architecture

Now that the contract is deployed, users need a way to interact with it. That's where the React frontend comes in.

The frontend architecture follows modern Web3 patterns:

- **Custom hooks** for blockchain logic
- **Component composition** for clean UI
- **wagmi** for Ethereum interactions
- **Real-time updates** via contract events

### The Custom Hook: useLottery.ts

This is the heart of the frontend. All blockchain interaction happens here.

The hook provides:

**Read Operations:**

```tsx
const { data: ticketPrice } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'ticketPrice',
  chainId: 84532,
})

```

It reads all the contract state:

- `ticketPrice` - Cost per ticket
- `playerCount` - How many tickets sold (via `getPlayerCount`)
- `potSize` - Current prize pool (via `getPotSize`)
- `isOpen` - Whether lottery accepts tickets (via `isLotteryOpen`)
- `organizer` - Who deployed the contract
- `winner` - Selected winner address

**Write Operations:**

```tsx
const { writeContract: buyTicket, isPending: isBuying } = useWriteContract()

const handleBuyTicket = () => {
  if (!ticketPrice) return

  buyTicket({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'buyTicket',
    value: ticketPrice,
  })
}

```

The hook wraps transaction functions:

- `buyTicket()` - Purchase a lottery ticket
- `closeLottery()` - Close lottery and request randomness (organizer only)

