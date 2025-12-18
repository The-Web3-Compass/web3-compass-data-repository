# Contract Walkthrough - Part 2

Now we get to the core of how blocklock encryption works in practice.

---

## Requesting Decryption

```solidity
function requestDecryption(
    uint256 auctionId,
    uint32 callbackGasLimit,
    TypesLib.Ciphertext calldata ciphertext
) external payable returns (uint256)
```

Once bidding is over, someone needs to kick off the reveal.

That's what `requestDecryption` does.

This function packages up three things and sends them to the dcipher network:

1. The reveal condition (encoded as a block height)
2. A sample ciphertext
3. Enough ETH to pay for the callback

That last part is important. Decryption doesn't happen for free. When the reveal block is reached, dcipher operators will submit a callback transaction, and that costs gas. We pay for that upfront.

```solidity
bytes memory condition = abi.encode(auction.revealBlock);

(uint256 requestId, uint256 requestPrice) = _requestBlocklockPayInNative(
    callbackGasLimit,
    condition,
    ciphertext
);

require(msg.value >= requestPrice, "Insufficient payment for callback");
```

Once this request is submitted, the contract waits. There's nothing more to do until the chain itself reaches the reveal block.

---

## The Blocklock Callback

```solidity
function _onBlocklockReceived(
    uint256 requestId,
    bytes calldata decryptionKey
) internal override
```

This is where everything comes together.

When the target block is mined, dcipher's threshold network generates the decryption key and calls back into the contract via `_onBlocklockReceived`.

At that moment—and only at that moment—decryption becomes possible.

The contract loops through every encrypted bid, decrypts it using the provided key, decodes the bid amount, and keeps track of the highest valid bid:

```solidity
for (uint256 i = 0; i < bids.length; i++) {
    TypesLib.Ciphertext memory ciphertext = _copyToMemory(bids[i].encryptedAmount);
    bytes memory decryptedData = _decrypt(ciphertext, decryptionKey);
    uint256 bidAmount = abi.decode(decryptedData, (uint256));

    bids[i].decryptedAmount = bidAmount;
    bids[i].decrypted = true;

    if (bidAmount >= auction.minBid && bidAmount > highestBid) {
        highestBid = bidAmount;
        highestBidder = bids[i].bidder;
    }
}
```

There's no branching logic about who to reveal or when to reveal. All bids unlock at once because they all targeted the same block height. That simultaneity is enforced by cryptography, not coordination.

Once the loop finishes, the auction is finalized. The winner is stored. The winning bid is stored. The state flips to `decrypted`, and the auction is over.

No one can rerun it. No one can interfere. The window for manipulation has already passed.

---

## Utility: Copying Ciphertext from Storage

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

This helper exists purely because of Solidity's memory model.

Encrypted bids live in storage, but `_decrypt` expects a memory struct. This function performs that copy explicitly. No cryptography happens here—just safe data handling.

---

## Reading the Results

After decryption, everything becomes transparent again—and that's exactly what we want.

```solidity
function getAuction(uint256 auctionId) external view returns (Auction memory)
function getBids(uint256 auctionId) external view returns (EncryptedBid[] memory)
function getBidCount(uint256 auctionId) external view returns (uint256)
function getWinner(uint256 auctionId) external view returns (address, uint256)
```

Anyone can inspect the auction, see every bid, verify the winner, and confirm that the rules were followed. Transparency comes back **after** it's safe.

That's the pattern:

- Hide information until the system says it's time
- Reveal everything once fairness is guaranteed

---

## The End-to-End Flow

Putting it all together, every auction follows a fixed, irreversible path:

1. An auction is created with fixed timing rules
2. Encrypted bids are submitted and stored unreadably
3. Bidding closes
4. A decryption request is made
5. The reveal block is mined
6. The dcipher network generates a threshold decryption key
7. The contract decrypts all bids and finalizes the result

No shortcuts. No trust assumptions. No selective reveals.

The blockchain provides the clock. dcipher provides the key. The contract enforces the rules.

That's what a sealed-bid auction actually looks like on a transparent blockchain.
