Blockchains weren't designed for randomness. They were designed for verification.

Every node needs to independently execute transactions and arrive at the same state. That's how consensus works. That's how trust is achieved without a central authority.

This creates a fundamental constraint: if everyone executes the same code with the same inputs, everyone gets the same outputs.

That's perfect for financial transactions. Your balance should be deterministic. Your NFT ownership should be deterministic. Smart contract execution should be deterministic.

But for lotteries, that determinism becomes a limitation.

A truly random lottery outcome should be unpredictable. But blockchain execution is designed to be identical every time you run it.

The challenge isn't finding *a* solution. It's finding a solution that maintains blockchain's core properties:

- Verifiable by everyone
- Trustless (no central party)
- Deterministic (same inputs → same outputs)
- Decentralized (no single point of control)

While also providing genuine randomness.

That's a narrow design space.

---

## What Makes a Lottery Fair?

A fair lottery needs three guarantees:

**1. Unpredictability**
Nobody can know the winner before the draw happens. Not the organizer, not the participants, not anyone observing.

**2. Unmanipulability**
Nobody can influence which participant wins. The outcome is determined by a process that no single party controls.

**3. Verifiability**
Everyone can check that the rules were followed and the winner was selected correctly. No hidden steps, no trusted intermediaries.

Traditional lotteries achieve this through physical randomness. Numbered balls in a cage. Spinning wheels. Physical processes that provide entropy.

On a blockchain, we don't have physical entropy. Every value comes from computation. Every computation is deterministic.

We need mathematical guarantees instead of physical ones.

That's where threshold cryptography comes in.

---

## What Actually Happens On-Chain
