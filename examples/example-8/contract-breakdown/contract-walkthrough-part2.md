
The request itself calls `_requestBlocklockPayInNative`, which is inherited from `AbstractBlocklockReceiver`. It emits an event that dcipher operators watch for, calculates how much ETH is needed to pay for the callback gas, and returns a unique `requestId` and the `requestPrice`. The function doesn't block. It returns immediately. The actual decryption happens off-chain, and the callback comes later.

You must send enough ETH to cover the callback. Why? Because when dcipher calls back with the decryption key, that transaction costs gas. Somebody has to pay for it. You're pre-paying by sending ETH with this request. Think of it like pre-paying for a return envelope. You want the response? Include postage.

We store the link between this request and this media with `requestToMediaId[requestId] = mediaId`. When the callback arrives, dcipher provides the `requestId`. We'll use this mapping to find which media to decrypt.

Finally, we emit an event. Frontends can show "Decryption requested, waiting for callback…"

The request is now on-chain. dcipher operators have seen it. They're processing it off-chain. In 10-30 seconds, the callback will arrive.

---

## The Callback: Automatic Key Delivery

This is where everything comes together:

```solidity
function _onBlocklockReceived(
    uint256 requestId,
    bytes calldata decryptionKey
) internal override {
    uint256 mediaId = requestToMediaId[requestId];
    MediaRelease storage media = releases[mediaId];

    require(media.uploader != address(0), "Invalid media");
    require(!media.decrypted, "Already decrypted");

    media.decryptionKey = decryptionKey;
    media.decrypted = true;

    emit MediaDecrypted(mediaId, decryptionKey);
}
```

This function is `internal` and can only be called by the inherited base contract logic. Nobody can call it directly. Not even you.

When dcipher's network calls your contract with the decryption key, the base contract verifies the caller is authorized, then routes to this function.

We use the `requestId` to find which media this callback is for, then load that media from storage. Double-check the media exists and hasn't already been decrypted. Why check again? We checked in `requestMediaDecryption`. But that was potentially seconds or minutes ago. State could have changed. Defense in depth.

Store the key. Flip the flag. Notice we're NOT decrypting anything here. For messages, the contract would decrypt the ciphertext and store the plaintext. But for media, the ciphertext is on IPFS (not in this contract), decrypting 50 MB on-chain would cost insane amounts of gas, and clients can decrypt off-chain for free.

So we just store the key. Frontends will fetch it and do their own decryption.

Finally, we emit the event. Frontends listening for this event can immediately fetch the key and decrypt the media. No polling. No manual refresh. The event fires, the UI updates, the user sees their media.

And that's the complete lifecycle. Media created → time passes → decryption requested → callback received → key stored → client decrypts.

---

---

## The View Functions: Reading State

The contract has three view functions for querying state:

```solidity
function getMediaRelease(uint256 id) external view returns (MediaRelease memory) {
    return releases[id];
}

function getUserReleases(address user) external view returns (uint256[] memory) {
    return userReleases[user];
}

function canDecrypt(uint256 mediaId) external view returns (bool) {
    MediaRelease storage media = releases[mediaId];
    return media.uploader != address(0) &&
           !media.decrypted &&
           block.number >= media.revealBlock;
}
```

**getMediaRelease** is a simple lookup. Given an ID, return the full MediaRelease struct. Frontends use this to display media details.

**getUserReleases** takes an address and returns an array of media IDs they've uploaded. Frontends use this to show "your media" lists.

**canDecrypt** tells you whether a specific media ID is currently decryptable. Returns `true` if the media exists (uploader is not address(0)), hasn't been decrypted yet, and the current block is at or past the reveal block. Frontends use this to enable/disable the "Request Decryption" button.

These are pure convenience functions. Frontends could query this data directly from the contract state, but these wrappers make it cleaner.

---

