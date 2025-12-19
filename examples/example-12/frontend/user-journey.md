## From Smart Contract to Actual Product

So you’ve got a contract that does sealed bids with blocklock and cross-chain payments with only swaps. The Solidity compiles. The tests pass. You could deploy it right now and everything would function exactly as written.

Cool. Now what?

Because here’s the uncomfortable truth: a smart contract sitting on Base Sepolia isn’t a product. It’s infrastructure. If the only way to interact with your sealed bid marketplace is through Hardhat tasks and ethers.js scripts, you’ve built something technically impressive that exactly zero normal humans will ever use.

What you need is a frontend. Not just any frontend—one that takes all this cryptographic complexity and makes it feel simple. Where someone can browse listings, place an encrypted bid without knowing what a ciphertext is, and pay from Avalanche while the auction runs on Base without understanding how only swaps works.

That’s the gap between “it works” and “people will actually use this.”

This is Part 2. We’re building the interface that makes sealed bid auctions feel obvious instead of impossible.

We’re using React with Vite because it’s fast and doesn’t get in the way. Wagmi handles all the wallet and contract interaction stuff. We built our own design system because we wanted something specific. And we’re integrating **blocklock-js** for client-side encryption and **onlyswaps-js** for cross-chain payment monitoring.

The full code is on GitHub: [**Example-12**](https://github.com/The-Web3-Compass/dcipher-by-example/tree/main/Example-12)

Clone it, run `npm install`, and you’re ready. But before you just fire it up, let’s walk through how it actually works. Not every line of code—you can read the repo for that. The flow. The integrations. The parts that make this different from a standard React dApp.

By the end, you’ll know how to build frontends that use dcipher primitives. Not just for auctions. For anything that needs time-locked encryption or cross-chain functionality.

Let’s bridge the gap between contract and product.

---

## The User Journey (What Actually Happens)

Forget the code for a minute. Let’s walk through what someone actually experiences when they use this marketplace. Not as a developer. As a person who just wants to bid on something without getting front-run.

**1. Connect Wallet**

User lands on the page. Sees the marketplace. Clicks “Connect Wallet.” MetaMask (or whatever) pops up. They approve. Now they’re connected to Base Sepolia.

**2. Browse Listings**

The frontend automatically fetches all active listings from the contract. Each listing shows the item details, minimum bid, how many bids have been placed, and two critical timestamps: when bids will be revealed and when bidding ends.

If a listing is still active and hasn’t hit the end block yet, they can bid on it.

**3. Place a Bid**

User finds something they want. Clicks “Place Bid.” A modal pops up asking for their bid amount.

Here’s where it gets interesting. They enter their bid—let’s say 50 RUSD. The frontend uses **blocklock-js** to encrypt that bid amount with the listing’s reveal block height as the decryption condition. This happens entirely in the browser. The encrypted ciphertext never leaves their machine until they submit the transaction.

They click “Submit Bid.” The frontend calls `submitBid` on the contract with the encrypted ciphertext and a callback gas limit. They also send a small amount of ETH to pay for the decryption callback later.

Transaction confirms. Their bid is now on-chain, completely encrypted. Nobody can see what they bid. Not other bidders. Not the seller. Not even the contract.

**4. Wait for Reveal**

Time passes. Other people bid. All encrypted. The frontend shows a countdown: “Bids reveal in X blocks.”

When the blockchain reaches the reveal block height, the dcipher network automatically decrypts all bids and calls back to the contract. The frontend polls for state changes and updates the UI when bids are revealed.

Now everyone can see all the bid amounts, but bidding is closed. Nobody can submit new bids based on what they see.

**5. Winner Selection**

Once the end block is reached, anyone can trigger winner selection. User clicks “Select Winner.” The contract iterates through all revealed bids, finds the highest one that meets the minimum, and declares that bidder the winner.

The listing state changes to ENDED. The frontend updates to show who won and for how much.

**6. Payment (Same-Chain)**

If the user won and wants to pay on Base Sepolia (same chain), they click “Pay Now.”

First, they need to approve the marketplace contract to spend their RUSD. The frontend handles this with a token approval transaction. User signs. Approval goes through.

Then they call `payForItem`. User signs again. Transaction confirms. RUSD moves from winner to seller. Listing marked as SETTLED.

**7. Payment (Cross-Chain)**

If the user won and wants to pay from Avalanche Fuji instead, they select “Pay from Avalanche Fuji” and click “Pay Cross-Chain.”

The frontend calls `payForItemCrossChain` with the destination chain ID, destination token address, and a solver fee. The contract approves the only swaps router, calls `requestCrossChainSwap`, and creates a swap intent.

Solvers watching the only swaps network see this intent and compete to fulfill it. One solver sends RUSD to the seller on Base from their own liquidity. They then submit proof to the dcipher network. Once verified, that solver gets reimbursed on Avalanche by pulling the winner’s funds.

Seller gets paid on Base. Winner pays from Avalanche. No bridge. No wrapped tokens. Just works.

That’s the entire user flow. Now let’s see how the code makes this happen.

---
