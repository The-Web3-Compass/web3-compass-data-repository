# Random NFT Traits: Making Your JPEGs Actually Unpredictable

If you've made it this far, you already understand dcipher randomness at a mechanical level. You've requested randomness. You've waited for the callback. You've used the value on-chain. Nothing about that feels magical anymore.

And this is usually the exact point where a developer leans back and thinks:

*"Okay… cool. But when do we stop doing toy examples?"*

Right now. This is where we stop.

We're about to plug that same randomness flow into one of the most controversial, quietly broken parts of Web3: **NFT trait generation**.

Not the marketing version of randomness. Not the `block.timestamp` version. Not the "trust us, we'll reveal later" version.

The real version. The kind where even **you,** the person deploying the contract, cannot know what traits an NFT will end up with ahead of time.

That's not a limitation. That's the entire point.

---

## The Part Everyone Pretends Isn't a Problem

Let's be honest. If NFT randomness is even *slightly* predictable, someone will abuse it.

Not because people are evil. Because incentives exist.

People will simulate mint transactions locally. They'll fork the chain and dry-run mints. They'll decide whether to submit or drop a transaction based on the outcome.

And the people who *don't* do this? They're minting blind.

That's how you end up with launches where a handful of wallets somehow scoop up most of the rare traits, and everyone else only notices after the fact.

At that point, the damage is already done.

So let's talk about how NFT projects usually handle this, and why it keeps going sideways.

![NFT Sniping Problem](https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/examples/example-5/images/nft-sniping-problem.png)

---

## How NFT Randomness Usually Goes Wrong

Most NFT projects handle randomness in one of two ways:

1. **Pre-generated metadata with a "trust us" reveal** — The team knows which tokens are rare before anyone mints, and promises to shuffle fairly later.

2. **On-chain pseudo-randomness** — Using `block.timestamp`, `msg.sender`, or block hashes to generate traits that look random but are actually predictable.

Both approaches fail for different reasons, but the outcome is the same: someone with better tooling or inside knowledge ends up with the rare traits.

We'll break down exactly why these methods fail in the next section. But first, let's understand the core problem.

---

## The Actual Problem (No Buzzwords)

Here's the core issue, stripped down completely:

Blockchains are deterministic machines.

If randomness is derived from on-chain state, it can be calculated.
If it can be calculated, it can be predicted.
If it can be predicted, someone will take advantage of it.

That's not a Solidity problem. That's not an Ethereum flaw. That's just how deterministic systems work.

So if we want NFT traits that are *actually* unpredictable, the randomness has to come from outside the mint transaction while still being verifiable on-chain.

That's where threshold randomness comes in.
