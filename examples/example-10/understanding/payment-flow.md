## The Complete Payment Flow

Before we dive into deployment, let’s visualize what actually happens when a customer pays:

```
Avalanche Fuji                          Base Sepolia
(10:40:45 AM)                           (10:40:52 AM)
     │                                       │
     │  Payer pays 15.01 FUSD                │
     │  ───────────────────►                 │
     │                                       │
     │         OnlySwaps Solver              │
     │  ◄─────────────────────────────────►  │
     │         (7 seconds!)                  │
     │                                       │
     │                    Merchant receives  │
     │                    14.25 FUSD         │
     │                    ◄──────────────────│
     │                                       │
     ▼                                       ▼
```

Seven seconds. That’s how long it takes for value to move from Avalanche to Base.

Let’s break down what happens in those seven seconds:

**10:40:45 AM - Payment Initiated (Avalanche Fuji)**
- Customer calls `makePayment()` on the gateway contract
- Contract pulls 15.01 FUSD from customer (15.00 payment + 0.01 solver fee)
- Contract approves the router to spend tokens
- Contract calls `router.requestCrossChainSwap()`
- Router emits `SwapRequested` event
- Transaction confirms on Avalanche

**10:40:46-51 AM - Solver Monitoring (Off-chain)**
- Solver bots watching Avalanche see the event
- One solver calculates: “Can I profit from fulfilling this?”
- Solver checks: Do I have 14.25 FUSD on Base? Yes.
- Solver checks: Is gas price on Base reasonable? Yes.
- Solver decides: I’ll fulfill this swap.

**10:40:52 AM - Settlement (Base Sepolia)**
- Solver sends 14.25 FUSD to merchant’s address on Base
- Merchant receives funds immediately
- Solver later claims the 15.00 FUSD locked on Avalanche (plus their 0.01 fee)

Total time: 7 seconds.
Total transactions: 2 (one on each chain)
User experience: Click button, merchant gets paid.

This is fundamentally different from bridges where you wait 5-15 minutes for cross-chain messaging.

---
