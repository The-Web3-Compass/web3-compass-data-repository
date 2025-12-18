## Contract Architecture: Understanding The Pieces

Let's walk through the contract's building blocks. First up, the configuration that never changes:

```solidity
IRouter public immutable router;
uint256 public immutable settlementChainId;
address public immutable settlementToken;
```

Three immutable variables set at deployment. Never change. Ever.

The `router` is the only swaps router contract that handles cross-chain swaps. On Avalanche Fuji testnet it's `0x16323707e61d20A39AaE5ab64808e480B91658aB`. On Base Sepolia? Same address. Convenient multichain deployment.

The `settlementChainId` tells us which chain merchants receive payments on. For this implementation: `84532` (Base Sepolia). Every payment, regardless of where it originates, converts to tokens on this chain.

The `settlementToken` is which token merchants receive. For this implementation: USDC on Base Sepolia (`0x9Eb392A6286138E5d59a40Da5398e567Ab3AAd7c`).

Why immutable? Two reasons. First, gas optimization—immutable variables cost less to read than storage variables. Second, it enforces consistency. All merchants get paid in the same token on the same chain. Simplifies accounting.

Now the payment status tracking:

```solidity
enum PaymentStatus { Pending, Settled, Completed, Refunded }
```

Four states. A payment moves through them sequentially (except Refunded, which can happen from Pending).
There are four states a payment can be in. A payment moves through them sequentially (except Refunded, which can happen from Pending).

Pending means payment initiated, cross-chain swap requested, waiting for solver. Settled means solver fulfilled and merchant received tokens. Completed is for future use—think additional confirmations or multi-step processes. Refunded means something went wrong and the customer got their money back.

Right now we mostly use Pending and Settled. Completed and Refunded are infrastructure for future features like partial refunds or dispute resolution.

Here's the payment record structure:

```solidity
struct Payment {
    bytes32 orderId;
    address payer;
    address merchant;
    address sourceToken;
    uint256 sourceChainId;
    uint256 amountPaid;
    uint256 amountSettled;
    uint256 timestamp;
    PaymentStatus status;
    bytes32 swapRequestId;
}
```

This is your complete payment record. Everything you need to reconstruct what happened.

The `orderId` is the merchant's identifier for this transaction. Like "ORDER-12345" or "INVOICE-2024-001". Helps merchants reconcile payments with their database.

`payer` is who sent the money—the `msg.sender` when `makePayment` was called. `merchant` is who receives it—the registered merchant address.

`sourceToken` tells you which token the payer used. Could be USDT on Avalanche, USDC on Arbitrum, whatever. `sourceChainId` tells you which chain the payment originated from. `43113` for Avalanche Fuji, for example.

`amountPaid` is how much the customer sent in source token terms. If they paid 100 USDT, this is `100e6` (assuming 6 decimals). `amountSettled` is how much the merchant should receive in settlement token terms. Usually slightly less due to slippage and fees. If customer paid 100 USDT and slippage is 5%, this might be `95e6`.

`timestamp` captures when payment was initiated—block timestamp from the source chain. `status` is the current payment state from our enum.

`swapRequestId` is the ID returned by the only swaps router. We use this to check if the swap actually executed.

This struct is your audit trail. Every payment is permanently recorded with all details.

The merchant profile looks like this:

```solidity
struct Merchant {
    bool isRegistered;
    address settlementAddress;
    uint256 totalReceived;
    uint256 pendingBalance;
}
```

This struct stores who a merchant is and where they want money sent.

`isRegistered` is a simple flag. It must be true for a merchant to receive payments, preventing typos where someone accidentally sends money to a random address.

`settlementAddress` is where this merchant actually wants to receive funds. Could be different from their registered merchant address. Maybe they registered with their hot wallet but want payments to go to their cold storage.

`totalReceived` is a running total of all payments ever received. Useful for analytics. `pendingBalance` is reserved for future use—would track payments that are in-flight but not yet settled.

Finally, the storage layer:

```solidity
mapping(bytes32 => Payment) public payments;
mapping(address => Merchant) public merchants;
mapping(address => bytes32[]) public merchantPayments;
mapping(bytes32 => bytes32) public swapToPayment;
uint256 private paymentCounter;
```

Four mappings. One counter. This is our database.

`payments` maps payment ID to payment details. The main registry. `merchants` maps merchant address to merchant profile—who's registered and where they want money.

`merchantPayments` maps merchant address to an array of payment IDs. Lets us query "show me all payments for this merchant."

`swapToPayment` links only swaps requests back to our payment records. When only swaps tells us "swap 0xabc123 executed," we look up which payment that corresponds to.

`paymentCounter` is a simple incrementing number. Used when generating unique payment IDs. Starts at 0, increments with each payment.

Why these specific mappings? Query patterns. Frontends need to look up a specific payment (use `payments`), check if someone is a merchant (use `merchants`), show all payments for a merchant (use `merchantPayments`), and check if a swap completed (use `swapToPayment` then query the router).

Each mapping optimizes one query pattern.

---
