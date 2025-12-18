## The Only Swaps Architecture

Instead of traditional bridges, we use **only swaps** - a protocol designed specifically for cross-chain swaps.

Here's the key insight: you don't need to move the actual tokens. You need to move *value*.

Think about it like this. Imagine a network of professional market makers called "solvers." These solvers have capital sitting on multiple chains. When you want to move value from Chain A to Chain B, here's what happens:

You lock tokens on Chain A. A solver immediately sends you equivalent tokens on Chain B. The solver later claims your locked tokens on Chain A. Everyone profits—you get a fast transfer, the solver gets a fee.

It's atomic. It's fast (seconds, not minutes). It doesn't require traditional bridges.

Compare the flows:

Traditional bridge takes you on a journey: Lock → Wait → Mint → Swap → Wait → Receive. That's 15+ minutes of your life you're not getting back.

Only Swaps? Lock → Solver fulfills → Receive. We're talking 10-30 seconds.

The solver takes the bridging risk and provides instant liquidity. You get speed. They get fees. Everyone wins.

---
