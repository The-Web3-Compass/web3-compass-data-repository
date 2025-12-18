## What Actually Happened Behind the Scenes

Let's pause and unpack what just went down, because there's sophisticated cryptography that happened invisibly while you were watching event logs.

When you called `rollDice()`, your contract called the base contract's `_requestRandomnessPayInNative()` function. That function called dcipher's deployed `RandomnessSender` contract, passing your callback gas limit and payment. The `RandomnessSender` emitted a `RandomnessRequested` event. Your transaction completed and landed in a block.

Multiple dcipher operators running nodes saw that event simultaneously. They read your request parameters...your contract address, the request ID, the callback gas limit. They know what needs to happen next.

Each operator independently performs its part of the threshold signature scheme. Remember the Distributed Key Generation from Example 1? These operators already went through that ceremony. They each hold a share of a collective private key. No single operator has the complete key. It's mathematically impossible for any one of them to generate a valid signature alone.

Now they're using those key shares to create a threshold signature. The message they're signing includes your request ID and other parameters. Each operator produces a partial signature using its key share. These partials get broadcast to other operators. When enough partials arrive (meeting the threshold...say 5 out of 9), they can be mathematically combined into one complete threshold signature.

That threshold signature is deterministic. Same message, same key, same signature. But nobody could predict what the signature would be before the signing process happened. It's deterministic but unpredictable. Perfect for randomness.

One of the operators (whoever aggregated enough partials first) constructs a callback transaction. This transaction calls `fulfillRandomness()` on the `RandomnessSender` contract, providing the request ID, the threshold signature, and the signature components for verification.

The `RandomnessSender` verifies the threshold signature against the network's public key. If verification passes, it calls your contract's `receiveRandomness()` function (inherited from `RandomnessReceiverBase`), which then calls your `onRandomnessReceived()` implementation. The gas cost for this callback? Already prepaid by you in the original request.

Your `onRandomnessReceived()` function executes. Stores the random value. Emits an event. Does whatever your application logic requires. The randomness is now available for anyone to read from your contract's state.

This entire process is trustless. You don't trust any single operator. You don't trust the aggregator. The math itself guarantees fairness. If anyone tried submitting a fake signature, verification fails and the transaction reverts. If operators tried colluding but didn't meet the threshold, they couldn't generate a valid signature. The security is baked into the cryptography.

And from your perspective as a developer? You called a function and implemented a callback. The threshold magic happened transparently.

---

## Where to Go From Here

You just built a working randomness consumer. Requested cryptographically verifiable random numbers from a threshold network. Received them in a callback. Used them in contract logic. That's the core pattern for every randomness application on dcipher.

For now, take what you learned and experiment. Modify `DiceRoller` to support multiple simultaneous rolls. Build a coin flip game. Track statistics across requests. The pattern is always the same: request, wait for callback, use the randomness. Once you internalize that flow, you can build anything that needs fair, verifiable randomness.

The dcipher docs have network-specific deployment addresses, current pricing, and feature details. Check there for the latest on which chains they support and where contracts live.

And if you hit issues? The dcipher community is around. Ask questions. Share what you're building. Randomness on blockchain used to be unsolvable. With threshold signatures, it's finally solved. Now go build something that needs it.
