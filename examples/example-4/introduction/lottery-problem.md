## The Problem with Picking Winners (And Why Most Lotteries Aren't Fair)

Every on-chain lottery faces the same fundamental challenge:

Picking a winner that nobody could predict or manipulate.

It sounds simple. Generate a random number. Use it to select from the players array. Done.

Except blockchains are terrible at randomness.

Not because developers haven't tried. But because determinism is fundamental to how blockchains work.

Every node must execute the same code and get the same result. That's consensus. That's how we achieve global agreement without central coordination.

But if everyone gets the same result, where does randomness come from?

The usual approaches have serious problems:

**Block timestamps?** Miners control these within a range. They can choose to mine or skip a block based on whether the outcome favors them.

**Block hashes?** Predictable to anyone who can compute the next hash. Not random, just pseudo-random.

**Off-chain oracles?** Now you're trusting whoever runs that oracle. The decentralization problem just moved elsewhere.

Here's what makes this harder than it seems:

```solidity
winner = players[block.timestamp % players.length];
```

This line looks innocent. It compiles. The tests pass. It even seems to work.

But the miner mining this block can calculate which player wins *before committing the block*. If they're a participant (or colluding with one), they can choose whether to include this transaction based on the outcome.

The lottery looks fair on the surface. The code is transparent. Anyone can audit it.

But it's quietly exploitable.

That's the problem we're solving.

---
