## Payment Models: Two Ways to Pay for Randomness

dcipher randomness costs money (running threshold networks isn't free), but you've got options.

### Direct Payment: Pay-As-You-Go

The `_requestRandomnessPayInNative()` function we used implements direct payment. Each request is its own transaction with native tokens sent as `msg.value`.

When you call it, you include enough ETH (or whatever the chain's native token is) to cover the request cost. That cost includes gas for the callback plus service fees for dcipher operators. Send too little? Transaction reverts. Send too much? Excess stays in your contract (doesn't auto-refund, but you could implement withdrawal logic).

Direct payment works great for simple applications, one-off randomness requests, or when you want straightforward billing. User pays directly when requesting randomness. No upfront deposits. No subscription management. Just pay-per-use.

### Subscription: Prepaid Balance

The other option is subscription-based. You create a subscription account, deposit funds into it, then make requests that draw from that balance. Similar to how Chainlink VRF subscriptions work.

To use subscriptions, call `_requestRandomnessWithSubscription(callbackGasLimit)` instead. But first you need setup. Call `createSubscription()` on the `RandomnessSender` contract to get a subscription ID. Fund it by sending tokens. Tell your consumer contract which subscription to use by calling `setSubId()` (available in `RandomnessReceiverBase`).

Once configured, every request deducts from the subscription balance. Balance runs low? Top it up. Runs out? Requests fail until you add funds.

Subscriptions make sense for applications with frequent randomness requests. Instead of handling payment in every user transaction, you prepay and let the contract pull from the subscription. Cleaner for high-volume use cases and can save gas because you're not transferring ETH on every request.

For our `DiceRoller` example, we're using direct payment because it's simpler to demonstrate. But subscriptions exist for when you scale.

---
