## Conditional Encryption (Blocklock)

### The Problem with Time-Locked Secrets

Sometimes you need to encrypt data that becomes readable only after a specific condition is met. Sealed-bid auctions where bids stay encrypted until the deadline. MEV-resistant mempools where transactions are hidden until it's too late for validators to reorder them. Time-delayed asset transfers.

Traditional approaches have problems. Trusted third parties holding decryption keys? Trust assumption. Delay-based encryption? Impractical for most use cases. Centralized time-lock services? Single point of failure.

### How Blocklock Works

Blocklock is dcipher's implementation of conditional encryption. You encrypt data with a condition: "unlock this when Ethereum reaches block 20,000,000" or "unlock this when a specific transaction confirms on Polygon."

The encrypted data sits there, useless, until the condition is met. Then and only then the dcipher committee collectively generates the decryption key.

**The Technical Flow:**

![Blocklock Encryption Flow](https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/examples/example-2/images/blocklock-encryption-flow.png)

**Step 1: Encryption.** You encrypt your data using Identity-Based Encryption (IBE) where the "identity" is the condition itself. "Ethereum block 20000000" becomes the identity. This uses the committee's public key, which was published during their DKG ceremony.

**Step 2: On-Chain Request.** You submit the encrypted data and condition to a smart contract. This creates a public record of what needs to be decrypted and when.

**Step 3: Condition Monitoring.** The committee operators watch the relevant blockchain. They're waiting for the specified condition to be met.

**Step 4: Key Generation.** Once the condition is satisfied (the block height is reached, the transaction confirms, whatever), the operators use their threshold key shares to collectively generate the decryption key for that specific condition. This happens through threshold signingeach operator produces a partial signature over the condition, and these aggregate into the decryption key.

**Step 5: Decryption.** The decryption key gets published (usually through the smart contract). Anyone can now decrypt the data. The key didn't exist before the condition was metit was generated on-demand by the committee.

**Critical insight:** No single node knows the decryption key beforehand. The key shares work together mathematically to produce it only after verification that the condition is satisfied.

### What This Enables

Sealed-bid auctions where bids reveal automatically at the deadline. No centralized auction house.

MEV-resistant L2s using encrypted mempools. Sequencers can't front-run what they can't see.

Time-delayed asset transfers. "Unlock my inheritance if I don't check in for 6 months."

Conditional access to content. Subscription services that use on-chain payment verification instead of centralized auth servers.

---
