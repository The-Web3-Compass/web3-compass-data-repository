## How Sealed Bidding Actually Works

Let’s trace through the bid lifecycle.

### Step 1: Creating a Listing

```solidity
function createListing(
    string memory _itemName,
    string memory _description,
    string memory _imageUrl,
    uint256 _minimumBid,
    uint256 _revealBlockHeight,
    uint256 _endBlockHeight
) external returns (uint256)
```

Seller calls this with item details and timing. The contract validates:
- Item name isn’t empty
- Minimum bid is greater than zero
- Reveal block is in the future
- End block is after reveal block

Then it creates the listing, assigns an ID, stores it, and emits an event. The listing is now ACTIVE.

### Step 2: Submitting an Encrypted Bid

```solidity
function submitBid(
    uint256 _listingId,
    TypesLib.Ciphertext calldata _encryptedAmount,
    uint32 _callbackGasLimit
) external payable nonReentrant returns (uint256 bidId)
```

This is where blocklock comes in. The bidder has already encrypted their bid amount using the blocklock library (we’ll see this in Part 2). They submit the ciphertext to the contract.

The contract:
1. Validates the listing exists and is active
2. Creates a decryption condition (the reveal block height)
3. Requests blocklock decryption from the dcipher network
4. Stores the encrypted bid
5. Maps the decryption request ID to this bid

The key line:

```solidity
(uint256 requestId, uint256 requestPrice) = _requestBlocklockPayInNative(
    _callbackGasLimit,
    condition,
    _encryptedAmount
);
```

This tells the dcipher network: “Decrypt this ciphertext when we reach the reveal block height, then call me back with the decryption key.”

The bidder pays for this callback with ETH (sent as `msg.value`). The callback will happen automatically when the blockchain reaches the specified block height.

### Step 3: The Automatic Decryption Callback

```solidity
function _onBlocklockReceived(
    uint256 _requestId,
    bytes calldata decryptionKey
) internal override
```

This function gets called automatically by the dcipher network when the reveal block is reached. You don’t call this. The network calls it.

It:
1. Finds the bid associated with this decryption request
2. Decrypts the ciphertext using the provided key
3. Extracts the bid amount from the plaintext
4. Marks the bid as revealed
5. Emits a BidRevealed event

Now the bid amount is visible on-chain, but the bidding period is over. Nobody can submit new bids based on what they see.

### Step 4: Selecting the Winner

```solidity
function selectWinner(uint256 _listingId) external nonReentrant
```

Once the end block is reached, anyone can call this. It iterates through all bids for the listing, finds the highest revealed bid that meets the minimum, and declares that bidder the winner.

The listing state changes to ENDED. The winner and winning bid are stored.

---
