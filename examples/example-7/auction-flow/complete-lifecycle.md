# Complete Auction Lifecycle

Before we write Solidity, let's walk through exactly what happens in a blocklock-encrypted auction. Understanding the flow makes the code obvious.

---

## Creating the Auction

Someone wants to run an auction. Maybe they're selling access to something. Maybe it's a prediction market. Maybe it's a competition where the highest bidder wins some privilege.

They call `createAuction()` on our contract, specifying:
- A description (what's being auctioned)
- Minimum bid amount
- Auction end block (when bids decrypt)

The contract stores this info. Now it's live and ready for bids.

---

## Submitting Encrypted Bids

You want to participate. You decide your bid is 3.7 ETH.

You run the blocklock-js library off-chain:

```javascript
const bidAmount = ethers.parseEther("3.7");
const encodedBid = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [bidAmount]);
const blocklockjs = Blocklock.createBaseSepolia(signer);
const encryptedBid = blocklockjs.encrypt(ethers.getBytes(encodedBid), auctionEndBlock);
```

This encryption uses dcipher's public key for the specific end block. The resulting ciphertext is tied cryptographically to that block height. Cannot be decrypted early. The math prevents it.

You submit this encrypted bid to the contract along with a small fee (~0.001-0.003 ETH) to cover the gas cost of the decryption callback.

The contract stores your encrypted bid. It's on-chain now. Anyone can see there's an encrypted bid from your address. Nobody can read the amount inside. Not miners. Not other bidders. Not the auction creator. Nobody.

Other bidders do the same. Each submits their encrypted bid. All targeting the same block height for decryption.

---

## The Waiting Period

The auction is live. Encrypted bids are accumulating on-chain. Everyone's waiting for the target block.

During this time, literally no information leaks:
- You can't see what others bid
- You can't change your bid (it's encrypted and submitted)
- You can't cancel selectively based on what others did

The blockchain just grinds forward, block by block, toward the reveal height.

---

## Automatic Decryption

Block 1,000,000 arrives (or whatever your target was).

The dcipher network operators see that this block height has been reached. They see there are blocklock requests waiting for this block. They spring into action.

Each operator generates their partial signature for block 1,000,000. These partials get aggregated. When enough arrive (meeting the threshold), they combine into a complete threshold signature.

That signature is the decryption key for block 1,000,000.

One of the operators submits this key to your contract via a callback transaction. The contract receives the key through its `_onBlocklockReceived()` function (inherited from `AbstractBlocklockReceiver`).

Your contract now has the decryption key. It decrypts all the bids that targeted this block. The amounts are now readable on-chain.

---

## Determining the Winner

The contract looks at all decrypted bids. Finds the highest one. That bidder wins.

The auction is complete. The winner is publicly declared. All bid amounts are now visible on-chain for everyone to verify.

---

## What Makes This Secure

The cryptography enforces the rules:

- **Early decryption is impossible** - Not "difficult." Impossible. The decryption key literally doesn't exist until the threshold network generates it at the target block.
- **No selective revealing** - All bids decrypt at the same time because they all used the same block height. No bidder can choose whether to reveal based on others' bids.
- **No miner manipulation** - Even if a miner sees encrypted bids, they can't decrypt them. Even if they delay blocks or reorder transactions, the decryption still happens at the target block height.
- **No centralized trust** - The dcipher network is decentralized. Threshold operators don't trust each other. They can't collude below the threshold. The math enforces this.

The security isn't organizational ("we promise not to peek"). It's mathematical. The encryption scheme itself makes early decryption cryptographically infeasible.
