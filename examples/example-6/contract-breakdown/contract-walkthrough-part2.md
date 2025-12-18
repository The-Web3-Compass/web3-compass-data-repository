# Contract Walkthrough - Part 2

## Requesting Decryption

Time passes. Blocks get mined. Eventually, the reveal block arrives. Now the recipient can decrypt:

```solidity
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
```

**Inputs:**

`messageId` - Which message to decrypt

`callbackGasLimit` - How much gas the callback can use (usually 200,000)

`ciphertext` - You pass the ciphertext again because dcipher needs it to perform decryption

**Validation:**

```solidity
require(msg.sender == msg_.recipient, "Only recipient can request decryption");
```

Only the designated recipient can request. This prevents spam attacks where someone requests decryption for every message.

```solidity
require(block.number >= msg_.revealBlock, "Reveal block not reached yet");
```

Can't decrypt before the target block. Even if you tried, dcipher would refuse.

```solidity
require(!msg_.revealed, "Message already revealed");
```

Can't decrypt twice. Prevents spam and saves gas.

**Condition Encoding:**

```solidity
bytes memory condition = abi.encodePacked(bytes1(0x42), abi.encode(msg_.revealBlock));
```

The `0x42` prefix means "this is a block-based condition." Then we encode the actual block number.

Together: "Decrypt this ciphertext once block number X has been mined."

**The Request:**

```solidity
(uint256 requestId, uint256 requestPrice) = _requestBlocklockPayInNative(
    callbackGasLimit,
    condition,
    ciphertext
);
```

This emits an event that dcipher operators watch for. Returns a unique `requestId` and the `requestPrice`.

**Payment:**

```solidity
require(msg.value >= requestPrice, "Insufficient payment for callback");
```

You must send enough ETH to cover the callback gas. Think of it like pre-paying for a return envelope.

**Tracking:**

```solidity
requestIdToMessageId[requestId] = messageId;
```

Store the link. When the callback arrives with this `requestId`, we'll know which message to decrypt.

---

## The Helper Function

```solidity
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
```

The `_decrypt` function expects a `memory` ciphertext, not a `storage` ciphertext.

This helper copies the three components (u, v, w) from storage to memory. Pure boilerplate.

---

## The Callback: Automatic Decryption

```solidity
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
```

This function is `internal` and can only be called by the base contract. Nobody can call it directly.

When dcipher's network calls your contract with the decryption key, the base contract verifies the caller is authorized, then routes to this function.

**Finding the Message:**

```solidity
uint256 messageId = requestIdToMessageId[requestId];
Message storage msg_ = messages[messageId];
```

Use the `requestId` to find which message this callback is for.

**Validation:**

Double-check the message exists and hasn't already been decrypted. Defense in depth.

**Decryption:**

```solidity
TypesLib.Ciphertext memory ciphertext = _copyToMemory(msg_.encryptedMessage);
bytes memory decryptedBytes = _decrypt(ciphertext, decryptionKey);
```

Copy ciphertext to memory, then call `_decrypt` (inherited from base contract).

The `_decrypt` function performs IBE decryption (pairing-based cryptography). We don't need to understand the math. Just: ciphertext + key → plaintext bytes.

**Storage:**

```solidity
msg_.decryptedMessage = abi.decode(decryptedBytes, (string));
msg_.revealed = true;
```

Decode the bytes back to a string and store it. Flip `revealed` to `true`.

**Event:**

```solidity
emit MessageRevealed(messageId, msg_.sender, msg_.recipient, msg_.decryptedMessage);
```

Frontends watching for this event immediately update to show the plaintext.

The complete lifecycle: Message created → time passes → decryption requested → callback received → message revealed.

All automatic. All verifiable. All trustless.

---

## View Functions

```solidity
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
```

**getMessage:** Simple lookup. Given an ID, return the full Message struct.

**getUserMessages:** Given an address, return an array of message IDs they're involved in.

**canDecrypt:** Returns whether a message is currently decryptable (exists, not revealed, block reached).

These are convenience functions for frontends.
