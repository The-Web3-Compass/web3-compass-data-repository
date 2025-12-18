## Making Payments: The Core Function

This is where everything comes together. Customer pays, router swaps, merchant receives. All in one transaction.

```solidity
function makePayment(
    address merchant,
    bytes32 orderId,
    address tokenIn,
    uint256 amountIn,
    uint256 expectedSettlement,
    uint256 solverFee
) external returns (bytes32 paymentId) {
    require(merchants[merchant].isRegistered, "Merchant not registered");
    require(amountIn > 0, "Amount must be > 0");
    require(solverFee > 0, "Solver fee required");
    require(block.chainid != settlementChainId, "Cannot pay on settlement chain");

    paymentId = keccak256(abi.encodePacked(
        block.chainid, msg.sender, merchant, orderId, paymentCounter++
    ));

    uint256 totalAmount = amountIn + solverFee;

    require(
        IERC20(tokenIn).transferFrom(msg.sender, address(this), totalAmount),
        "Transfer failed"
    );
    require(IERC20(tokenIn).approve(address(router), totalAmount), "Approval failed");

    address settlementAddress = merchants[merchant].settlementAddress;

    bytes32 swapRequestId = router.requestCrossChainSwap(
        tokenIn,
        settlementToken,
        amountIn,
        expectedSettlement,
        solverFee,
        settlementChainId,
        settlementAddress
    );

    payments[paymentId] = Payment({
        orderId: orderId,
        payer: msg.sender,
        merchant: merchant,
        sourceToken: tokenIn,
        sourceChainId: block.chainid,
        amountPaid: amountIn,
        amountSettled: expectedSettlement,
        timestamp: block.timestamp,
        status: PaymentStatus.Pending,
        swapRequestId: swapRequestId
    });

    swapToPayment[swapRequestId] = paymentId;
    merchantPayments[merchant].push(paymentId);

    emit PaymentInitiated(
        paymentId, orderId, merchant, msg.sender,
        block.chainid, tokenIn, amountIn, expectedSettlement, swapRequestId
    );

    return paymentId;
}
```

Let's break this monster down step by step.

The function takes six parameters. `merchant` is who's getting paid—must be a registered merchant address. `orderId` is the merchant's reference for this transaction, something they generate like "ORDER-12345". `tokenIn` is which token the customer is paying with (address of an ERC20 on the current chain). `amountIn` is how much customer is paying in tokenIn terms, raw amount including decimals. `expectedSettlement` is how much merchant should receive in settlement token terms, usually less than amountIn due to slippage. `solverFee` is payment to the solver who fulfills the swap, usually 0.1-1% of amountIn.

First, validation:

```solidity
require(merchants[merchant].isRegistered, "Merchant not registered");
require(amountIn > 0, "Amount must be > 0");
require(solverFee > 0, "Solver fee required");
require(block.chainid != settlementChainId, "Cannot pay on settlement chain");
```

Four checks before proceeding. Merchant must be registered (prevents typos/fraud). Amount must be positive (no zero/negative payments). Solver fee must be positive (solvers need incentive). Can't pay on the settlement chain itself (would be a same-chain transfer, pointless).

That last one is interesting. If we're settling on Base and you try to pay on Base, it fails. Why? Because cross-chain swaps only make sense when chains are different. Same-chain would just be a normal transfer.

Next, we generate a unique payment ID:

```solidity
paymentId = keccak256(abi.encodePacked(
    block.chainid, msg.sender, merchant, orderId, paymentCounter++
));
```

Hash of: chain ID + payer + merchant + order ID + counter. Why this combination? Uniqueness. Even if the same customer pays the same merchant for the same order, the counter increments, making IDs unique. Including chain ID ensures payment IDs don't collide across chains if you deploy this contract on multiple networks.

Then we handle the token transfer:

```solidity
uint256 totalAmount = amountIn + solverFee;

require(
    IERC20(tokenIn).transferFrom(msg.sender, address(this), totalAmount),
    "Transfer failed"
);
require(IERC20(tokenIn).approve(address(router), totalAmount), "Approval failed");
```

Two-step process. First, pull tokens from customer to this contract. Second, approve router to spend those tokens.

Customer must have approved this contract BEFORE calling makePayment. That's a prerequisite. If they haven't approved, the transferFrom fails.

Why not approve the router directly from the customer? Because this contract needs to be in control. If we let customers approve the router directly, they could potentially call router functions we don't want them calling. By taking custody first, then approving the router, we maintain control of the flow.

Now the magic happens:

```solidity
address settlementAddress = merchants[merchant].settlementAddress;

bytes32 swapRequestId = router.requestCrossChainSwap(
    tokenIn,
    settlementToken,
    amountIn,
    expectedSettlement,
    solverFee,
    settlementChainId,
    settlementAddress
);
```

We call the only swaps router with the input token (what customer paid with), output token (what merchant receives, from our immutable config), input amount, expected output amount (minimum merchant should receive), solver fee (incentive for someone to fulfill this), destination chain (from our immutable config), and recipient address (merchant's settlement address).

The router emits an event. Solvers watching the chain see it. One solver says "I can fulfill that" and sends the merchant tokens on the destination chain. Later, that solver claims the customer's tokens on this chain.

The router returns a `swapRequestId` we can use to check if the swap executed.

Finally, we record everything:

```solidity
payments[paymentId] = Payment({
    orderId: orderId,
    payer: msg.sender,
    merchant: merchant,
    sourceToken: tokenIn,
    sourceChainId: block.chainid,
    amountPaid: amountIn,
    amountSettled: expectedSettlement,
    timestamp: block.timestamp,
    status: PaymentStatus.Pending,
    swapRequestId: swapRequestId
});

swapToPayment[swapRequestId] = paymentId;
merchantPayments[merchant].push(paymentId);
```

Three storage updates. Save complete payment details in `payments` mapping. Link swap request ID to payment ID (for status checking later). Add this payment to merchant's list of payments.

Now we have a complete audit trail. Every detail preserved forever on-chain.

Emit the event:

```solidity
emit PaymentInitiated(
    paymentId, orderId, merchant, msg.sender,
    block.chainid, tokenIn, amountIn, expectedSettlement, swapRequestId
);

return paymentId;
```

Frontends watching for this event can immediately show "Payment initiated" in the UI. Return the payment ID so caller can use it to check status later.

---
