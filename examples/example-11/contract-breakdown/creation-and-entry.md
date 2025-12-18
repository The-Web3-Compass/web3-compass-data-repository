### Creating a Lottery (Owner Only)

```solidity
function createLottery(uint256 _entryFee, uint256 _duration) external onlyOwner returns (uint256) {
    require(_entryFee > 0, "Entry fee must be greater than 0");
    require(_duration > 0, "Duration must be greater than 0");

    lotteryId++;

    Lottery storage lottery = lotteries[lotteryId];
    lottery.id = lotteryId;
    lottery.entryFee = _entryFee;
    lottery.startTime = block.timestamp;
    lottery.endTime = block.timestamp + _duration;
    lottery.state = LotteryState.OPEN;

    emit LotteryCreated(lotteryId, _entryFee, lottery.startTime, lottery.endTime);

    return lotteryId;
}
```

This is straightforward. Owner calls this with an entry fee and duration. Contract increments the lottery counter, creates a new lottery in storage, sets the timing, marks it OPEN, emits an event, returns the ID.

The `onlyOwner` modifier (from `RandomnessReceiverBase`) restricts this to the contract owner. In production, you’d probably want a DAO or multisig here instead of a single address, but for this example, owner-only works fine.

### Entering the Lottery (Where the Money Flows In)

```solidity
function enterLottery(uint256 _lotteryId, uint256 _entries) external nonReentrant {
    Lottery storage lottery = lotteries[_lotteryId];

    require(lottery.state == LotteryState.OPEN, "Lottery not open");
    require(block.timestamp < lottery.endTime, "Lottery ended");

    uint256 totalCost = lottery.entryFee * _entries;

    require(prizeToken.transferFrom(msg.sender, address(this), totalCost), "Transfer failed");

    for (uint256 i = 0; i < _entries; i++) {
        lottery.participants.push(msg.sender);
    }

    lottery.prizePool += totalCost;
    userLotteries[msg.sender].push(_lotteryId);

    emit EntryPurchased(_lotteryId, msg.sender, _entries);
}
```

Users call this to buy entries. They specify how many entries they want. The contract calculates the cost, pulls the tokens (using `transferFrom`, which means they need to approve first), then adds them to the participants array once per entry.

The prize pool grows with every entry. No house cut. No fees. Just pure accumulation. Whatever comes in goes to the winner.

The `nonReentrant` guard here is critical. We’re transferring tokens and modifying state. Without this protection, a malicious token contract could reenter during `transferFrom` and mess with the participant list or prize pool. With it, that attack is impossible.
