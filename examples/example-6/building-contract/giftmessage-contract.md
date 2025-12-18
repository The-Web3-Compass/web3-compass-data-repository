# The GiftMessage Contract

Create `contracts/GiftMessage.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AbstractBlocklockReceiver} from "blocklock-solidity/src/AbstractBlocklockReceiver.sol";
import {TypesLib} from "blocklock-solidity/src/libraries/TypesLib.sol";

contract GiftMessage is AbstractBlocklockReceiver {

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

    uint256 public messageCounter;
    mapping(uint256 => Message) public messages;
    mapping(address => uint256[]) public userMessages;
    mapping(uint256 => uint256) public requestIdToMessageId;

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

    constructor(address _blocklockSender) AbstractBlocklockReceiver(_blocklockSender) {}

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

    function requestDecryption(
        uint256 messageId,
        uint32 callbackGasLimit,
        TypesLib.Ciphertext calldata ciphertext
    ) external payable {
        Message storage msg_ = messages[messageId];

        require(msg_.sender != address(0), "Message does not exist");
        require(msg.sender == msg_.recipient, "Only recipient can request decryption");
        require(block.number >= msg_.revealBlock, "Reveal block not reached yet");
        require(!msg_.revealed, "Message already revealed");

        bytes memory condition = abi.encodePacked(bytes1(0x42), abi.encode(msg_.revealBlock));

        (uint256 requestId, uint256 requestPrice) = _requestBlocklockPayInNative(
            callbackGasLimit,
            condition,
            ciphertext
        );

        require(msg.value >= requestPrice, "Insufficient payment for callback");

        requestIdToMessageId[requestId] = messageId;

        emit DecryptionRequested(messageId, requestId);
    }

    function _copyToMemory(TypesLib.Ciphertext storage ciphertext)
        private
        view
        returns (TypesLib.Ciphertext memory)
    {
        return TypesLib.Ciphertext({
            u: ciphertext.u,
            v: ciphertext.v,
            w: ciphertext.w
        });
    }

    function _onBlocklockReceived(
        uint256 requestId,
        bytes calldata decryptionKey
    ) internal override {
        uint256 messageId = requestIdToMessageId[requestId];
        Message storage msg_ = messages[messageId];

        require(msg_.sender != address(0), "Message does not exist");
        require(!msg_.revealed, "Message already revealed");

        TypesLib.Ciphertext memory ciphertext = _copyToMemory(msg_.encryptedMessage);
        bytes memory decryptedBytes = _decrypt(ciphertext, decryptionKey);
        msg_.decryptedMessage = abi.decode(decryptedBytes, (string));
        msg_.revealed = true;

        emit MessageRevealed(messageId, msg_.sender, msg_.recipient, msg_.decryptedMessage);
    }

    function getMessage(uint256 id) external view returns (Message memory) {
        return messages[id];
    }

    function getUserMessages(address user) external view returns (uint256[] memory) {
        return userMessages[user];
    }

    function canDecrypt(uint256 messageId) external view returns (bool) {
        Message storage msg_ = messages[messageId];
        return msg_.sender != address(0) &&
               !msg_.revealed &&
               block.number >= msg_.revealBlock;
    }
}
```

---

## Key Components

**Message Struct:**
- Stores all message data (sender, recipient, ciphertext, reveal block, decrypted text)
- `revealed` flag tracks decryption status

**State Variables:**
- `messageCounter` - incrementing ID generator
- `messages` - main storage mapping
- `userMessages` - index for querying user's messages
- `requestIdToMessageId` - links decryption requests to messages

**Core Functions:**
- `createMessage()` - stores encrypted message
- `requestDecryption()` - triggers decryption request
- `_onBlocklockReceived()` - callback from dcipher with decryption key

**View Functions:**
- `getMessage()` - fetch message by ID
- `getUserMessages()` - get all messages for an address
- `canDecrypt()` - check if message is ready to decrypt

The contract is intentionally simple. No complex logic. Just validation, storage, and automatic decryption via callbacks.
