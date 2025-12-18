## What We're Building Today

We're going to build a simple lottery contract using dcipher's verifiable randomness.

Here's the complete flow:

1. An organizer deploys the lottery with a ticket price and maximum number of tickets
2. Players buy tickets by sending ETH (each ticket purchase records their address)
3. When enough tickets are sold, the organizer closes the lottery
4. Closing the lottery automatically requests randomness from dcipher
5. The dcipher network generates a random value and calls back to the contract
6. The contract uses that random value to select a winner
7. The winner receives the prize pool (minus a small organizer fee)
8. Everyone can verify the selection was fair by checking the on-chain randomness proof

The security comes from cryptography, not from trusting any single party. The fairness is mathematically enforced, not organizationally promised.

We'll keep this focused and practical: just the core lottery mechanics with dcipher randomness integration.

Let's build it.

---

## Understanding the Flow (Before We Touch Any Code)

Before writing Solidity, let's walk through exactly what happens in a fair lottery using threshold randomness. Understanding the flow makes the code obvious.

**Creating the Lottery**

Someone wants to run a lottery. Maybe it's for a community prize pool. Maybe it's a fundraiser. Maybe it's a game where the last ticket buyer has a chance to win big.

They deploy the `FairLottery` contract, specifying:

- Ticket price (in ETH)
- Maximum number of tickets
- The RandomnessSender address (the dcipher contract that processes requests)

The contract is now live and ready to accept ticket purchases.

**Buying Tickets**

You want to participate. The ticket price is 0.01 ETH.

You call `buyTicket()` and send 0.01 ETH.

The contract:

- Verifies the lottery is still open
- Verifies you sent exactly the ticket price
- Adds your address to the `players` array
- Emits an event showing you bought ticket #7 (or whatever index you got)

Other players do the same. Each purchase adds another address to the array. The prize pool grows with each ticket sold.

During this phase, everyone can see:

- How many tickets have been sold
- The current prize pool
- That the lottery is open

Nobody knows who will win yet because the winner hasn't been selected.

**The Waiting Period**

The lottery is open. Tickets are being sold. The array of players is growing.

Eventually one of two things happens:

1. The maximum number of tickets is reached, or
2. The organizer decides it's time to close the lottery

At this point, we're ready to pick a winner. But we need randomness first.

**Closing and Requesting Randomness**

The organizer calls `closeLotteryAndRequestRandomness()`.

They send a small amount of ETH (~0.001 ETH) to pay for the callback gas. This covers the cost of dcipher calling back into the contract later.

The contract:

- Sets `isLotteryOpen = false` (no more ticket purchases allowed)
- Records the current block timestamp
- Calls `_requestRandomnessPayInNative(200000)` to request randomness with a 200k gas callback limit
- Receives a `requestId` back
- Stores that `requestId` as `pendingRequestId`

At this moment, the randomness request is on-chain. dcipher operators can see it. They spring into action.

**Randomness Generation (Off-Chain)**

This happens behind the scenes, but it's important to understand:

Each dcipher operator sees the randomness request. Each one:

- Generates a partial signature using their key share
- The partial signatures are specific to your request
- Broadcasts their partial to the other operators

Off-chain, these partials get aggregated. When enough arrive (meeting the threshold), they combine into a complete signature.

One operator submits a transaction calling your contract's inherited `receiveRandomness()` function. That transaction includes:

- The complete threshold signature
- Cryptographic proofs of validity
- Your `requestId` to identify which request this fulfills

The transaction costs gas to execute (that's why you paid upfront). The operator is compensated from your prepayment.

**The Callback**

Your contract receives the callback through its inherited `receiveRandomness()` function.

That function:

- Verifies the signature is valid (automatic, handled by the base contract)
- Verifies the proofs are correct (automatic)
- Calls your `onRandomnessReceived()` implementation with the random value

Now your code runs:

```solidity
function onRandomnessReceived(uint256 requestId, bytes32 _randomness) internal override {
    require(requestId == pendingRequestId, "Invalid request ID");
    require(winner == address(0), "Winner already picked");
    
    randomValue = _randomness;
    
    uint256 randomNumber = uint256(_randomness);
    uint256 winnerIndex = randomNumber % players.length;
    winner = players[winnerIndex];
    
    *// Calculate and distribute prize...*
}
```

The contract:

- Converts the random bytes to a number
- Uses modulo to get an index within the players array
- Selects that player as the winner
- Calculates the prize (total pot minus 5% house fee)
- Sends the prize to the winner
- Sends the fee to the organizer

**What Makes This Secure**

The randomness is unmanipulable:

- No single operator could generate it alone
- Threshold collusion would require controlling 5+ of 9 operators (or whatever the threshold is)
- The random value is generated fresh for each request
- The math enforces correctness automatically

The timing prevents manipulation:

- The lottery closes before randomness is requested
- Players can't buy tickets after seeing the random value
- The organizer can't choose whether to request based on who would win

The verification is automatic:

- The base contract verifies all proofs
- Anyone can check the randomness came from dcipher's threshold key
- The transaction calling back is on-chain for everyone to audit

This is what a truly fair lottery looks like on a transparent blockchain.

Now let's write the code that makes it real.

---
