
The blocklock encryption mechanism? Stays the same. Same library. Same math. Same security model. The smart contract pattern? Also stays the same. You'll still inherit from `AbstractBlocklockReceiver`, still request decryption, still get callbacks. The frontend encryption flow? Yep, still the same. Still encrypt client-side before anything leaves the user's device.

Don't rebuild what already works. Reuse it.

**Identify the actual constraint**

The constraint here is storage cost. We can't put 50 MB on-chain. That's the whole problem.

So we need off-chain storage for the encrypted data. But that opens up a bunch of new questions: Where do we store it? (IPFS, Filecoin, Arweave?) How do users retrieve it? (IPFS hash, gateway URLs?) What if it disappears? (Pinning, replication?) How do we verify integrity? (Content hashing?)

**Solve storage in isolation first**

Before touching the smart contract or encryption, solve the storage problem by itself. Can you upload a file to IPFS? Can you retrieve it? Can you verify the hash matches?

Build a simple uploader:

```tsx
async function uploadToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${PINATA_JWT}` },
    body: formData,
  });

  const data = await response.json();
  return data.IpfsHash;
}
```

Test it. Upload a video. Get the hash. Retrieve it from a gateway. Verify it works. Only once storage is solid, move to the next piece.

**Adapt the smart contract**

The message contract stores ciphertext directly. The media contract needs to store a *reference* to ciphertext instead.

Start with the message contract. What actually needs to change?

```solidity
// Before (messages)
struct Message {
    bytes encryptedMessage;  // Ciphertext stored here
    uint256 revealBlock;
    bool revealed;
    string decryptedMessage;
}
```

The key change: instead of storing encrypted bytes, store the IPFS hash. Instead of decrypting on-chain (which we did for messages), just store the key and let clients decrypt off-chain.

**Adapt the frontend encryption**

Message encryption was straightforward—encrypt a string, send to contract. For media, we're encrypting potentially huge files. You need to think about memory limits (can't load 500 MB into browser RAM), progress feedback (encryption takes time), and file type handling (images, video, audio).

But the actual encryption call? Identical:

```tsx
// Messages
const encrypted = blocklock.encrypt(
  textBytes,
  BigInt(revealBlock)
);

// Media (exactly the same)
const encrypted = blocklock.encrypt(
  fileBytes,
  BigInt(revealBlock)
);
```

Same function. Just different input bytes. The library doesn't care if it's text or video.

**Adapt the decryption flow**

Messages decrypt on-chain in the callback. The contract receives the key, decrypts the ciphertext, stores the plaintext. Media can't do that. The ciphertext is on IPFS, not on-chain. And we definitely don't want to pay gas to decrypt 50 MB.

So the contract just stores the key:

```solidity
function _onBlocklockReceived(uint256 requestId, bytes calldata key) internal override {
    uint256 mediaId = requestToMediaId[requestId];
    releases[mediaId].decryptionKey = key;
    releases[mediaId].revealed = true;
    emit MediaDecrypted(mediaId, key);
}
```

Then the frontend fetches the key and does decryption client-side:

```tsx
// Fetch encrypted media from IPFS
const encrypted = await fetchFromIPFS(ipfsHash);

// Fetch key from blockchain
const key = await contract.getDecryptionKey(mediaId);

// Decrypt client-side
const decrypted = blocklock.decrypt(encrypted, key);

// Create viewable blob
const blob = new Blob([decrypted], { type: mediaType });
const url = URL.createObjectURL(blob);
videoElement.src = url;
```

Decryption happens in the user's browser, not on-chain.

**Test the full flow**

Upload a small test video (keep it under 10 MB for fast iteration). Set a reveal block 2 minutes in the future. Verify that encryption completes without errors, IPFS upload succeeds, contract transaction confirms, and after the target block, decryption request works. Then check that the callback arrives with the key and client-side decryption produces a playable video.

If any step breaks, debug that step in isolation before moving on.

**This is the process**

You're not rewriting everything from scratch. Take the working message system. Identify what changes (storage location). Adapt one piece at a time. Test continuously.

That's how you evolve working code for new requirements.

---
