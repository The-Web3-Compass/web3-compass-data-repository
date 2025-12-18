# Testing the Sealed-Bid Auction

Now that the contract is deployed, let's walk through the complete auction lifecycle with actual scripts.

---

## Creating an Auction

Create `scripts/createAuction.js`:

```javascript
async function main() {
  const auctionAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  
  const auction = await hre.ethers.getContractAt("SealedBidAuction", auctionAddress);

  const description = "Rare Digital Collectible";
  const minBid = hre.ethers.parseEther("0.001"); // 0.001 ETH minimum
  const blocksUntilReveal = 50; // Reveal in 50 blocks (~10 minutes on Base)
  const biddingDuration = 30; // Accept bids for 30 blocks (~6 minutes)

  console.log("Creating auction...");
  console.log("Description:", description);
  console.log("Min bid:", hre.ethers.formatEther(minBid), "ETH");
  console.log("Bidding window:", biddingDuration, "blocks");
  console.log("Reveal block: current +", blocksUntilReveal);

  const tx = await auction.createAuction(
    description,
    minBid,
    blocksUntilReveal,
    biddingDuration
  );

  console.log("\nTransaction hash:", tx.hash);
  const receipt = await tx.wait();
  
  // Find AuctionCreated event
  const event = receipt.logs.find(log => {
    try {
      const parsed = auction.interface.parseLog(log);
      return parsed.name === "AuctionCreated";
    } catch {
      return false;
    }
  });

  if (event) {
    const parsed = auction.interface.parseLog(event);
    const auctionId = parsed.args.auctionId;
    const revealBlock = parsed.args.revealBlock;
    const biddingDeadline = parsed.args.biddingDeadline;

    console.log("\n✅ Auction created!");
    console.log("Auction ID:", auctionId.toString());
    console.log("Bidding closes at block:", biddingDeadline.toString());
    console.log("Reveals at block:", revealBlock.toString());
    console.log("\nBidders should encrypt their bids for block:", revealBlock.toString());
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Run it:

```bash
npx hardhat run scripts/createAuction.js --network baseSepolia
```

You'll get an auction ID (probably 0 for your first auction) and two important block numbers: when bidding closes and when bids reveal.

---

## Encrypting and Submitting a Bid

Create `scripts/submitBid.js`:

```javascript
const { Blocklock } = require("blocklock-js");
const { encodeParams, encodeCiphertextToSolidity } = require("blocklock-js");

async function main() {
  const auctionAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  const auctionId = 0; // The auction ID from previous step
  const bidAmountETH = "0.0025"; // Your bid: 0.0025 ETH
  
  const auction = await hre.ethers.getContractAt("SealedBidAuction", auctionAddress);
  const [signer] = await hre.ethers.getSigners();

  // Get auction details
  const auctionData = await auction.getAuction(auctionId);
  const revealBlock = auctionData.revealBlock;

  console.log("Submitting bid to auction:", auctionId.toString());
  console.log("Your bid:", bidAmountETH, "ETH");
  console.log("Reveal block:", revealBlock.toString());
  console.log("Current block:", await hre.ethers.provider.getBlockNumber());

  // Encode the bid amount
  const bidAmount = hre.ethers.parseEther(bidAmountETH);
  const encodedBid = encodeParams(["uint256"], [bidAmount]);
  const bidBytes = hre.ethers.getBytes(encodedBid);

  // Encrypt the bid using blocklock-js
  console.log("\nEncrypting bid...");
  const blocklockjs = Blocklock.createBaseSepolia(signer);
  const encryptedBid = blocklockjs.encrypt(bidBytes, revealBlock);

  // Convert to Solidity format
  const solidityEncrypted = encodeCiphertextToSolidity(encryptedBid);

  // Submit the encrypted bid
  console.log("Submitting encrypted bid to contract...");
  const tx = await auction.submitBid(auctionId, solidityEncrypted);

  console.log("Transaction hash:", tx.hash);
  await tx.wait();

  console.log("\n✅ Bid submitted!");
  console.log("Your bid is now encrypted on-chain.");
  console.log("Nobody can see the amount until block:", revealBlock.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Update the `auctionAddress`, `auctionId`, and `bidAmountETH` values, then run:

```bash
npx hardhat run scripts/submitBid.js --network baseSepolia
```

Your bid is now on-chain. Encrypted. Unreadable. Waiting for the reveal block.

You can run this script multiple times with different bid amounts to simulate multiple bidders.

---

## Requesting Decryption

After the bidding deadline passes, anyone can trigger the decryption process.

Create `scripts/requestDecryption.js`:

```javascript
async function main() {
  const auctionAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  const auctionId = 0;
  
  const auction = await hre.ethers.getContractAt("SealedBidAuction", auctionAddress);

  // Get auction details
  const auctionData = await auction.getAuction(auctionId);
  const currentBlock = await hre.ethers.provider.getBlockNumber();

  console.log("Auction ID:", auctionId.toString());
  console.log("Current block:", currentBlock);
  console.log("Bidding deadline:", auctionData.biddingDeadline.toString());
  console.log("Reveal block:", auctionData.revealBlock.toString());

  if (currentBlock <= auctionData.biddingDeadline) {
    console.log("\n❌ Bidding period is still open!");
    console.log("Wait until block:", auctionData.biddingDeadline.toString());
    return;
  }

  if (auctionData.decrypted) {
    console.log("\n✅ Auction already decrypted!");
    console.log("Winner:", auctionData.winner);
    console.log("Winning bid:", hre.ethers.formatEther(auctionData.winningBid), "ETH");
    return;
  }

  const bidCount = await auction.getBidCount(auctionId);
  console.log("Number of bids:", bidCount.toString());

  if (bidCount === 0n) {
    console.log("\n❌ No bids to decrypt!");
    return;
  }

  // Set callback gas limit (500k is usually enough for a few bids)
  const callbackGasLimit = 500000;

  // Get a sample ciphertext from the first bid
  const bids = await auction.getBids(auctionId);
  const sampleCiphertext = bids[0].encryptedAmount;

  console.log("\nRequesting decryption...");
  console.log("Callback gas limit:", callbackGasLimit);

  // Estimate the cost
  const tx = await auction.requestDecryption(
    auctionId,
    callbackGasLimit,
    sampleCiphertext,
    { value: hre.ethers.parseEther("0.003") } // Usually enough for callback
  );

  console.log("Transaction hash:", tx.hash);
  await tx.wait();

  console.log("\n✅ Decryption requested!");
  console.log("The dcipher network will deliver the decryption key when block", 
              auctionData.revealBlock.toString(), "is reached.");
  console.log("\nThis typically takes 10-30 seconds after the reveal block.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Wait until the bidding deadline has passed, then run:

```bash
npx hardhat run scripts/requestDecryption.js --network baseSepolia
```

---

## Checking the Results

Create `scripts/checkWinner.js`:

```javascript
async function main() {
  const auctionAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  const auctionId = 0;
  
  const auction = await hre.ethers.getContractAt("SealedBidAuction", auctionAddress);

  const auctionData = await auction.getAuction(auctionId);
  const currentBlock = await hre.ethers.provider.getBlockNumber();

  console.log("Auction ID:", auctionId.toString());
  console.log("Current block:", currentBlock);
  console.log("Reveal block:", auctionData.revealBlock.toString());
  console.log("Decrypted:", auctionData.decrypted);

  if (!auctionData.decrypted) {
    console.log("\n⏳ Auction not yet decrypted.");
    
    if (currentBlock < auctionData.revealBlock) {
      console.log("Reveal block not reached yet.");
      console.log("Blocks remaining:", (auctionData.revealBlock - BigInt(currentBlock)).toString());
    } else {
      console.log("Reveal block reached. Waiting for dcipher callback...");
      console.log("This usually takes 10-30 seconds.");
    }
    return;
  }

  console.log("\n✅ Auction Results:");
  console.log("Winner:", auctionData.winner);
  console.log("Winning bid:", hre.ethers.formatEther(auctionData.winningBid), "ETH");

  // Show all bids
  const bids = await auction.getBids(auctionId);
  console.log("\nAll Bids:");
  
  for (let i = 0; i < bids.length; i++) {
    const bid = bids[i];
    console.log(`\nBid ${i}:`);
    console.log("  Bidder:", bid.bidder);
    console.log("  Amount:", hre.ethers.formatEther(bid.decryptedAmount), "ETH");
    console.log("  Timestamp:", new Date(Number(bid.timestamp) * 1000).toISOString());
    
    if (bid.bidder.toLowerCase() === auctionData.winner.toLowerCase()) {
      console.log("  🏆 WINNER!");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Run this after the reveal block:

```bash
npx hardhat run scripts/checkWinner.js --network baseSepolia
```

If decryption has completed, you'll see the winner and all decrypted bid amounts.
