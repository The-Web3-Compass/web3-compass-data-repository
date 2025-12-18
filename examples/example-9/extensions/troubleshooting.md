# Common Issues and How to Fix Them

Here's what can go wrong and how to handle it.

---

## Issue 1: "Transfer failed - check allowance"

**Problem**: You didn't approve the swapper contract before calling `initiateSwap`.

**Solution**: Always approve first:

```javascript
await rusd.approve(SWAPPER_ADDRESS, totalAmount);
```

Remember: ERC-20 tokens require explicit approval before another contract can spend them. This is by design for security.

---

## Issue 2: "Insufficient balance"

**Problem**: You don't have enough RUSD to cover `amountIn + solverFee`.

**Solution**: Either reduce your swap amount or get more RUSD from the faucet. The total you need is the sum of both values.

---

## Issue 3: Swap stays pending forever

**Problem**: Your solver fee might be too low, or there's no active Solver on the network.

**Possible solutions**:

- Wait longer (testnets can be slow)
- Increase your solver fee to attract Solvers
- Check if Solvers are actually running (ask in the dcipher Discord/Telegram)

In production, you'd use the only swaps Fee API to get recommended fees based on current market conditions.

---

## Issue 4: Wrong amount received

**Problem**: You set `amountOut` incorrectly.

**Understanding**: The `amountOut` parameter should equal `amountIn` minus the network fee. If network fee is 5%, and you're swapping 1 RUSD, your `amountOut` should be 0.95 RUSD.

**Solution**: Use the only swaps SDK or calculate: `amountOut = amountIn * (1 - networkFeePercentage)`

---

## Issue 5: Cannot find Router address

**Problem**: Router addresses change between testnet updates.

**Solution**: Always check the latest addresses at: [https://docs.dcipher.network/networks/onlyswaps](https://docs.dcipher.network/networks/onlyswaps)

Don't hardcode addresses from tutorials (including this one). Always verify current addresses in production.
