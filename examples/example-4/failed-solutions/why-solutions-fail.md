Let's trace what happens when you try to pick a lottery winner using block properties.

Say your lottery has 100 participants.

You write this code:

```solidity
uint256 randomIndex = block.timestamp % 100;
winner = players[randomIndex];
```

You submit the transaction to close the lottery and pick the winner.

The transaction enters the mempool.

Miners see it.

This is where things get interesting.

A miner can execute your transaction locally before including it in a block. They can see which address would win. They can calculate whether they or someone they know would benefit.

If the outcome favors them? Include the transaction.

If it doesn't? Skip it. Wait for the next block. Try again.

They're not breaking any consensus rules. They're just exercising their normal discretion about which transactions to include.

But from the participants' perspective, the lottery isn't fair anymore.

The miner has information nobody else has. They can influence the outcome without anyone knowing.

At that point, it's no longer a random drawing.

It's a game where one participant can see the outcome before committing.

And once you see it clearly, the conclusion is unavoidable:

**Using block properties for randomness gives miners an unfair advantage.**

If we want lotteries to be fair, we need a source of randomness that miners can't predict or manipulate.

---

## The Current "Solutions" (And Why They Still Have Problems)

When developers hit the randomness problem, they try various workarounds. Most have subtle vulnerabilities.

### Future Block Hashes

**The Idea:** Record current block number. Wait N blocks. Use the hash of block+N as your random seed.

**Why It Fails:** The miner of block+N knows the hash before committing. If the lottery prize exceeds their block reward, they can profitably orphan their own block to change the outcome.

This isn't theoretical. It's happened on chains with low block rewards.

### Commit-Reveal with Organizer

**The Idea:** Organizer commits to a random hash. After lottery closes, they reveal the preimage. Contract verifies and uses it.

**Why It Fails:** Trust requirement. The organizer can generate thousands of candidates and commit to the one that benefits them. Or simply not reveal if the outcome is unfavorable.

You've replaced trustless cryptography with trusting a single party.

### Chainlink VRF

**The Reality:** Chainlink VRF actually works. It's production-ready, secure, and widely used.

**The Tradeoffs:**

- External oracle dependency
- LINK token management
- Integration complexity
- Additional infrastructure

For many projects, these tradeoffs are acceptable. VRF is a solid choice.

But there's an alternative that's architecturally simpler: threshold randomness with dcipher.

No external tokens. No oracle management. Direct integration with your contract.

That's what we're building.

---

