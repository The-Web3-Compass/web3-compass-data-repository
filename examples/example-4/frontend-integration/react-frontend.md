Both return loading states (`isBuying`, `isClosing`) for UI feedback.

**Event Watching:**

```tsx
useWatchContractEvent({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  eventName: 'WinnerPicked',
  onLogs(logs) {
    const log = logs[0]
    if (log.args.winner && log.args.prize) {
      setLatestWinner(log.args.winner)
      setLatestPrize(log.args.prize)
    }
  },
})

```

The hook watches for the `WinnerPicked` event in real-time. When dcipher's callback completes and a winner is selected, the UI updates automatically.

**Computed State:**

```tsx
const isOrganizer = address && organizer &&
  address.toLowerCase() === organizer.toLowerCase()

const isWinner = address && latestWinner &&
  address.toLowerCase() === latestWinner.toLowerCase()

```

The hook computes derived state:

- Is the connected user the organizer?
- Is the connected user the winner?

This makes conditional rendering in components trivial.

Components don't need to know about contracts, ABIs, or wagmi. They just `useLottery()` and get clean, typed data.

### Component Architecture

The UI is built from small, focused components:

**BuyTicketButton.tsx** - Handles ticket purchases:

```tsx
export function BuyTicketButton() {
  const { buyTicket, isBuying, isOpen } = useLottery()

  return (
    <button
      onClick={buyTicket}
      disabled={!isOpen || isBuying}
      className="btn btn-primary"
    >
      {isBuying ? 'Processing...' : 'Buy Ticket'}
    </button>
  )
}

```

Clean and simple. Shows loading state during transactions. Disables when lottery is closed.

**LotteryCard.tsx** - Displays current state:

```tsx
export function LotteryCard() {
  const { ticketPrice, playerCount, potSize, isOpen, winner } = useLottery()

  const getStatus = () => {
    if (winner && winner !== '0x0000000000000000000000000000000000000000') {
      return 'Completed'
    }
    if (isOpen) return 'Open'
    return 'Awaiting randomness...'
  }

  return (
    <div className="lottery-card">
      <div className="stat-row">
        <span className="stat-label">Ticket Price:</span>
        <span className="stat-value">{ticketPrice || '-'} ETH</span>
      </div>
      {/* More stat rows... */}
    </div>
  )
}

```

Pure presentation component. Reads from the hook, renders state. The `getStatus()` function provides clear user feedback about lottery phase.

**WinnerAnnouncement.tsx** - Celebrates the winner:

```tsx
export function WinnerAnnouncement() {
  const { latestWinner, latestPrize, isWinner } = useLottery()

  if (!latestWinner) return null

  return (
    <div className="winner-card">
      <h2>{isWinner ? '🎊 You Won! 🎊' : '🎉 Winner Announced! 🎉'}</h2>
      <div className="winner-address">
        {latestWinner.slice(0, 6)}...{latestWinner.slice(-4)}
      </div>
      <p className="winner-prize">Prize: {latestPrize} ETH</p>
    </div>
  )
}

```

Only renders when a winner exists. Changes message based on whether you're the winner. Simple, effective.

**App.tsx** - Orchestrates everything:

The main app component handles:

- Wallet connection state
- Component composition
- Organizer-specific controls
- Confetti animation on winner announcement

```tsx
{isOrganizer && (
  <button
    onClick={closeLottery}
    disabled={!isOpen || playerCount === 0 || isClosing}
    className="btn btn-secondary"
  >
    {isClosing ? 'Processing...' : 'Close Lottery & Pick Winner'}
  </button>
)}

```

The close button only appears for the organizer. It's disabled when inappropriate (lottery already closed, no players, transaction pending).

When the winner is announced, confetti animations trigger:

```tsx
useEffect(() => {
  if (latestWinner) {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000)
  }
}, [latestWinner])

```

The effect watches for winner changes and triggers a 5-second celebration animation.

### Why This Architecture Works

**Separation of concerns:**

- Hook handles blockchain
- Components handle rendering
- Clean boundaries between layers

**Type safety:**

- TypeScript catches errors at compile time
- Contract calls are fully typed via wagmi
- No runtime type confusion

**Reactive by default:**

- wagmi hooks auto-refresh when blockchain state changes
- Components re-render automatically
- No manual polling or refresh buttons

**Reusable patterns:**

- The hook pattern works for any contract
- Components are framework-agnostic (just React)
- Easy to test and modify

This is production-ready Web3 frontend architecture. The same patterns scale from lotteries to complex DeFi protocols.

---

## The Complete User Flow

**Key Points:**

**Phase 1 - Ticket Sales:**
Every ticket purchase adds an address to the `players` array. The contract balance grows. UI updates automatically via wagmi hooks watching contract state.

**Phase 2 - Closure:**
When organizer closes, `isLotteryOpen` flips to `false`. No more tickets can be bought. The randomness request is sent to dcipher. The UI immediately reflects the closed state.

**Phase 3 - Randomness Generation:**
This happens off-chain in the dcipher network. Users just see "Awaiting randomness..." The frontend's `useWatchContractEvent` is listening for the `WinnerPicked` event.

**Phase 4 - Winner Selection:**
When the callback arrives, everything happens atomically: winner selected, prize sent, event emitted. The frontend catches the event and updates immediately with confetti and winner announcement.

---

## What Actually Happened Behind the Scenes

**Your Perspective:**

You deployed a contract. You bought tickets (or watched others buy). The organizer closed the lottery. About 30 seconds later, a winner appeared.

Simple user experience. Complex infrastructure underneath.

**dcipher's Perspective:**

The moment `closeLotteryAndRequestRandomness()` was called, dcipher operators saw the request on-chain.

**Security Guarantees:**

No single operator could:

- Generate the random value alone (they only have a key share)
- Predict the outcome (requires threshold cooperation)
- Manipulate the result (math enforces correctness)

No participant could:

- Buy tickets after seeing the random value (lottery closed first)
- Choose whether to participate based on outcome (commitment made upfront)
- Influence which number gets generated (threshold network is decentralized)

The fairness is cryptographic, not organizational. The math enforces it.

---

## Extending the Pattern

You have a working fair lottery. The contract is secure, the frontend is clean, the randomness is verifiable.

<aside>
💡

You can find the complete code here 

[https://github.com/The-Web3-Compass/dcipher-by-example](https://github.com/The-Web3-Compass/dcipher-by-example)

</aside>

Where do you take it from here?

