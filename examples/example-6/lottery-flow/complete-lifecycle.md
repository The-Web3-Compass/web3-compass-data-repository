# The Complete Message Lifecycle

Let's trace a message from creation to revelation, block by block.

## Block 100,000 (Creation)

Alice encrypts "Happy Birthday Bob! 🎂" targeting block 150,000.

Frontend calls `createMessage(bob, ciphertext, 150000)`.

Transaction mined. Message #42 exists on-chain.

**Bob's view:**
- Sees he has a message from Alice
- Unlock: 50,000 blocks away (~27 hours on Base)
- Cannot read it
- The key doesn't exist

**Alice's view:**
- Message sent successfully
- Even she can't decrypt her own message
- The key won't exist until block 150,000

---

## Blocks 100,001 - 149,999 (Waiting)

Time passes. Bob's UI counts down:
- "49,999 blocks (~27 hours)"
- "25,000 blocks (~14 hours)"
- "1,000 blocks (~33 minutes)"

The ciphertext is public. Anyone can copy it. Nobody can decrypt it.

Even Alice can't decrypt her own message. The key won't exist until block 150,000 is mined.

---

## Block 150,000 (Key Material Created)

Validators produce block 150,000.

The block signature is now permanent and public on-chain.

dcipher operators detect this block. They can now derive decryption keys for anything encrypted targeting block 150,000.

**But they don't decrypt automatically.** They wait for explicit requests.

---

## Block 150,001 (Decryption Request)

Bob's UI shows "🎁 Ready to decrypt!"

He clicks the button. Sends 0.001 ETH for callback gas.

Transaction calls `requestDecryption(42, 200000, ciphertext)`.

Event emitted: `DecryptionRequested(42, requestId: 999)`.

dcipher operators see it.

---

## Block 150,002 (Automatic Callback)

dcipher network:
1. Sees request 999
2. Fetches block 150,000's signature from blockchain
3. Derives decryption key using IBE
4. Submits callback transaction

Contract receives key, decrypts ciphertext, stores "Happy Birthday Bob! 🎂".

Emits `MessageRevealed(42, alice, bob, text)`.

Bob's frontend catches event. UI updates instantly:

**🎉 Message revealed: "Happy Birthday Bob! 🎂"**

---

## Total Time

From request to decryption: **10-30 seconds**

No manual intervention. All automatic.

- Math enforced the timing
- dcipher provided the service
- Blockchain finality guaranteed correctness

---

## What Makes This Secure

**Attack: Decrypt Early**

Attacker wants to read the message before block 150,000.

**Problem:** The decryption key is derived from block 150,000's signature. That signature doesn't exist yet.

You could try to predict the signature. But block signatures are produced by validators using their private keys and current chain state. Predicting it would require breaking the underlying signature scheme (BLS signatures).

Even if you compromised dcipher's entire network, you still couldn't decrypt early. They don't have the key yet either.

**Attack: Prevent Decryption**

Attacker wants to permanently lock the message.

**Problem:** Once block 150,000 is mined, its signature is public and permanent. Anyone can derive the decryption key.

You could try to DOS the dcipher network. But even if successful, the recipient could run the decryption themselves using public blockchain data.

**Attack: Forge Callback**

Attacker wants to call the callback with a fake key.

**Problem:** The callback function is `internal` and verified by the base contract. Even if you could call it, an incorrect key would cause decryption to fail.

The security is cryptographic and mathematical. Not dependent on access controls or promises.
