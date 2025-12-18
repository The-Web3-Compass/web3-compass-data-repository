## View Functions: Reading Payment Data

The contract has several view functions for querying state. Let's examine each.

First, the simple payment lookup:

```solidity
function getPayment(bytes32 paymentId) external view returns (Payment memory) {
    return payments[paymentId];
}
```

Give me a payment ID, I'll give you the full Payment struct. Frontends use this to display payment details.

Checking if a payment actually settled:

```solidity
function isPaymentSettled(bytes32 paymentId) external view returns (bool) {
    Payment memory payment = payments[paymentId];
    if (payment.timestamp == 0) return false;

    IRouter.SwapRequestParametersWithHooks memory params =
        router.getSwapRequestParameters(payment.swapRequestId);
    return params.executed;
}
```

Here's how it works. Load the payment. If timestamp is zero, payment doesn't exist, return false. Query the router with the swap request ID. Return whether the swap `executed`.

The router maintains state about swap requests. We don't duplicate that state. We just query it when needed.

Why check timestamp == 0? Because that's the default value for uint256. If a payment was never created, all fields are zero. Timestamp being zero means "doesn't exist."

Getting all payments for a merchant:

```solidity
function getMerchantPayments(address merchant) external view returns (bytes32[] memory) {
    return merchantPayments[merchant];
}
```

Returns array of all payment IDs for a merchant. Frontend calls this, then calls `getPayment` for each ID to build a payment history list.

Getting merchant info:

```solidity
function getMerchantInfo(address merchant) external view returns (Merchant memory) {
    return merchants[merchant];
}
```

Returns merchant registration status and details.

And finally, deep dive into swap details:

```solidity
function getSwapStatus(bytes32 paymentId)
    external view returns (IRouter.SwapRequestParametersWithHooks memory)
{
    Payment memory payment = payments[paymentId];
    require(payment.timestamp > 0, "Payment not found");
    return router.getSwapRequestParameters(payment.swapRequestId);
}
```

Returns the full swap parameters from the router. Useful for debugging. If a payment is stuck, you can check the swap status to see what's happening.

---
