
The blocklock encryption for media is identical to messages. Same library. Same cryptography. Same security guarantees.

**How IBE Works Here:**

You encrypt targeting block number N. The encryption creates a ciphertext tied to that specific block’s identity. The decryption key is derived from:
- dcipher’s master secret (constant, held in HSMs)
- Block N’s signature (unpredictable until block is mined)

The formula is roughly: `decryption_key = derive(master_secret, block_signature)`.

Before block N exists, its signature is unknowable. The key cannot be computed. Decryption is impossible.

Once block N is mined, its signature is public and permanent. Anyone with the master secret (dcipher) can derive the key. But that’s fine—the reveal time has passed.

**Why Block Signatures Are Unpredictable:**

Each block’s signature comes from the validator who creates it. That validator signs using their private key, current blockchain state, and any chain-specific randomness.

To predict a future block’s signature, you’d need to: know which validator will create it, compromise their private key, and predict exact blockchain state. If you could do that, you could attack the entire blockchain. It’s the same cryptography securing billions of dollars.

**Client-Side Encryption Matters:**

If a server encrypted your media, the server would briefly see plaintext. Even if deleted immediately, that’s a trust requirement.

Client-side encryption means your media never leaves your device unencrypted. The encrypted bytes that upload to IPFS are useless without the key. That key won’t exist until the target block.

Zero trust in infrastructure. Maximum trust in math.

---
