
```solidity
function claimPrize(uint256 _lotteryId) external nonReentrant {
    Lottery storage lottery = lotteries[_lotteryId];

    require(lottery.state == LotteryState.CLOSED, "Lottery not closed");
    require(lottery.winner == msg.sender, "Not winner");
    require(!lottery.prizeClaimed, "Already claimed");

    lottery.prizeClaimed = true;

    require(prizeToken.transfer(lottery.winner, lottery.prizePool), "Transfer failed");

    emit PrizeClaimed(_lotteryId, lottery.winner, lottery.prizePool);
}
```

Winner calls this if they want their prize on Base. Checks they’re actually the winner, checks the prize hasn’t been claimed yet, marks it claimed, transfers the tokens, emits event, done.

Simple. Direct. No complexity.

### Claiming Cross-Chain (The Interesting Path)

```solidity
function claimPrizeCrossChain(
    uint256 _lotteryId,
    uint256 destinationChainId,
    address destinationToken,
    uint256 solverFee
) external nonReentrant returns (bytes32 swapRequestId) {
    Lottery storage lottery = lotteries[_lotteryId];

    require(lottery.state == LotteryState.CLOSED, "Lottery not closed");
    require(lottery.winner == msg.sender, "Not winner");
    require(!lottery.prizeClaimed, "Already claimed");

    lottery.prizeClaimed = true;

    uint256 prizeAmount = lottery.prizePool;
    require(prizeAmount > solverFee, "Prize too small");

    uint256 amountIn = prizeAmount - solverFee;
    uint256 amountOut = amountIn;

    prizeToken.approve(address(router), prizeAmount);

    swapRequestId = router.requestCrossChainSwap(
        address(prizeToken),
        destinationToken,
        amountIn,
        amountOut,
        solverFee,
        destinationChainId,
        lottery.winner
    );

    payouts[_lotteryId] = WinnerPayout({
        winner: lottery.winner,
        amount: amountIn,
        destinationChainId: destinationChainId,
        destinationToken: destinationToken,
        swapRequestId: swapRequestId,
        completed: false
    });

    emit CrossChainPayoutInitiated(_lotteryId, lottery.winner, amountIn, destinationChainId, swapRequestId);

    return swapRequestId;
}
```

This is where OnlySwaps comes in. Winner calls this if they want their prize on a different chain.

They specify the destination chain ID, the token address on that chain, and a solver fee. The solver fee is what gets paid to the liquidity provider who fulfills the swap. It comes out of the prize pool, so the winner receives `prizePool - solverFee` on the destination chain.

The contract approves the OnlySwaps router to spend the prize tokens, then calls `requestCrossChainSwap`. This creates a swap intent that solvers can see and fulfill.

OnlySwaps handles everything from here. A solver will send tokens to the winner on the destination chain, then get reimbursed on Base once the dcipher network verifies both sides of the swap. No bridge. No wrapped tokens. Just coordinated transfers verified by threshold signatures.

The contract stores the payout details so we can track completion later if needed.

---

## What Makes This Contract Different

Most lottery contracts are either provably fair OR flexible with payouts. Not both.

If they use on-chain randomness, they’re usually stuck with block hashes or timestamps, which are manipulatable. If they use external oracles, they’re introducing trust and cost. If they support cross-chain claims, they’re usually relying on bridges with all the security nightmares that entails.

This contract does both. Fair randomness through threshold cryptography. Flexible payouts through OnlySwaps. No bridges. No centralized oracles. No trust beyond the math.

The randomness is verifiable. The cross-chain swaps are trustless. The entire flow is transparent and auditable.

That’s what makes this interesting. Not the Solidity patterns (those are standard). Not the state machine (that’s basic). The integration with dcipher’s primitives in a way that creates something neither primitive could do alone.

You couldn’t build this without threshold randomness. You couldn’t build this without OnlySwaps. Together, they enable a lottery that’s actually fair and actually flexible.

Now let’s deploy it and see it work.

