## What We Already Know From Messages

Before we dive into media support, let's quickly recap the message system. Everything we need already exists there—we're just adapting it.

Remember the core mechanism? We encrypt data targeting a specific future block number. The encryption uses Identity-Based Encryption (IBE) where the "identity" is literally just the block number. The decryption key gets derived from that block's signature combined with a master secret that dcipher holds.

Before the block exists, its signature doesn't exist. The key can't be derived. Decryption is mathematically impossible. Not "hard to crack"—actually impossible.

The lifecycle has three phases. First, you encrypt client-side with `blocklock-js` and store the ciphertext on-chain. Then you wait. When the target block arrives, you request decryption from dcipher. Finally, dcipher derives the key from the block signature and calls back with it.

The smart contract's job is pretty straightforward:

```solidity
contract GiftMessage is AbstractBlocklockReceiver {
    struct Message {
        bytes encryptedMessage;  // The ciphertext
        uint256 revealBlock;     // When it unlocks
        bool revealed;           // Has it been decrypted?
        string decryptedMessage; // Plaintext after reveal
    }
}
```

Store ciphertext. Track reveal block. Receive callback with key. Decrypt. Done.

That's the foundation. Now we're adapting it for media.

---

## How To Think About This Project

When you're adapting a working system for a new use case, you need a methodical approach. Here's how to think through migrating from messages to media without losing your mind.

