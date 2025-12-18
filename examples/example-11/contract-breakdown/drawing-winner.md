### Drawing the Winner (Requesting Randomness)

```solidity
function drawWinner(uint256 _lotteryId, uint32 callbackGasLimit) external payable nonReentrant returns (uint256 requestId) {
    Lottery storage lottery = lotteries[_lotteryId];

    require(lottery.state == LotteryState.OPEN, "Already drawn");
    require(block.timestamp >= lottery.endTime, "Lottery not ended");
    require(lottery.participants.length > 0, "No participants");

    lottery.state = LotteryState.DRAWING;

    (requestId, ) = _requestRandomnessPayInNative(callbackGasLimit);

    lottery.randomnessRequestId = requestId;
    randomnessRequestToLottery[requestId] = _lotteryId;

    emit RandomnessRequested(_lotteryId, requestId);

    return requestId;
}
```

Anyone can call this once the lottery ends. It checks that the lottery is still OPEN (hasn’t been drawn yet), that the end time has passed, and that at least one person entered.

Then it changes state to DRAWING and requests randomness from dcipher. The `_requestRandomnessPayInNative` call (inherited from `RandomnessReceiverBase`) sends the request to the dcipher network and pays for the callback with native ETH (sent as `msg.value`).

The function returns a request ID. This ID is how we’ll know which lottery the randomness is for when the callback arrives. We store it in the lottery struct and create a reverse mapping so the callback can find the lottery.

### The Callback (Where the Magic Happens)

```solidity
function onRandomnessReceived(uint256 requestId, bytes32 randomness) internal override {
    uint256 _lotteryId = randomnessRequestToLottery[requestId];
    Lottery storage lottery = lotteries[_lotteryId];

    require(lottery.randomnessRequestId == requestId, "Invalid request ID");

    lottery.randomValue = randomness;

    uint256 winnerIndex = uint256(randomness) % lottery.participants.length;
    lottery.winner = lottery.participants[winnerIndex];
    lottery.state = LotteryState.CLOSED;

    emit WinnerSelected(_lotteryId, lottery.winner, lottery.prizePool);
}
```

This function gets called automatically by the dcipher network when the random value is ready. You don’t call this. The network calls it.

It uses the request ID to find the lottery, verifies the ID matches (sanity check), stores the random value, then uses it to pick a winner.

The winner selection is simple: `randomValue % participants.length` gives us an index, we look up the participant at that index, done. Because participants can appear multiple times (if they bought multiple entries), this naturally weights the selection by entry count.

State changes to CLOSED. Winner is set. Prize is locked for them.

