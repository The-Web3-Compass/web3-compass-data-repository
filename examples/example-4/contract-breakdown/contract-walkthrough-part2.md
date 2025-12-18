function onRandomnessReceived(
    uint256 requestId, 
    bytes32 _randomness
) internal override {
    require(requestId == pendingRequestId, "Invalid request ID");
    require(winner == address(0), "Winner already picked");
    
    randomValue = _randomness;
    
    uint256 randomNumber = uint256(_randomness);
    uint256 winnerIndex = randomNumber % players.length;
    winner = players[winnerIndex];
    
    uint256 totalPot = address(this).balance;
    uint256 houseFee = (totalPot * HOUSE_FEE_PERCENT) / 100;
    uint256 prize = totalPot - houseFee;
    
    (bool success, ) = winner.call{value: prize}("");
    require(success, "Prize transfer failed");
    
    (bool feeSuccess, ) = organizer.call{value: houseFee}("");
    require(feeSuccess, "Fee transfer failed");
    
    emit WinnerPicked(winner, prize);
}
```

This is where everything comes together.

This function is `internal` and can only be called by the inherited randomness receiver logic. Nobody can call it directly. Not even the organizer. It's only callable when dcipher delivers verified randomness.

When this function runs, we know:

- The randomness came from dcipher's threshold network
- The signature has been verified
- The random value is legitimate

**Verification First**

Before doing anything with the randomness, we verify:

- The `requestId` matches our pending request (prevents replay attacks)
- We haven't already picked a winner (prevents double-execution)

**Winner Selection**

```solidity
uint256 randomNumber = uint256(_randomness);
uint256 winnerIndex = randomNumber % players.length;
winner = players[winnerIndex];
```

The random value is a `bytes32` (32 bytes of random data). We convert it to a `uint256` (a big number).

Then we use modulo arithmetic: `randomNumber % players.length`.

If there are 100 players, modulo gives us a number from 0 to 99. That's a valid index into the players array.

That index selects the winner. Simple, deterministic, fair.

**Why This Is Fair**

Every index has an equal probability of being selected. The randomness is uniformly distributed. The modulo operation doesn't introduce bias (as long as the player count is much smaller than 2^256, which it always is).

No player has an advantage based on when they bought their ticket. Index 0 has the same chance as index 99.

**Prize Distribution**

```solidity
uint256 totalPot = address(this).balance;
uint256 houseFee = (totalPot * HOUSE_FEE_PERCENT) / 100;
uint256 prize = totalPot - houseFee;
```

The pot is whatever ETH the contract holds (all the ticket purchases).

We calculate 5% for the house, 95% for the winner.

Then we send both:

```solidity
(bool success, ) = winner.call{value: prize}("");
require(success, "Prize transfer failed");

(bool feeSuccess, ) = organizer.call{value: houseFee}("");
require(feeSuccess, "Fee transfer failed");
```

Using `.call{value: ...}` is the modern, safe way to send ETH. We check that both transfers succeed. If either fails, the entire transaction reverts.

Finally, we emit an event announcing the winner and prize amount.

The lottery is complete.

### The Escape Hatch: Refunds

```solidity
function cancelAndRefund() external {
    require(block.timestamp >= requestTimestamp + TIMEOUT, "Timeout not reached");
    require(winner == address(0), "Winner already picked");
    require(!isLotteryOpen, "Lottery still open");
    
    for (uint256 i = 0; i < players.length; i++) {
        (bool success, ) = players[i].call{value: ticketPrice}("");
        require(success, "Refund failed");
    }
    
    emit LotteryRefunded();
}
```

This function exists for an edge case that should never happen: the randomness callback never arrives.

In practice, dcipher's network is reliable. Callbacks arrive within seconds. But smart contracts should be defensive.

If an hour passes after closing the lottery and no winner has been selected, anyone can call this function. It refunds every player's ticket price.

The logic is simple:

- Wait at least 1 hour after requesting randomness
- Check that no winner has been picked yet
- Check that the lottery was actually closed
- Loop through all players and refund their ticket price

This prevents funds from being locked forever if something goes catastrophically wrong.

### View Functions for Observability

```solidity
function getPlayers() external view returns (address[] memory) {
    return players;
}

function getPlayerCount() external view returns (uint256) {
    return players.length;
}

function getPotSize() external view returns (uint256) {
    return address(this).balance;
}
```

These helper functions let anyone query the lottery state without modifying anything.

Frontends use these to show:

- Current ticket sales
- Prize pool size
- Participant list

Full transparency. Anyone can verify the lottery's state at any time.

## The Complete Lifecycle

Let's trace the entire journey of a lottery from deployment to winner announcement.

**Block 1000: Deployment**

The organizer deploys FairLottery:

- Ticket price: 0.01 ETH
- Max tickets: 100
- RandomnessSender: 0xf4e0... (dcipher's contract on Base Sepolia)

The lottery is immediately open. State:

- `isLotteryOpen = true`
- `players = []`
- `winner = 0x0...`

**Blocks 1001-1050: Ticket Sales**

Players buy tickets. Each transaction:

- Sends exactly 0.01 ETH
- Calls `buyTicket()`
- Their address gets added to `players[]`

After 50 ticket sales:

- `players.length = 50`
- Contract balance: 0.5 ETH
- Pot is growing

**Block 1051: Lottery Closes**

The organizer decides to close. They call `closeLotteryAndRequestRandomness()` and send 0.001 ETH for the callback.

The contract:

- Sets `isLotteryOpen = false`
- Records `requestTimestamp = block.timestamp`
- Calls `_requestRandomnessPayInNative(200000)`
- Emits `RandomnessRequested(requestId: 12345)`

On-chain, dcipher operators see the request event.

**Blocks 1052-1054: Off-Chain Randomness Generation**

Behind the scenes:

- 9 dcipher operators see the request
- Each generates a partial signature using their key share
- They broadcast partials to each other
- When 5+ partials arrive, they aggregate into a complete signature
- One operator prepares the callback transaction

This takes seconds, maybe a few blocks.

**Block 1055: The Callback**

A dcipher operator submits a transaction calling the contract's inherited `receiveRandomness()` function.

That function:

- Verifies the signature is from dcipher's threshold key
- Verifies the proof of correctness
- Calls `onRandomnessReceived(12345, 0xabc123...)`

Our implementation runs:

- Verifies `requestId` matches
- Converts `0xabc123...` to a number
- Calculates `randomNumber % 50 = 17`
- Sets `winner = players[17]` (whoever bought ticket #17)
- Calculates prize: `0.5 ETH * 0.95 = 0.475 ETH`
- Calculates fee: `0.5 ETH * 0.05 = 0.025 ETH`
- Sends 0.475 ETH to the winner
- Sends 0.025 ETH to the organizer
- Emits `WinnerPicked(winner: 0x789..., prize: 0.475 ETH)`

The lottery is complete. State:

- `winner = 0x789...`
- `randomValue = 0xabc123...`
- Contract balance: 0 (everything distributed)

**Forever After: Verification**

Anyone can:

- Check the winner address
- See the random value used
- Verify the modulo calculation
- Confirm the transfers happened
- Audit the entire lottery from start to finish

Every step is on-chain, timestamped, immutable.

That's a fair lottery powered by threshold randomness.

---

## Compiling the Contract

