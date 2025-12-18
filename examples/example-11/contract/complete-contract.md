## The Contract (All of It, Right Now)

Alright, enough setup. Let’s see the actual contract. All of it. No piecemeal reveals, no “we’ll add this later” nonsense. Here’s the complete `CrossChainLottery.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {RandomnessReceiverBase} from "randomness-solidity/src/RandomnessReceiverBase.sol";
import {IRouter} from "onlyswaps-solidity/src/interfaces/IRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CrossChainLottery is RandomnessReceiverBase, ReentrancyGuard {

    IRouter public immutable router;
    IERC20 public immutable prizeToken;

    uint256 public lotteryId;
    uint256 public entryFee;
    uint256 public prizePool;

    enum LotteryState { OPEN, DRAWING, CLOSED }

    struct Lottery {
        uint256 id;
        uint256 prizePool;
        uint256 entryFee;
        uint256 startTime;
        uint256 endTime;
        address[] participants;
        address winner;
        uint256 randomnessRequestId;
        bytes32 randomValue;
        LotteryState state;
        bool prizeClaimed;
    }

    struct WinnerPayout {
        address winner;
        uint256 amount;
        uint256 destinationChainId;
        address destinationToken;
        bytes32 swapRequestId;
        bool completed;
    }

    mapping(uint256 => Lottery) public lotteries;
    mapping(uint256 => WinnerPayout) public payouts;
    mapping(uint256 => uint256) public randomnessRequestToLottery;
    mapping(address => uint256[]) public userLotteries;

    event LotteryCreated(uint256 indexed lotteryId, uint256 entryFee, uint256 startTime, uint256 endTime);
    event EntryPurchased(uint256 indexed lotteryId, address indexed participant, uint256 entriesCount);
    event RandomnessRequested(uint256 indexed lotteryId, uint256 indexed requestId);
    event WinnerSelected(uint256 indexed lotteryId, address indexed winner, uint256 prizeAmount);
    event CrossChainPayoutInitiated(uint256 indexed lotteryId, address indexed winner, uint256 amount, uint256 destinationChainId, bytes32 swapRequestId);
    event PrizeClaimed(uint256 indexed lotteryId, address indexed winner, uint256 amount);

    constructor(
        address _randomnessSender,
        address _owner,
        address _router,
        address _prizeToken,
        uint256 _entryFee
    ) RandomnessReceiverBase(_randomnessSender, _owner) {
        router = IRouter(_router);
        prizeToken = IERC20(_prizeToken);
        entryFee = _entryFee;
    }

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

    function claimPrize(uint256 _lotteryId) external nonReentrant {
        Lottery storage lottery = lotteries[_lotteryId];

        require(lottery.state == LotteryState.CLOSED, "Lottery not closed");
        require(lottery.winner == msg.sender, "Not winner");
        require(!lottery.prizeClaimed, "Already claimed");

        lottery.prizeClaimed = true;

        require(prizeToken.transfer(lottery.winner, lottery.prizePool), "Transfer failed");

        emit PrizeClaimed(_lotteryId, lottery.winner, lottery.prizePool);
    }

    function claimPrizeCrossChain(
        uint256 _lotteryId,
        uint256 destinationChainId,
        address destinationToken,
        uint256 solverFee
    ) external nonReentrant returns (bytes32 swapRequestId) {
        Lottery storage lottery = lotteries[_lotteryId];

        require(lottery.state == LotteryState.CLOSED, "Lottery not closed");
        require(lottery.winner == msg.sender, "Not winner");
        require(!lottery.prizeClaimed, "Already claimed");

        lottery.prizeClaimed = true;

        uint256 prizeAmount = lottery.prizePool;
        require(prizeAmount > solverFee, "Prize too small");

        uint256 amountIn = prizeAmount - solverFee;
        uint256 amountOut = amountIn;

        prizeToken.approve(address(router), prizeAmount);

        swapRequestId = router.requestCrossChainSwap(
            address(prizeToken),
            destinationToken,
            amountIn,
            amountOut,
            solverFee,
            destinationChainId,
            lottery.winner
        );

        payouts[_lotteryId] = WinnerPayout({
            winner: lottery.winner,
            amount: amountIn,
            destinationChainId: destinationChainId,
            destinationToken: destinationToken,
            swapRequestId: swapRequestId,
            completed: false
        });

        emit CrossChainPayoutInitiated(_lotteryId, lottery.winner, amountIn, destinationChainId, swapRequestId);

        return swapRequestId;
    }

    // View functions omitted for brevity - they just return lottery data
}
```

That’s it. That’s the whole thing. About 200 lines of Solidity that handles fair lotteries with cross-chain payouts.

Now let’s break down what’s actually happening here, because there’s more going on than you might think.

---
