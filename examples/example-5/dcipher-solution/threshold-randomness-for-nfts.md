# Threshold Randomness for NFTs

Now that we understand why traditional approaches fail, let's see how threshold randomness solves the NFT randomness problem.

## Quick Refresher: Threshold Cryptography

In a threshold system:

- **No single operator controls the key** — each holds only a fragment
- **A minimum number must cooperate** — threshold of operators needed to produce a result
- **No single party can force an outcome** — the math prevents individual manipulation
- **No one sees the final value ahead of time** — not even the operators generating it

Even if one operator goes rogue, the cryptography refuses to cooperate.

dcipher applies this directly to randomness generation.

---

## How This Changes NFT Launches

Instead of trusting a team, a validator, or a block producer, you rely on a network where power is **cryptographically distributed**.

Not socially distributed. Not legally distributed. **Mathematically distributed.**

### The Security Comparison

Let's compare what it takes to cheat:

![Attack Comparison Table](https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/examples/example-5/images/nft--table.png)

That last one doesn't fail because people are honest.

It fails because **the math doesn't allow it.**

---

## Why This Actually Matters for NFTs

With threshold randomness, you can finally make guarantees instead of promises:

### For Minters

- **Cannot predict traits** before minting — the randomness doesn't exist yet
- **Cannot cherry-pick outcomes** — no way to simulate and drop unfavorable transactions
- **Fair playing field** — sophisticated users have no advantage over regular users

### For Project Teams

- **Cannot rig the distribution** — you don't control the threshold network
- **No trust required** — cryptographic proof replaces reputation
- **Provably fair launches** — anyone can verify the randomness source

### For the Ecosystem

- **Truly decentralized** — no central server, no single point of failure
- **Verifiable on-chain** — signature verification is mathematical proof
- **Reasonable cost** — ~0.001 ETH per mint for real randomness

---

## The Trade-Off: Async Reveals

There's one important difference from instant pseudo-random approaches:

**Traits are revealed asynchronously** — typically 10-30 seconds after minting.

This happens because:

1. User mints NFT (Transaction 1)
2. Contract requests randomness from dcipher
3. Threshold network generates the random value
4. dcipher calls back with verified randomness (Transaction 2)
5. Traits are assigned and locked in

**Why this is actually a feature:**

- If traits were instant, they'd be derived from data in the mint transaction
- Anything in the mint transaction can be predicted or manipulated
- The async gap is what makes the randomness unpredictable

**UX Solutions:**

- Show "Revealing..." state immediately after mint
- Display final traits when callback completes (10-30 seconds)
- Turn it into an experience: "Your traits are being sealed by threshold cryptography..."
- Marketplaces update automatically when metadata changes

Most users will wait 30 seconds if you set expectations upfront. And "provably fair" is a much better selling point than "instant but manipulable."

---

## What We're Building

We're going to build an NFT collection where:

- **Traits are determined by threshold randomness** — not at deploy time, not from pseudo-random values
- **Minters cannot predict** what they'll get before minting
- **You cannot rig** which wallets get which traits
- **Miners cannot manipulate** outcomes by reordering transactions
- **The reveal is automatic** — no manual "reveal transaction" you could manipulate

Each NFT will be a colored geometric shape with three random traits:

1. **Shape** (Circle, Square, Triangle, Pentagon, Hexagon) — 5 options
2. **Color** (Red, Blue, Green, Yellow, Purple, Orange, Pink, Cyan) — 8 options
3. **Size** (Small, Medium, Large, Huge) — 4 options

That's 5 × 8 × 4 = **160 possible combinations**. Some will be rarer than others purely by chance. No artificial rarity weighting. Pure randomness.

The NFT image will be a simple SVG generated on-chain. We're not here to win design awards—we're here to prove the randomness works.

And once you understand this pattern, you can apply it to any NFT project that needs real, verifiable randomness.
