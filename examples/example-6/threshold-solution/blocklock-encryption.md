# How Blocklock Encryption Actually Works

Here's what we need:

A way to encrypt data such that:
- The ciphertext can be created now
- Nobody can decrypt it until a specific future time
- The decryption key is deterministically derivable at that time
- No central party needs to hold secrets
- The system works automatically without requiring trust

This is called time-based encryption. And dcipher's blocklock makes it possible using something clever: the randomness that blockchains naturally produce.

## The Core Concept

Each block contains randomness—the signature that validators produce when creating that block. This randomness is unpredictable before the block is created. Once created, it's public and permanent.

You can encrypt data using a future block's signature as the key material.

The message stays locked until that block exists. Once it does, the decryption key can be derived from public blockchain data.

**No server holds secrets. No party can decrypt early. The blockchain itself is the timelock mechanism.**

---

## The 6-Step Process

Let's make this concrete. You want to encrypt a message that unlocks at block 1,000,000. Currently, we're at block 999,000.

![Time-Lock Steps](https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/examples/example-6/images/time-lock-steps.png)

### Step 1: Encryption

Your client-side code:

```javascript
const blocklock = Blocklock.createFromChainId(provider, chainId);
const encrypted = blocklock.encrypt(messageBytes, BigInt(1000000));
```

The `blocklock.encrypt()` function uses Identity-Based Encryption (IBE) with the target block number as the identity parameter.

The ciphertext is created using an elliptic curve operation that ties decryption to the specific signature that validators will produce for block 1,000,000.

**That signature doesn't exist yet.** Block 1,000,000 hasn't been created. The randomness is genuinely unknowable.

### Step 2: Storage

You store the ciphertext on-chain or off-chain. Doesn't matter. It's useless without the decryption key.

Anyone can see it. Anyone can copy it. Nobody can decrypt it.

The security isn't in hiding the ciphertext. It's in the mathematical impossibility of deriving the key before block 1,000,000 exists.

### Step 3: Waiting

Time passes. Blocks get mined.

- Block 999,001 → Still can't decrypt
- Block 999,500 → Still locked
- Block 999,999 → One more block

### Step 4: Block Creation

Block 1,000,000 gets mined.

The validators produce a signature for this block. This signature contains randomness that's now public on the blockchain.

The dcipher network watches for this block. When it arrives, they extract the signature.

### Step 5: Decryption Key Derivation

The dcipher network uses the block's signature to derive the decryption key.

This isn't a secret key they held. This is computed from public blockchain data that didn't exist until block 1,000,000 was created.

The math works because IBE allows key derivation from public parameters and the identity (in this case, the block number and its associated randomness).

### Step 6: Automatic Callback

The dcipher network calls your smart contract's callback function, passing the decryption key.

Your contract uses this key to decrypt the ciphertext.

The plaintext is now available.

**All of this happens automatically.** No manual intervention. No trusted parties holding secrets. The blockchain itself is the timelock.

---

## Why This Is Different

Traditional time-lock systems:
- Keys exist now, held by someone
- Rely on promises not to use them early
- Single points of failure
- Can be compelled or compromised

Blocklock time-lock systems:
- Keys don't exist until target block
- Derived from public blockchain data
- Distributed network provides service
- Mathematically impossible to decrypt early
- No trust in any party required

The security model is fundamentally different. If the blockchain works, the timelock works. No organizational trust required.

---

## What We're Building

We're building a messaging system where messages are mathematically impossible to read until a specific future block.

Not "please wait." Actually encrypted. The decryption key doesn't exist until the blockchain reaches the target block.

**The flow:**
1. User encrypts message client-side targeting block X
2. Contract stores ciphertext + metadata on-chain
3. Anyone can see it, nobody can decrypt it
4. When block X arrives, blockchain's signature becomes key material
5. dcipher network derives decryption key automatically
6. Contract receives key, decrypts, message revealed

Three phases. Three functions:
- **Phase 1: Store** → User encrypts, contract stores ciphertext
- **Phase 2: Request** → Recipient triggers decryption once target block arrives
- **Phase 3: Decrypt** → dcipher delivers key, contract decrypts, message revealed

The smart contract handles storage and decryption. The cryptography happens in libraries. The timelock enforcement comes from blockchain finality and math, not access controls.
