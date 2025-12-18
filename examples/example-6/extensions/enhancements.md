# Extension Ideas & Use Cases

Time-locked encryption isn't just for birthday messages. The pattern applies everywhere you need guaranteed future revelation.

## Real-World Use Cases

### Wills and Estate Planning

Encrypt instructions that unlock if you don't check in for 6 months.

```solidity
struct Will {
    address beneficiary;
    TypesLib.Ciphertext encryptedInstructions;
    uint256 lastCheckIn;
    uint256 unlockDelay; // blocks
}

function checkIn() external {
    wills[msg.sender].lastCheckIn = block.number;
}

function requestWillDecryption(address deceased) external {
    Will storage will = wills[deceased];
    require(block.number >= will.lastCheckIn + will.unlockDelay);
    // Request decryption...
}
```

No trust required. No lawyer fees. Automatic execution.

---

### Sealed Bid Auctions

Bidders encrypt their bids targeting the same future block. All bids reveal simultaneously.

```solidity
function submitBid(TypesLib.Ciphertext calldata encryptedBid) external payable {
    require(block.number < auctionEndBlock);
    bids[msg.sender] = encryptedBid;
}

function revealBids() external {
    require(block.number >= auctionEndBlock);
    // Request decryption for all bids...
}
```

No one can see others' bids early. No central auctioneer needed.

---

### Game Reveals

In-game loot boxes that open at specific times.

```solidity
struct LootBox {
    uint256 tokenId;
    TypesLib.Ciphertext encryptedContents;
    uint256 openBlock;
}

function openLootBox(uint256 tokenId) external {
    LootBox storage box = lootBoxes[tokenId];
    require(ownerOf(tokenId) == msg.sender);
    require(block.number >= box.openBlock);
    // Request decryption...
}
```

Players can't data-mine the contents early. The contents genuinely don't exist until the reveal block.

---

### Corporate Announcements

Encrypt quarterly results targeting the announcement date.

```solidity
function publishResults(TypesLib.Ciphertext calldata encryptedResults, uint256 announceBlock) external onlyAuthorized {
    quarterlyResults[currentQuarter] = encryptedResults;
    announceBlocks[currentQuarter] = announceBlock;
}
```

Prevents leaks. Ensures simultaneous disclosure. No insider information.

---

### Voting Systems

Encrypt votes targeting the end of the voting period.

```solidity
function castVote(TypesLib.Ciphertext calldata encryptedVote) external {
    require(block.number < votingEndBlock);
    votes[msg.sender] = encryptedVote;
}

function tallyVotes() external {
    require(block.number >= votingEndBlock);
    // Request decryption for all votes...
}
```

Prevents tactical voting based on current results. Reveals all votes simultaneously.

---

## Advanced Patterns

### Conditional Decryption

Combine block-based conditions with other conditions:

```solidity
bytes memory condition = abi.encodePacked(
    bytes1(0x42), // Block condition
    abi.encode(revealBlock),
    bytes1(0x01), // AND operator
    bytes1(0x50), // Custom condition
    abi.encode(customData)
);
```

"Decrypt at block X if payment was received" or "Decrypt at block X if oracle reports event Y."

---

### Progressive Reveal

Encrypt multiple layers with different reveal blocks:

```solidity
struct ProgressiveMessage {
    TypesLib.Ciphertext layer1; // Block 100: "You've won something!"
    TypesLib.Ciphertext layer2; // Block 200: "It's a trip!"
    TypesLib.Ciphertext layer3; // Block 300: "To Hawaii!"
}
```

Each revelation unlocks a piece of information. Creates anticipation.

---

### Multi-Recipient Messages

Same message, different timing per recipient:

```solidity
struct MultiRecipientMessage {
    mapping(address => TypesLib.Ciphertext) recipientCiphertexts;
    mapping(address => uint256) recipientRevealBlocks;
}
```

Alice sees the message at block 100. Bob sees it at block 200.

---

### Delayed Execution

Encrypt a function call that executes at a future block:

```solidity
function _onBlocklockReceived(uint256 requestId, bytes calldata key) internal override {
    bytes memory decryptedAction = _decrypt(ciphertext, key);
    (address target, bytes memory data) = abi.decode(decryptedAction, (address, bytes));

    // Execute the decrypted action
    (bool success, ) = target.call(data);
    require(success);
}
```

Delayed automated transactions without external services.

---

### Token-Gated Access

Require users to hold a specific NFT or token to decrypt:

```solidity
function requestDecryption(...) external payable {
    require(IERC721(nftContract).balanceOf(msg.sender) > 0, "Must own NFT");
    // ... rest of decryption logic
}
```

Only NFT holders can read the message. Creates exclusive content that's still time-locked.

---

## The Pattern

Any scenario where you need to **commit now but reveal later**:
- Auctions
- Voting
- Gaming
- Announcements
- Estate planning
- Escrow
- Coordination games

Traditional systems require trust in a party to hold the secret. Blocklock systems use math and blockchain finality instead.
