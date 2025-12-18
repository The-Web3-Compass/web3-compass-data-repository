# Troubleshooting & Limitations

## Common Issues

### Block Time Uncertainty

**Problem:** Blockchains target specific block times but don't guarantee them.

Base Sepolia aims for ~2 seconds but might be 1.8 or 2.2. If you encrypt for "exactly 24 hours from now," the actual unlock might be 23:50 or 24:10.

**Solution:** For most use cases, this doesn't matter. For time-critical applications (financial options with exact expiry), add safeguards or use block numbers directly.

---

### Reorganization Risk

**Problem:** Blockchains can reorganize. If the reveal block gets reorged, the decryption key might temporarily change.

**Solution:** On major chains (Ethereum, Base), reorgs beyond a few blocks are essentially impossible. Wait for finality (12+ blocks) before considering decryption permanent.

On smaller chains with deeper reorg risk, wait longer for finality.

---

### Gas Costs

**Problem:** Decryption requests cost gas. Recipients pay for the callback (~0.001 ETH on Base Sepolia, potentially higher on mainnet).

**Solution:**
- For high-value messages, acceptable cost
- For casual messages, consider subsidizing via relays or account abstraction
- Batch multiple decryptions to amortize costs

---

### Privacy Considerations

**Problem:** Ciphertext is on-chain. Plaintext is on-chain after decryption. Everyone sees who sent what to whom.

**Solution:**
- Fine for public announcements
- Not suitable for private communications that should stay private forever
- For post-decryption privacy, decrypt off-chain using the blocklock key to unlock local ciphertext

---

### Dependency on dcipher

**Problem:** Automatic decryption requires dcipher operators to submit callbacks. If they go offline, convenience stops.

**Solution:**
- dcipher has high availability and economic incentives for reliability
- You can derive keys manually from blockchain data if needed
- The decryption key is public once the block exists - anyone can compute it

---

## Error Messages

### "Reveal block must be in the future"

You're trying to encrypt for a block that already exists.

**Fix:** Use a block number higher than the current block.

---

### "Reveal block not reached yet"

You're trying to decrypt before the target block.

**Fix:** Wait for more blocks to be mined. Check current block vs reveal block.

---

### "Insufficient payment for callback"

You didn't send enough ETH to cover the callback gas.

**Fix:** Increase payment amount. Try 0.002 ETH instead of 0.001 ETH.

---

### "Message already revealed"

You're trying to decrypt a message that's already been decrypted.

**Fix:** Check the message status. Each message can only be decrypted once.

---

### "Only recipient can request decryption"

You're not the designated recipient.

**Fix:** Only the recipient address can request decryption. This prevents spam.

---

## Performance Tips

### Batch Operations

If creating multiple messages, batch them in a single transaction:

```solidity
function createMessages(
    address[] calldata recipients,
    TypesLib.Ciphertext[] calldata ciphertexts,
    uint256[] calldata revealBlocks
) external {
    for (uint i = 0; i < recipients.length; i++) {
        createMessage(recipients[i], ciphertexts[i], revealBlocks[i]);
    }
}
```

### Optimize Callback Gas

Set `callbackGasLimit` as low as possible while still allowing the callback to complete:
- Simple string decryption: 150,000 gas
- Complex logic: 200,000+ gas

Lower gas limit = lower payment required.

---

## When to Use Blocklock

**Good for:**
- Public announcements with guaranteed timing
- Sealed bid auctions
- Voting systems
- Game mechanics
- Coordination games
- Estate planning

**Not ideal for:**
- Real-time messaging (use Signal, not blocklock)
- Permanent privacy (plaintext becomes public after decryption)
- Sub-second timing requirements (block times vary)
- Free/zero-cost systems (gas costs exist)

---

## Getting Help

- **dcipher Documentation**: https://docs.dcipher.network
- **GitHub Issues**: Report bugs and request features
- **Discord**: Join the dcipher community
- **BaseScan**: Debug transactions and events
