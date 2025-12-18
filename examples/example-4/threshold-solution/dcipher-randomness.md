## Enter Threshold Randomness

Here's what we need for a fair lottery:

- Random winner selection nobody can predict
- No single party controls the outcome
- Everyone can verify it was done correctly
- Works directly on-chain

Threshold randomness provides this through distributed key shares.

**How it works:**

Multiple independent operators (the dcipher network) each hold a *share* of a private key. No single operator has the complete key.

When your lottery requests randomness:

1. Each operator generates a partial signature using their key share
2. These partials get combined mathematically
3. When enough partials arrive (the threshold), they form a complete signature
4. That signature is the random value

**Why it's secure:**

No single operator can generate the random value alone. They need threshold cooperation (e.g., 5 out of 9 operators).

Even if some operators collude, they can't manipulate the outcome unless they control the threshold majority.

The math enforces this. It's not organizational trust—it's cryptographic guarantee.

**For your lottery:**

Your contract makes one function call: `_requestRandomnessPayInNative()`.

The dcipher network handles everything else: generating partials, aggregating them, delivering the result.

Your contract receives a callback with a verified random value. You use it to select the winner.

Simple integration. Strong security guarantees.

---

## How dcipher's Randomness Network Works

Let's make this concrete with the actual mechanics.

The dcipher network consists of independent operators distributed globally. Each operator:

- Runs a node that monitors supported blockchains
- Holds a share of the network's threshold private key
- Responds to randomness requests by generating partial signatures
- Submits these signatures to the blockchain

Here's what happens when your lottery contract requests randomness:

![Randomness Request Flowchart](https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/examples/example-4/images/randomness-request-flowchart.png)

**Step 1: Your Contract Makes a Request**

Your contract inherits from `RandomnessReceiverBase` and calls `_requestRandomnessPayInNative()`. This function:

- Emits an event on-chain announcing a randomness request
- Specifies a callback gas limit (how much gas to use when delivering the result)
- Includes payment for that callback execution

**Step 2: Operators See the Request**

dcipher operators monitor the chain. They see your request event. Each operator:

- Validates the request is legitimate
- Generates their portion of the random signature using their key share
- Broadcasts their partial signature to the other operators

**Step 3: Threshold Aggregation**

The partial signatures get collected off-chain. When enough arrive to meet the threshold (say 5 out of 9), they can be mathematically combined into a complete signature.

This aggregation can be done by anyone, not just dcipher operators. The math is deterministic: given the same partial signatures, everyone computes the same final signature.

**Step 4: Callback to Your Contract**

One operator (typically whoever aggregated the threshold first) submits a transaction back to your contract. This transaction:

- Calls your contract's inherited `receiveRandomness()` function
- Includes the complete threshold signature
- Includes proofs that the signature is valid

Your contract automatically verifies the signature came from the legitimate threshold key. If verification passes, it calls your `onRandomnessReceived()` function with the random value.

**Step 5: Your Contract Uses the Randomness**

Your implementation of `onRandomnessReceived()` receives a `bytes32` random value. You use this to pick the lottery winner. The contract continues executing, distributes the prize, and the lottery concludes.

All of this happens automatically. Your contract makes one request, waits for one callback, and receives cryptographically verified randomness.

---

