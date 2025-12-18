# Troubleshooting Common Issues

Here are solutions to common problems you might encounter:

---

## Deployment Issues

**"Missing blocklock-solidity" during compilation**

Make sure you've installed the library:
```bash
npm install blocklock-solidity
```

**"Invalid BlocklockSender address"**

Verify you're using the correct address for your network:
- Base Sepolia: `0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e`

Check the dcipher docs for other networks.

---

## Bidding Issues

**"Bidding period has ended" when trying to submit bid**

Check the current block number vs the auction's `biddingDeadline`. Blocks mine quickly on testnets. You might need to create a new auction with a longer bidding window.

**"Auction already revealed"**

The auction has already been decrypted. You can't submit new bids after decryption. Check the auction state with `getAuction()`.

**Encryption fails in blocklock-js**

Make sure:
- You're using the correct network (Base Sepolia)
- The reveal block is in the future
- Your signer is properly initialized
- You have the latest version of blocklock-js

---

## Decryption Issues

**"Insufficient payment for callback"**

The callback gas limit might be too high, or you didn't send enough ETH. Check the `BlocklockSender` contract's `calculateRequestPriceNative()` to see the exact price needed.

Typical costs:
- Few bids (1-5): 0.001-0.002 ETH
- Many bids (10+): 0.003-0.005 ETH

**"Bidding still open"**

You can't request decryption until after the `biddingDeadline`. Wait for more blocks to be mined.

**Decryption never happens**

Make sure:
- You've reached the reveal block
- The decryption request transaction succeeded
- You paid enough for the callback
- The dcipher network is operational (check their status page)

The callback typically arrives 10-30 seconds after the reveal block is mined.

**"Already decrypted" error**

Someone already triggered decryption for this auction. Check the auction state with `getAuction()` to see the results.

---

## Result Issues

**Can't see bid amounts before decryption**

This is expected behavior. Before decryption, you'll see:
- `decryptedAmount: 0`
- `decrypted: false`

After the reveal block and callback, these values populate with actual bid amounts.

**Winner is address(0)**

This means no bids met the minimum bid requirement. Check:
- The `minBid` value
- All submitted bid amounts
- Whether bids were properly encrypted

---

## Gas Issues

**Gas estimation fails**

Increase the callback gas limit. Decrypting multiple bids requires more gas:
- 1-3 bids: 300,000 gas
- 4-10 bids: 500,000 gas
- 10+ bids: 1,000,000+ gas

**Transaction reverts with "out of gas"**

The callback gas limit was too low. Create a new auction with a higher limit, or submit fewer bids.

---

## Network Issues

**RPC errors or timeouts**

Try a different RPC endpoint:
- Alchemy: https://base-sepolia.g.alchemy.com/v2/YOUR-API-KEY
- QuickNode: Get an endpoint from quicknode.com
- Public: https://sepolia.base.org (can be slow)

**Transactions stuck in mempool**

Increase gas price or wait for network congestion to clear. On testnets, this usually resolves quickly.

---

## Getting Help

If you're still stuck:

1. **Check the dcipher Discord**: Active community and team support
2. **Review the docs**: https://docs.dcipher.network
3. **Check GitHub issues**: See if others have encountered similar problems
4. **Verify your setup**: Double-check contract addresses, network configuration, and library versions
