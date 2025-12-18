# Understanding the Two-Transaction Pattern

Before we write any code, let's walk through exactly what happens when someone mints an NFT. Understanding this flow makes the implementation obvious.

## The Two-Transaction Pattern

Here's the thing about using threshold randomness for NFTs: **the mint and the trait assignment happen in separate transactions.**

This is not a bug. It's a feature. Let me explain why.

### Transaction 1: The Mint

1. User calls `mint()` on your contract
2. Contract mints them an NFT with a new token ID
3. Contract requests randomness from dcipher for that token ID
4. Contract emits an event with the request ID
5. Transaction completes
6. **User owns an NFT… but its traits aren't determined yet**

### The Waiting Period: Threshold Magic

Between the two transactions, the dcipher network is working:

- dcipher network operators see the randomness request
- Multiple independent nodes start their threshold signing process
- Each generates a partial signature using their key share
- Partials get aggregated into one complete threshold signature
- **This takes ~10-30 seconds** depending on network conditions

### Transaction 2: The Callback

1. dcipher calls back into your contract with the verified random value
2. Your `onRandomnessReceived()` function executes
3. You derive traits from the random value and store them
4. The NFT's traits are now locked in and visible
5. Anyone can read the traits from the contract

---

## Why This Pattern Makes Sense

At first, this might feel weird. "Why can't traits be instant?"

**Because instant = predictable.**

If traits are determined in the same transaction as the mint, they must be derived from data available in that transaction:
- Block hash
- Timestamp  
- Transaction parameters

All of these are predictable or manipulable.

**The two-transaction pattern with an async callback is what gives you unpredictability.**

The traits are determined by a threshold signature that didn't exist when the mint transaction was submitted. Nobody—not the minter, not the contract deployer, not the block producer—could know what that signature would be.

---

## Handling the Reveal UX

"But users want instant reveals!"

You have two options:

### Option 1: Progressive Reveal (What We'll Build)

- Show the NFT as "Revealing…" immediately after mint
- Display final traits when the callback completes
- This takes 10-30 seconds
- Most users will wait if you set expectations upfront
- OpenSea and other marketplaces will update automatically when metadata changes

### Option 2: Batch Minting

- Let users mint, traits reveal over the next minute
- They get excited watching it happen
- Turn the async nature into a feature
- "Your legendary trait is being sealed by threshold cryptography…" sounds way cooler than instant anyway

We'll implement Option 1 because it's simpler, but both work.

---

## Visual Flow

Here's what the complete flow looks like:

```
User Wallet                Contract                 dcipher Network
     |                         |                            |
     |------ mint() ---------->|                            |
     |                         |                            |
     |<---- NFT minted --------|                            |
     |    (traits = "Revealing")|                           |
     |                         |                            |
     |                         |--- randomness request ---->|
     |                         |                            |
     |                         |                    [Operators generate]
     |                         |                    [partial signatures]
     |                         |                    [Aggregate threshold]
     |                         |                    [signature]
     |                         |                            |
     |                         |<--- callback with random --|
     |                         |                            |
     |                         |[Store traits]              |
     |                         |[Emit TraitsRevealed]       |
     |                         |                            |
     |--- getTraits() -------->|                            |
     |<--- traits returned ----|                            |
     |    (shape, color, size) |                            |
```

**Key insight:** The gap between the mint and the callback is what makes the randomness unpredictable. That gap is filled by threshold cryptography happening off-chain but verified on-chain.

---

## What This Means for Your Contract

Your contract needs to handle three states for each NFT:

1. **Not minted yet** — token doesn't exist
2. **Minted but revealing** — token exists, `tokenTraitSeed` is zero
3. **Fully revealed** — token exists, `tokenTraitSeed` is set, traits are final

The contract code we'll write handles all three states cleanly. When someone queries traits before the callback, they get "Revealing" for all traits. After the callback, they get the real traits.

Simple. Predictable. Impossible to manipulate.

Let's build it.
