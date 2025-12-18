# Why Every "Solution" Keeps Breaking

Alright, let's talk about all the ways people have tried to solve NFT randomness. Spoiler: they all fail. Not because developers are lazy, but because the problem is genuinely hard.

Here's the thing—every approach you've seen in the wild has a fatal flaw. And once you understand *why* they break, the need for threshold randomness stops feeling like overkill and starts feeling obvious.

---

## The "Trust Us, We'll Shuffle Later" Approach

You've definitely seen this one. It's everywhere.

Here's how it works:

The team generates all the metadata before launch. Every trait. Every rarity. Every legendary 1-of-1. They upload everything to IPFS, assign token IDs, and then promise they'll do a "provably fair shuffle" after the mint ends.

Sounds reasonable, right?

Except someone already knows which token IDs are rare.

Maybe it's the founder. Maybe it's the dev who wrote the metadata script. Maybe it's just sitting in a JSON file on someone's desktop. Doesn't really matter who.

The point is: **if anyone knows the mapping before minting finishes, the whole thing runs on trust.**

And we're supposed to be building trustless systems here.

### What Actually Happens

Teams mess up. Even the doxxed ones. Even the ones with good reputations.

Because when there's enough money on the line, incentives get weird. Promises crack. And by the time the community figures it out, the rare traits are already sitting in a handful of wallets.

You can't audit trust. You can only hope it holds.

---

## The "Just Hash Some Stuff" Method

Then there's the on-chain version. The one that looks smart at first glance:

```solidity
uint256 randomish = uint256(
    keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))
);
```

This feels right because:
- It's cheap. No oracle fees.
- It's on-chain. No external dependencies.
- It's deterministic. Same inputs always give the same output.

And that last part? That's exactly why it breaks.

### Here's the Problem

Blockchains are deterministic by design. That's the whole point. But deterministic randomness isn't random—it's just math.

So what happens?

**Validators can see the future.** They know what the hash will be before they finalize the block.

**Users can simulate locally.** Anyone can fork the chain, run the mint transaction in a sandbox, and see what traits they'd get.

**MEV bots make decisions.** If the outcome is good, submit the transaction. If it's bad, drop it.

Your "random" mint just became a cherry-picking game for anyone with decent tooling.

And everyone else? They're minting blind.

---

## The Other Stuff People Have Tried

### Future Block Hashes

**The pitch:** "We'll use a block hash that doesn't exist yet. No one can predict the future!"

**The catch:** Miners can.

If a rare NFT is worth more than a block reward, a miner has every reason to reorg the chain or withhold a block. And even if they don't, the hash is still deterministic once the block gets mined. Same problem, just delayed.

---

### Commit-Reveal Schemes

**The pitch:** "Users commit to a secret value, then reveal it later. We combine all the reveals to generate randomness!"

**The catch:** What if someone just… doesn't reveal?

If the outcome looks bad, they walk away. And even if you force reveals with penalties, the *last* person to reveal still has influence over the final result. Plus, this requires multiple transactions per mint. Expensive. Clunky. Still exploitable.

---

### Centralized Oracles

**The pitch:** "We'll use a trusted oracle to feed us randomness!"

**The catch:** You just reinvented the trust problem.

Single point of failure. Single entity to bribe. Single operator who could rug. You're back to square one, except now you're also paying oracle fees.

If you wanted to trust a centralized party, you could've just used a database.

---

## Why This Keeps Happening

Blockchains are deterministic machines. That's not a bug. That's the feature that makes them work.

But it also means:
- If randomness comes from on-chain state, it can be calculated.
- If it can be calculated, it can be predicted.
- If it can be predicted, someone *will* exploit it.

This isn't a Solidity problem. It's not an EVM quirk. It's just how deterministic systems behave.

So if you want NFT traits that are actually unpredictable—where even *you* don't know what's coming—you need randomness that:

1. Comes from outside the transaction (so it can't be simulated)
2. Is still verifiable on-chain (so you don't have to trust anyone)
3. Can't be manipulated by any single party (so no one can rig it)

That's threshold randomness.

And that's what we're building next.
