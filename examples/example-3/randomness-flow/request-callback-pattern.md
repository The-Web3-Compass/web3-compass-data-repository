## Understanding the Flow (Because Code Without Context Is Just Gibberish)

Before we write any Solidity, let's talk through what actually happens when you request randomness. 

You're building a dice game. 

A player clicks "roll." Your smart contract needs a random number between 1 and 6. 

Here's what goes down:

Your smart contract calls dcipher's randomness system. 

"I need a random number, here's some gas money for the callback." 

This request gets emitted as an event on-chain. Standard Ethereum stuff so far.

But now it gets interesting. The dcipher network operators are watching the blockchain, **specifically the networks where dcipher is deployed and integrated**. These operators run independent nodes that monitor those chains for randomness requests. The moment your request lands in a block on a supported chain, every operator sees it at the same time. No central coordinator. No leader node. They all know exactly what needs to happen next.

Each operator has a share of a collective private key. These operators independently perform their part of the signing process. Each produces a "partial signature" using their key share. These partial signatures get broadcast to the other operators. When enough arrive (meeting the threshold), they get mathematically combined into one complete signature.

Here's the strange part: that threshold signature *is* your randomness.

Not "derived from randomness," not "signed randomness."

The signature itself is the random value.

It's deterministic (same message → same signature), but impossible to predict before the signing happens.

One of the operators submits a callback transaction to dcipher's `RandomnessSender` contract, including the threshold signature. The contract verifies the signature using the network's public key. If verification passes  and it only passes if the threshold math checks out, your consumer contract gets called with the random value.

By the time your `onRandomnessReceived()` function runs, the randomness has already been cryptographically validated. If the callback executes, the randomness is legitimate. That's the guarantee baked into the protocol.

The entire process is asynchronous. Your transaction finishes immediately. The randomness arrives later,usually in 10–30 seconds, depending on network conditions.

Your job is to write the callback handler.

Request goes out, threshold magic happens, verified callback arrives, you use the randomness.

Now let's write the actual code.

---
