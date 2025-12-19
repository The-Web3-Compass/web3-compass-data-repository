## What We’re Actually Building (The Architecture)

Before we dive into Solidity, let’s understand the complete flow. Not just what the contract does, but why it’s designed this way.

### The Complete Auction Flow

**1. Seller Creates a Listing**

A seller calls `createListing` with:
- Item details (name, description, image URL)
- Minimum bid amount (in RUSD)
- Reveal block height (when bids will be decrypted)
- End block height (when bidding closes)

The contract creates a new listing, assigns it an ID, and marks it ACTIVE. The listing is now live. Bidders can see the item, the minimum bid, and the timeline, but they can’t see any bids yet.

**2. Bidders Submit Encrypted Bids**

Bidders encrypt their bid amount using blocklock with the reveal block height as the decryption condition. They call `submitBid` with:
- The listing ID
- Their encrypted bid amount (ciphertext)
- A callback gas limit (for when the bid gets decrypted)
- ETH to pay for the decryption callback

The contract stores the encrypted bid, requests decryption from the dcipher network (scheduled for the reveal block), and increments the bid counter. The bid is now locked. Nobody can see the amount. Not even the contract.

**3. Bidding Period Ends**

Time passes. More bids come in. All encrypted. All invisible. When the blockchain reaches the reveal block height, the dcipher network automatically decrypts all bids and calls back to the contract with the decryption keys.

The contract’s `_onBlocklockReceived` callback gets triggered for each bid. It decrypts the ciphertext, extracts the bid amount, and marks the bid as revealed. Now the bids are visible, but the bidding period is over. Nobody can submit new bids based on what they see.

**4. Winner Selection**

Once the end block height is reached, anyone can call `selectWinner`. The contract iterates through all revealed bids, finds the highest bid that meets the minimum, and declares that bidder the winner. The listing state changes to ENDED.

**5. Payment (Same-Chain)**

If the winner wants to pay on the same chain (Base Sepolia), they call `payForItem`. Simple ERC20 transfer. The contract moves RUSD from the winner to the seller. Payment received. Listing marked as SETTLED.

**6. Payment (Cross-Chain)**

If the winner wants to pay from a different chain (like Avalanche Fuji), they call `payForItemCrossChain` with:
- The destination chain ID
- The token address on that chain
- A solver fee (paid to whoever fulfills the swap)

The contract approves the only swaps router, calls `requestCrossChainSwap`, and creates a swap intent. Solvers watching the only swaps network see this, send RUSD to the seller on Base Sepolia from their own liquidity, then get reimbursed on Avalanche Fuji once the dcipher network verifies both sides of the swap.

The seller gets paid on Base. The winner pays from Avalanche. No bridge. No wrapped tokens. Just coordinated transfers verified by threshold signatures.

That’s the entire flow. Now let’s see the code that makes it happen.

---
