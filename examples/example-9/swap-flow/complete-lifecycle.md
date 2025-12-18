# How a Swap Actually Happens (Step by Step)

In this example, we're going to build your first cross-chain swap—moving test tokens from **Base Sepolia** to **Avalanche Fuji**. We'll do it the clean way first: **pure Solidity**, directly inside a smart contract.

No frontend distractions. No frameworks. Just the protocol mechanics.

Once you understand how this works under the hood, adding a UI later is trivial.

Here's the complete journey your tokens take.

---

## Step 1: You Create a Swap Request

Your contract does two things:

It approves the only swaps Router to spend your tokens.

It calls `requestCrossChainSwap`.

When this happens:

Your tokens are transferred into the Router.

They're locked—not sent anywhere.

A unique request ID is created.

An event is emitted with all swap details.

That event is the "intent." It's the open offer to the network.

---

## Step 2: Solvers See the Opportunity

Solvers are constantly monitoring the chain.

They see your request and evaluate it:

Is the fee worth it?

Do I have liquidity on Avalanche?

Can I fulfill this quickly?

Nothing moves unless someone decides it's economically rational.

---

## Step 3: A Solver Fulfills the Swap

A Solver decides to take the trade.

They send tokens on Avalanche Fuji directly to your recipient address.

This is just a normal token transfer.

No special minting.

No bridge contracts on the destination chain.

You now have your tokens.

The Solver hasn't been paid yet.

---

## Step 4: dcipher Verifies Both Sides

dcipher nodes observe both chains.

They independently verify:

Your tokens are locked on Base.

The Solver sent the correct amount on Avalanche.

Once enough nodes agree, they collectively generate a threshold signature.

This signature is cryptographic proof that the swap is valid.

---

## Step 5: Settlement Completes the Swap

That signature is submitted to the Router on Base.

The Router verifies it on-chain.

If valid:

The locked tokens are released to the Solver.

The Solver receives their fee.

The request is closed.

Swap complete.
