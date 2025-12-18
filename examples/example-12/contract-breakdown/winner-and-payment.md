## Cross-Chain Payment Integration

This is where OnlySwaps shines.

### Same-Chain Payment

```solidity
function payForItem(uint256 _listingId) external nonReentrant
```

Simple case. Winner calls this, contract transfers RUSD from winner to seller using standard ERC20 `transferFrom`. Done.

### Cross-Chain Payment

```solidity
function payForItemCrossChain(
    uint256 _listingId,
    uint256 _destinationChainId,
    address _destinationToken,
    uint256 _solverFee
) external nonReentrant returns (bytes32 swapRequestId)
```

Interesting case. Winner wants to pay from a different chain.

The contract:
1. Validates the winner is calling this
2. Approves the OnlySwaps router to spend the winning bid amount
3. Calls `router.requestCrossChainSwap` with:
- Source token (RUSD on Base)
- Destination token (RUSD on Avalanche)
- Amount in (winning bid)
- Amount out (winning bid minus solver fee)
- Solver fee (paid to whoever fulfills the swap)
- Destination chain ID
- Recipient (the seller)

OnlySwaps creates a swap intent. Solvers watching the network see this and compete to fulfill it. One solver sends RUSD to the seller on Base Sepolia, then submits proof to the dcipher network. Once verified, that solver gets reimbursed on Avalanche Fuji.

From the winner’s perspective: they pay from Avalanche. From the seller’s perspective: they receive on Base. No bridge. No wrapped tokens. Just coordinated transfers verified by threshold signatures.

---

