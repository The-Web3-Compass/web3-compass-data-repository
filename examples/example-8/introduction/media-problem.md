# Building Time-Locked Media: From Text Messages to Video Files

You've got time-locked messages working. Text encrypts client-side, sits on-chain, and decrypts automatically when the target block arrives. The key literally doesn't exist until the blockchain produces it.

Simple. Elegant. Secure.

But here's the thing—text is tiny. A birthday message? Maybe 500 bytes. Your entire message history for a year? Probably 100 KB if you're chatty.

Now think about a product demo video. Two minutes at 1080p resolution. That's 50 megabytes.

The naive approach would be treating it exactly like a message. Encrypt the video. Store it on-chain. Request decryption later. Easy, right?

Let's do some quick math. Base Sepolia charges roughly 16 gas per byte of calldata. For a 50 MB video:
- 50,000,000 bytes × 16 gas = 800,000,000 gas
- At 0.05 gwei per gas = 0.04 ETH
- At $2000/ETH = $80

And that's on testnet. On Ethereum mainnet? Gas could be 50 gwei. Same transaction would cost you $4,000.

Oh, and we haven't even talked about block gas limits yet. Ethereum blocks max out around 30 million gas. Your video would need THREE ENTIRE BLOCKS just to upload. Good luck with that.

This doesn't scale. Not economically. Not practically. Not even close.

So what's the move?

Here's the key insight: **separate data from coordination.**

Messages bundle everything together because they're small enough. Media files? They need a different approach. We're splitting responsibilities:
- **Encrypted content** → Lives on decentralized storage (IPFS, Arweave)
- **Metadata and orchestration** → Lives on blockchain (smart contract)
- **Time-lock mechanism** → Stays exactly the same (still blocklock)

The cryptography doesn't change at all. Still client-side encryption. Still targeting future blocks. Still IBE with dcipher. All identical.

What changes is the storage architecture. We're building a hybrid system where different pieces live in different places, all coordinated by the blockchain.

That's what we're building here.
