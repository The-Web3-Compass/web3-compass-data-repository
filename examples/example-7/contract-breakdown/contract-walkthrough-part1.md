# Contract Walkthrough - Part 1

At a glance, the contract might look long, but conceptually it's very simple. Almost every line exists to support one idea: **bids should be unreadable until a specific block is reached.**

---

## The Core Data Model

We start with two structs: one for auctions, one for bids.

### The Auction Struct

```solidity
struct Auction {
    address creator;
    string description;
    uint256 minBid;
    uint256 revealBlock;
    uint256 biddingDeadline;
    bool decrypted;
    address winner;
    uint256 winningBid;
    uint256 createdAt;
}
```

The `Auction` struct tracks everything you'd expect to need over the lifetime of an auction:

- Who created it
- What's being auctioned
- The minimum valid bid
- When bidding ends
- When bids are allowed to decrypt
- The result once decryption happens

The important fields are `biddingDeadline` and `revealBlock`. Those two numbers define the entire lifecycle of the auction: first a window where encrypted bids are accepted, then a hard boundary where decryption becomes possible.

### The EncryptedBid Struct

```solidity
struct EncryptedBid {
    address bidder;
    TypesLib.Ciphertext encryptedAmount;
    uint256 decryptedAmount;
    bool decrypted;
    uint256 timestamp;
}
```

This is where things get interesting.

Instead of storing a number, it stores a `TypesLib.Ciphertext`. That ciphertext is produced off-chain using blocklock-js and is mathematically bound to a future block height. Until that block exists, the data inside it is useless noise.

We still track some metadata (who submitted the bid and when), but the amount itself stays opaque.

---

## Persistent State

```solidity
uint256 public auctionCounter;
mapping(uint256 => Auction) public auctions;
mapping(uint256 => EncryptedBid[]) public auctionBids;
mapping(uint256 => uint256) public requestIdToAuction;
```

These four variables define the entire runtime state of the system:

- `auctionCounter` gives each auction a unique identifier
- `auctions` stores auction configuration and final outcome
- `auctionBids` stores encrypted bids per auction
- `requestIdToAuction` links asynchronous blocklock callbacks back to application state

That last mapping is especially important. Blocklock callbacks are asynchronous. When dcipher calls back, it doesn't know anything about your auction IDs. The contract has to remember that association itself.

---

## Creating an Auction

```solidity
function createAuction(
    string calldata description,
    uint256 minBid,
    uint256 blocksUntilReveal,
    uint256 biddingDurationBlocks
) external returns (uint256)
```

`createAuction` is intentionally straightforward.

You pass in a description, a minimum bid, how long bidding should stay open, and how far in the future the reveal block should be. The contract turns those relative values into concrete block numbers and stores them.

There's an important guardrail here:

```solidity
require(blocksUntilReveal > biddingDurationBlocks, "Reveal must be after bidding ends");
```

The reveal block must come **after** bidding ends.

That seems obvious, but it matters. If bids could decrypt while bidding is still open, the whole system collapses back into the transparency problem we started with.

Once the auction is created, it's live. The rules are fixed. There's no admin override and no way to move the goalposts later.

---

## Submitting Encrypted Bids

```solidity
function submitBid(
    uint256 auctionId,
    TypesLib.Ciphertext calldata encryptedBid
) external returns (uint256)
```

When a bidder submits a bid, they don't send ETH and they don't send a number.

They send ciphertext.

That ciphertext was created off-chain, encrypted against the auction's reveal block. The contract doesn't try to interpret it. It doesn't need to. It just stores it.

At this point, everyone can see that a bid exists, and who submitted it—but nobody, including the contract itself, can see the amount.

This is the key mental shift:

The secrecy doesn't come from the contract **choosing** not to reveal data. It comes from the contract being **cryptographically incapable** of revealing it.
