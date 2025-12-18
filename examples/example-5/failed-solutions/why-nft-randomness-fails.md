# Why Traditional Approaches Fail

Before we build the right solution, let's understand why the common approaches keep failing. This isn't about pointing fingers—it's about understanding the fundamental constraints we're working with.

## The "Trust Us, We're Nice" Reveal

This is the most common pattern in NFT launches:

1. Team generates all metadata ahead of time
2. Every trait, every rarity, every legendary is pre-determined
3. Files get uploaded to IPFS
4. Team promises a "fair, random shuffle" after mint completes

**The Problem**: Someone knows the mapping before the public does.

Maybe it's the founders. Maybe it's a contractor. Maybe it's a script on someone's laptop. Doesn't matter.

If *anyone* knows which token IDs map to rare traits before minting finishes, the entire system relies on trust.

And trust is exactly what blockchains were designed to eliminate.

### Real-World Consequences

- Doxxed teams still mess up
- Good reputations still crack under pressure
- Promises don't survive financial incentives
- By the time the community notices, rare traits are already concentrated in a few wallets

---

## The "On-Chain = Safe" Shortcut

Then there's the pseudo-random on-chain approach. It looks decentralized and feels clever:

```solidity
uint256 randomish = uint256(
    keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))
);
```

**Why it feels right:**
- It's cheap (no external calls)
- It's on-chain (no centralized oracle)
- It's deterministic (same inputs = same output)

**Why it fails:**

That determinism is the problem.

### The Attack Vector

1. **Validators see the future**: Block producers can see what the result will be before finalizing the block
2. **Users can simulate**: Anyone can fork the chain locally and dry-run their mint transaction
3. **MEV bots decide**: Sophisticated actors submit transactions only when outcomes are favorable

**What actually happens:**
- Good outcome? Transaction goes through
- Bad outcome? Transaction gets dropped
- Your "random" mint becomes a game for whoever has the best tooling

The people who *don't* do this? They're minting blind while others cherry-pick.

---

## Other Failed Attempts

### Using Future Block Hashes

**The idea**: Use a future block hash as randomness source

**The problem**: 
- Miners can influence or withhold blocks
- If the rare trait is worth more than the block reward, miners have incentive to manipulate
- Still deterministic once the block is mined

### Commit-Reveal Schemes

**The idea**: Users commit to a value, then reveal it later to generate randomness

**The problem**:
- Users can choose not to reveal if the outcome is unfavorable
- Requires multiple transactions per mint (expensive)
- Still vulnerable to the last revealer manipulating the outcome

### Centralized Oracles

**The idea**: Trust a single oracle service to provide randomness

**The problem**:
- Single point of failure
- Requires trusting the oracle operator
- Oracle can be bribed or compromised
- Defeats the purpose of decentralization

---

## The Core Issue

Here's the fundamental problem, no buzzwords:

**Blockchains are deterministic machines.**

- If randomness is derived from on-chain state → it can be calculated
- If it can be calculated → it can be predicted
- If it can be predicted → someone will exploit it

This isn't a Solidity limitation. This isn't an Ethereum flaw. This is how deterministic systems work.

**What we actually need:**

Randomness that:
1. Comes from outside the mint transaction (unpredictable)
2. Is still verifiable on-chain (trustless)
3. Cannot be manipulated by any single party (decentralized)

That's exactly what threshold randomness provides.
