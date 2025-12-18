# Building the Sealed-Bid Auction Contract

We're building an auction contract that uses blocklock encryption to keep bids secret until a predetermined reveal time.

The contract needs to:
1. Create auctions with a target reveal block
2. Accept encrypted bids
3. Request decryption when the reveal block is reached
4. Decrypt bids and determine the winner

Create `contracts/SealedBidAuction.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TypesLib} from "blocklock-solidity/src/libraries/TypesLib.sol";
import {AbstractBlocklockReceiver} from "blocklock-solidity/src/AbstractBlocklockReceiver.sol";

contract SealedBidAuction is AbstractBlocklockReceiver {

    struct Auction {
        address creator;
        string description;
        uint256 minBid;
        uint256 revealBlock;
        uint256 biddingDeadline;
        bool decrypted;
        address winner;
        uint256 winningBid;
        uint256 createdAt;
    }

    struct EncryptedBid {
        address bidder;
        TypesLib.Ciphertext encryptedAmount;
        uint256 decryptedAmount;
        bool decrypted;
        uint256 timestamp;
    }

    uint256 public auctionCounter;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => EncryptedBid[]) public auctionBids;
    mapping(uint256 => uint256) public requestIdToAuction;

    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed creator,
        string description,
        uint256 minBid,
        uint256 revealBlock,
        uint256 biddingDeadline
    );

    event BidSubmitted(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 bidIndex
    );

    event DecryptionRequested(
        uint256 indexed auctionId,
        uint256 requestId
    );

    event BidsDecrypted(
        uint256 indexed auctionId,
        address winner,
        uint256 winningBid
    );

    constructor(address _blocklockSender)
        AbstractBlocklockReceiver(_blocklockSender)
    {}

    function createAuction(
        string calldata description,
        uint256 minBid,
        uint256 blocksUntilReveal,
        uint256 biddingDurationBlocks
    ) external returns (uint256) {
        require(blocksUntilReveal > biddingDurationBlocks, "Reveal must be after bidding ends");
        require(minBid > 0, "Minimum bid must be greater than 0");
        require(biddingDurationBlocks > 0, "Bidding duration must be positive");

        uint256 auctionId = auctionCounter++;
        uint256 revealBlock = block.number + blocksUntilReveal;
        uint256 biddingDeadline = block.number + biddingDurationBlocks;

        auctions[auctionId] = Auction({
            creator: msg.sender,
            description: description,
            minBid: minBid,
            revealBlock: revealBlock,
            biddingDeadline: biddingDeadline,
            decrypted: false,
            winner: address(0),
            winningBid: 0,
            createdAt: block.timestamp
        });

        emit AuctionCreated(
            auctionId,
            msg.sender,
            description,
            minBid,
            revealBlock,
            biddingDeadline
        );

        return auctionId;
    }

    function submitBid(
        uint256 auctionId,
        TypesLib.Ciphertext calldata encryptedBid
    ) external returns (uint256) {
        Auction storage auction = auctions[auctionId];
        require(auction.creator != address(0), "Auction does not exist");
        require(block.number <= auction.biddingDeadline, "Bidding period has ended");
        require(!auction.decrypted, "Auction already revealed");

        EncryptedBid memory newBid = EncryptedBid({
            bidder: msg.sender,
            encryptedAmount: encryptedBid,
            decryptedAmount: 0,
            decrypted: false,
            timestamp: block.timestamp
        });

        auctionBids[auctionId].push(newBid);
        uint256 bidIndex = auctionBids[auctionId].length - 1;

        emit BidSubmitted(auctionId, msg.sender, bidIndex);

        return bidIndex;
    }

    function requestDecryption(
        uint256 auctionId,
        uint32 callbackGasLimit,
        TypesLib.Ciphertext calldata ciphertext
    ) external payable returns (uint256) {
        Auction storage auction = auctions[auctionId];
        require(auction.creator != address(0), "Auction does not exist");
        require(block.number > auction.biddingDeadline, "Bidding still open");
        require(!auction.decrypted, "Already decrypted");
        require(auctionBids[auctionId].length > 0, "No bids to decrypt");

        bytes memory condition = abi.encode(auction.revealBlock);

        (uint256 requestId, uint256 requestPrice) = _requestBlocklockPayInNative(
            callbackGasLimit,
            condition,
            ciphertext
        );

        require(msg.value >= requestPrice, "Insufficient payment for callback");

        requestIdToAuction[requestId] = auctionId;

        emit DecryptionRequested(auctionId, requestId);

        return requestId;
    }

    function _copyToMemory(TypesLib.Ciphertext storage ciphertext) 
        private 
        view 
        returns (TypesLib.Ciphertext memory) 
    {
        return TypesLib.Ciphertext({
            u: ciphertext.u,
            v: ciphertext.v,
            w: ciphertext.w
        });
    }

    function _onBlocklockReceived(
        uint256 requestId,
        bytes calldata decryptionKey
    ) internal override {
        uint256 auctionId = requestIdToAuction[requestId];
        Auction storage auction = auctions[auctionId];

        require(auction.creator != address(0), "Invalid auction");
        require(!auction.decrypted, "Already decrypted");

        EncryptedBid[] storage bids = auctionBids[auctionId];

        uint256 highestBid = 0;
        address highestBidder = address(0);

        for (uint256 i = 0; i < bids.length; i++) {
            TypesLib.Ciphertext memory ciphertext = _copyToMemory(bids[i].encryptedAmount);
            bytes memory decryptedData = _decrypt(ciphertext, decryptionKey);
            uint256 bidAmount = abi.decode(decryptedData, (uint256));

            bids[i].decryptedAmount = bidAmount;
            bids[i].decrypted = true;

            if (bidAmount >= auction.minBid && bidAmount > highestBid) {
                highestBid = bidAmount;
                highestBidder = bids[i].bidder;
            }
        }

        auction.decrypted = true;
        auction.winner = highestBidder;
        auction.winningBid = highestBid;

        emit BidsDecrypted(auctionId, highestBidder, highestBid);
    }

    function getAuction(uint256 auctionId) external view returns (Auction memory) {
        return auctions[auctionId];
    }

    function getBids(uint256 auctionId) external view returns (EncryptedBid[] memory) {
        return auctionBids[auctionId];
    }

    function getBidCount(uint256 auctionId) external view returns (uint256) {
        return auctionBids[auctionId].length;
    }

    function getWinner(uint256 auctionId) external view returns (address, uint256) {
        Auction memory auction = auctions[auctionId];
        require(auction.decrypted, "Auction not yet revealed");
        return (auction.winner, auction.winningBid);
    }
}
```

That's the complete contract. Clean, focused, and it does exactly what we need.
