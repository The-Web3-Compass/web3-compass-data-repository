## Understanding the Contract Architecture

### The Inheritance Chain

```solidity
contract SealedBidMarketplace is AbstractBlocklockReceiver, ReentrancyGuard {
```

We’re inheriting from two critical contracts:

**AbstractBlocklockReceiver** - This is the dcipher blocklock integration. It gives us the ability to request time-locked decryption and receive callbacks when the decryption keys are ready. Without this, we’d have no way to do sealed bids. With it, we get cryptographically enforced time-locks that nobody can bypass.

**ReentrancyGuard** - OpenZeppelin’s standard protection against reentrancy attacks. Any function marked `nonReentrant` can’t be called recursively. This matters because we’re transferring tokens and changing state, which has historically been a massive attack vector. The guard prevents that entire class of exploits.

### The State Machine

```solidity
enum ListingState { ACTIVE, ENDED, SETTLED, CANCELLED }
```

Every listing moves through these states:

**ACTIVE** → Bidding is open. Bids are being submitted (encrypted). Nobody can see the bid amounts yet.

**ENDED** → Bidding closed. Winner selected. Payment pending. The winner can now claim the item by paying.

**SETTLED** → Payment received. Auction complete. Item sold.

**CANCELLED** → Listing was cancelled before completion (not implemented in this version, but the state exists for future use).

This state machine prevents bugs. You can’t select a winner twice. You can’t pay before a winner exists. You can’t bid after the auction ended. The contract enforces the flow at the type level.

### The Listing Struct

```solidity
struct Listing {
    uint256 id;
    address seller;
    string itemName;
    string description;
    string imageUrl;
    uint256 minimumBid;
    uint256 revealBlockHeight;
    uint256 endBlockHeight;
    ListingState state;
    address winner;
    uint256 winningBid;
    uint256 totalBids;
    bool paymentReceived;
}
```

This holds everything about an auction. The item details, the seller, the timing (when bids reveal, when bidding ends), the current state, and the winner information.

The `revealBlockHeight` is critical. This is when the dcipher network will decrypt all the bids. Before this block, bids are encrypted and invisible. After this block, bids are revealed but bidding is closed.

The `endBlockHeight` is when the auction fully ends and winner selection can happen.

### The EncryptedBid Struct

```solidity
struct EncryptedBid {
    uint256 listingId;
    address bidder;
    TypesLib.Ciphertext encryptedAmount;
    uint256 decryptionRequestId;
    uint256 revealedAmount;
    bool revealed;
    uint256 timestamp;
}
```

This represents a single bid. The `encryptedAmount` is the ciphertext from blocklock encryption. The `decryptionRequestId` connects this bid to the dcipher callback. When `revealed` is true, the `revealedAmount` contains the actual bid value.

The `TypesLib.Ciphertext` type comes from the blocklock library. It’s a structured ciphertext that includes all the metadata needed for time-locked decryption.

---
