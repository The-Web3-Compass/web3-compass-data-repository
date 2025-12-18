# Preface

Created: December 5, 2025 7:34 PM

# Welcome to dcipher by example: Building the Impossible

You've probably hit the wall before. You're building something on-chain and suddenly realize you need randomness—actual randomness, not the "hash a block number and pray" kind. Or you want to run a sealed-bid auction but everything on the blockchain is public, so bids are about as secret as a billboard on the highway. Or maybe you just want to move tokens from one chain to another without going through some bridge that'll probably get hacked next month.

These aren't edge cases. They're fundamental gaps in what smart contracts can do, and they've been blocking entire categories of applications from existing.

**dcipher tries to fill those gaps.**

But to understand how, we need to start with the core building blocks it brings to the table.

---

## The Three Primitives

Before we talk about building applications, here are the three capabilities dcipher introduces—each one plugging a hole that blockchains have had since day one.

**Verifiable Randomness** – You make a request, the network generates an unpredictable random number, and you get it back with a cryptographic proof that nobody tampered with it. No miners reorging blocks to change the outcome. No validators skipping your transaction because they don't like the number. Just actual, verifiable randomness you can use in your lottery, your game, your NFT mint, whatever.

**Blocklock Encryption** – Encrypt something right now and set it to auto-decrypt at block 1,000,000. Until that block arrives, it stays locked. You can't decrypt it early. The dcipher operators can't decrypt it early. Nobody can. When block 1,000,000 hits, the network automatically handles the decryption. It's like writing a letter, putting it in a time-locked safe, and throwing away the key—except the safe opens itself exactly when you planned.

**Cross-Chain Swaps** – Post an intent saying you want to swap USDC on Arbitrum for ETH on Base. Solvers see it, compete to give you the best rate, and whoever wins executes the swap atomically. No bridges involved. No wrapped tokens. No praying that some validator set doesn't rug you. Either the full swap happens or nothing does.

Now, these primitives sound powerful—because they are—but what makes them actually *usable* is the cryptographic engine running underneath.

---

## Threshold Cryptography in 30 Seconds

If you're wondering how dcipher delivers these guarantees without asking you to trust some giant multi-sig in the sky, here's the quick version:

Take a private key and split it into pieces across a bunch of operators. Set it up so you need, say, 7 out of 10 pieces to actually use the key. Now no single operator can do anything alone, but when enough cooperate, they can collectively sign messages, decrypt data, or generate randomness. You'd have to compromise most of them at once to break the system, and they're distributed globally with real economic incentives to behave.

That's it. The math involves Shamir secret sharing and threshold signatures and distributed key generation, but you don't need to dig into any of that. The important part is: **you just call functions**, and dcipher handles the coordination and cryptography behind the scenes.

With that foundation, we can finally talk about what developers can actually build.

---

## What You Can Build Now

This isn't about incremental improvements or "slightly better tooling."

This is about unlocking entire categories of applications that were previously impossible.

Run a lottery on one chain where winners get paid out on whatever chain they prefer. Build a prediction market where bets stay encrypted until the event happens, then automatically resolve. Create a game with provably fair dice rolls where players can deposit from any chain. Make a marketplace where offers are hidden until they expire and payments settle cross-chain without trusted intermediaries.

And we won't just show you the theory—we'll walk through examples. Short, focused, composable code snippets that introduce one concept at a time and compound into fully working applications. You'll see how each primitive works individually and how they combine to let you build things that simply weren't possible before.

Now before diving in, here's what you need to get started.

---

## What You Need

If you can write a smart contract, you're already good to go.

The only new pattern you'll deal with is async callbacks since most dcipher operations follow a request → callback flow. 

Multi-chain experience is helpful but not required.

Cryptography knowledge? Zero needed. Great if you're curious, but non-essential.

The entire point is that dcipher handles the heavy math so you can focus on building.

---

## Why Bother

We've been stuck building the same types of applications for years because the underlying primitives only allowed certain patterns. DEXes, lending markets, NFT drops—these are the things the current toolset makes easy.

But dcipher changes the baseline.

And when you change the primitive layer, you change what's possible at the application layer.

The things you couldn't figure out how to make work on-chain?

The ideas you shelved because the tech "just didn't support it"?

They're suddenly back on the table.

Let's go build it.