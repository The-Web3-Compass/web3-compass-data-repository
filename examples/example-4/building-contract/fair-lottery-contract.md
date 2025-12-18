
## Building the Fair Lottery Contract

We're building a lottery that uses threshold randomness to pick winners fairly.

The contract needs to:

1. Accept ticket purchases until a maximum is reached
2. Close the lottery and request randomness
3. Receive the randomness callback
4. Use the random value to select a winner
5. Distribute the prize

Create `contracts/FairLottery.sol`:

```solidity
*// SPDX-License-Identifier: MIT*
pragma solidity ^0.8.20;

import {RandomnessReceiverBase} from "randomness-solidity/src/RandomnessReceiverBase.sol";

contract FairLottery is RandomnessReceiverBase {
    *// State variables*
    address public organizer;
    uint256 public ticketPrice;
    uint256 public maxTickets;
    address[] public players;
    
    address public winner;
    bytes32 public randomValue;
    bool public isLotteryOpen;
    
    uint256 public pendingRequestId;
    uint256 public requestTimestamp;
    
    uint256 public constant HOUSE_FEE_PERCENT = 5;
    uint256 public constant TIMEOUT = 1 hours;
    
    *// Events*
    event TicketPurchased(address indexed player, uint256 ticketNumber);
    event RandomnessRequested(uint256 indexed requestId);
    event WinnerPicked(address indexed winner, uint256 prize);
    event LotteryClosed();
    event LotteryRefunded();
    
    constructor(
        uint256 _ticketPrice,
        uint256 _maxTickets,
        address _randomnessSender
    ) RandomnessReceiverBase(_randomnessSender, msg.sender) {
        require(_ticketPrice > 0, "Ticket price must be greater than 0");
        require(_maxTickets > 0, "Max tickets must be greater than 0");
        
        organizer = msg.sender;
        ticketPrice = _ticketPrice;
        maxTickets = _maxTickets;
        isLotteryOpen = true;
    }
    
    function buyTicket() external payable {
        require(isLotteryOpen, "Lottery is closed");
        require(msg.value == ticketPrice, "Incorrect ticket price");
        require(players.length < maxTickets, "Lottery is full");
        
        players.push(msg.sender);
        
        emit TicketPurchased(msg.sender, players.length - 1);
    }
    
    function closeLotteryAndRequestRandomness() external payable {
        require(msg.sender == organizer, "Only organizer can close lottery");
        require(isLotteryOpen, "Lottery already closed");
        require(players.length > 0, "No players in lottery");
        
        isLotteryOpen = false;
        requestTimestamp = block.timestamp;
        
        *// Request randomness with callback gas limit of 200000*
        (uint256 requestId, uint256 requestPrice) = _requestRandomnessPayInNative(200000);
        pendingRequestId = requestId;
        
        emit LotteryClosed();
        emit RandomnessRequested(pendingRequestId);
    }
    
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
    
    function getPlayers() external view returns (address[] memory) {
        return players;
    }
    
    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }
    
    function getPotSize() external view returns (uint256) {
        return address(this).balance;
    }
}
```

That's the complete contract.

