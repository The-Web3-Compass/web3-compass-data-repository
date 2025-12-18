# Contract Walkthrough - Part 1

Let's break down the GiftMessage contract piece by piece.

## Inheritance and Imports

```solidity
import {AbstractBlocklockReceiver} from "blocklock-solidity/src/AbstractBlocklockReceiver.sol";
import {TypesLib} from "blocklock-solidity/src/libraries/TypesLib.sol";

contract GiftMessage is AbstractBlocklockReceiver {
```

By inheriting from `AbstractBlocklockReceiver`, your contract gets:
- The ability to request decryption with `_requestBlocklockPayInNative()`
- Automatic verification of decryption keys from dcipher
- A guaranteed callback to `_onBlocklockReceived()` when decryption is ready
- Protection against unauthorized callbacks

You're not implementing the cryptography. You're not verifying signatures. The base contract handles all that.

The `TypesLib` import gives you the `Ciphertext` type - the standardized structure for blocklock ciphertexts (three elliptic curve elements: u, v, w).

---

## The Message Struct

```solidity
struct Message {
    uint256 id;
    address sender;
    address recipient;
    TypesLib.Ciphertext encryptedMessage;
    uint256 revealBlock;
    bool revealed;
    string decryptedMessage;
    uint256 createdAt;
}
```

This struct represents the complete lifecycle of a message.

**During Creation:**
- `id` - Unique identifier (incrementing counter)
- `sender` - Who created the message
- `recipient` - Who should receive it
- `encryptedMessage` - The blocklock ciphertext (three curve points)
- `revealBlock` - When it can be decrypted
- `revealed` - Starts as `false`
- `decryptedMessage` - Empty string initially
- `createdAt` - Timestamp for UI/tracking

**After Decryption:**
- `revealed` - Now `true`
- `decryptedMessage` - Contains the actual plaintext

---

## State Variables

```solidity
uint256 public messageCounter;
mapping(uint256 => Message) public messages;
mapping(address => uint256[]) public userMessages;
mapping(uint256 => uint256) public requestIdToMessageId;
```

**Message Storage:**

`messageCounter` - Incrementing ID generator. First message gets ID 0, second gets ID 1.

`messages` - Main storage. Message ID → Message struct.

**User Indexing:**

`userMessages` - Tracks which messages each address is involved in. When Alice sends to Bob, both `userMessages[alice]` and `userMessages[bob]` get the message ID.

Why both? Frontends need to query "show me messages I sent" and "show me messages I received."

**Request Tracking:**

`requestIdToMessageId` - Links decryption requests to messages.

When you request decryption, dcipher assigns a `requestId`. When they call back with the key, they provide that `requestId`. You need to know which message it corresponds to.

---

## Events

```solidity
event MessageCreated(
    uint256 indexed id,
    address indexed sender,
    address indexed recipient,
    uint256 revealBlock,
    uint256 createdAt
);
event DecryptionRequested(uint256 indexed messageId, uint256 requestId);
event MessageRevealed(
    uint256 indexed messageId,
    address sender,
    address recipient,
    string message
);
```

Events make everything observable:

`MessageCreated` - Fires when someone sends a message. Frontends can display "Alice sent you a message that unlocks at block 150,000."

`DecryptionRequested` - Fires when someone requests decryption. Frontends show "Decryption in progress…"

`MessageRevealed` - Fires when decryption completes. Frontends immediately display the plaintext without polling.

The `indexed` keyword makes addresses and IDs efficiently filterable. You can query "show me all MessageCreated events where recipient == myAddress."

---

## The Constructor

```solidity
constructor(address _blocklockSender) AbstractBlocklockReceiver(_blocklockSender) {}
```

Shortest function but critically important.

When you deploy, you pass the address of dcipher's `BlocklockSender` contract. This is the contract that processes decryption requests and delivers callbacks.

**For Base Sepolia:** `0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e`

The base constructor stores this address and uses it to verify that callbacks actually come from the legitimate dcipher contract.

You set this once at deployment. It never changes.

---

## Creating Messages

```solidity
function createMessage(
    address recipient,
    TypesLib.Ciphertext calldata encryptedMessage,
    uint256 revealBlock
) external returns (uint256 messageId) {
    require(recipient != address(0), "Recipient cannot be zero address");
    require(revealBlock > block.number, "Reveal block must be in the future");

    messageId = messageCounter++;

    Message storage newMessage = messages[messageId];
    newMessage.id = messageId;
    newMessage.sender = msg.sender;
    newMessage.recipient = recipient;
    newMessage.encryptedMessage = encryptedMessage;
    newMessage.revealBlock = revealBlock;
    newMessage.revealed = false;
    newMessage.createdAt = block.timestamp;

    userMessages[msg.sender].push(messageId);
    userMessages[recipient].push(messageId);

    emit MessageCreated(messageId, msg.sender, recipient, revealBlock, block.timestamp);
}
```

**Validation:**

```solidity
require(recipient != address(0), "Recipient cannot be zero address");
```

Can't send to the burn address. Nobody controls it. Messages would be unreadable forever.

```solidity
require(revealBlock > block.number, "Reveal block must be in the future");
```

Must target a future block. If the block already exists, someone could derive the key right now and decrypt immediately.

**Storage:**

The `sender` is `msg.sender` - whoever called this function. No way to forge this.

The `encryptedMessage` is copied directly from calldata. The contract doesn't validate it because validation is impossible until you have the decryption key.

**Indexing:**

Both sender and recipient get this message ID added to their lists. Makes queries easy.

**Event:**

Frontends listening for this event immediately know a new message exists.

The message is now locked until the reveal block arrives.
