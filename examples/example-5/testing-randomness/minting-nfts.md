# Minting Your First Random NFT

Now for the moment of truth. Let's mint an NFT and watch its traits get assigned by threshold randomness.

## Create the Mint Script

Create `scripts/mint.js`:

```javascript
async function main() {
  // Replace with your deployed contract address
  const NFT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";
  
  console.log("🎨 Minting a Random Traits NFT...\\n");

  const [minter] = await hre.ethers.getSigners();
  console.log("Minting from:", minter.address);

  // Connect to the deployed contract
  const nft = await hre.ethers.getContractAt("RandomTraitsNFT", NFT_ADDRESS);

  // Check current supply
  const nextTokenId = await nft.nextTokenId();
  console.log("Next Token ID:", nextTokenId.toString());

  // Set callback gas limit (100k is usually enough for our simple callback)
  const callbackGasLimit = 100000;

  // Set payment for randomness request
  // Start with 0.001 ETH, increase if it reverts
  const paymentAmount = hre.ethers.parseEther("0.001");

  console.log("\\nSending mint transaction...");
  console.log("Callback Gas Limit:", callbackGasLimit);
  console.log("Payment Amount:", hre.ethers.formatEther(paymentAmount), "ETH");

  // Mint!
  const tx = await nft.mint(callbackGasLimit, { value: paymentAmount });
  
  console.log("\\n⏳ Transaction sent:", tx.hash);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();
  
  console.log("✅ Minted in block:", receipt.blockNumber);

  // Parse the NFTMinted event to get token ID and request ID
  const mintEvent = receipt.logs
    .map(log => {
      try {
        return nft.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find(event => event && event.name === "NFTMinted");

  if (mintEvent) {
    console.log("\\n🎉 NFT Minted!");
    console.log("Token ID:", mintEvent.args.tokenId.toString());
    console.log("Randomness Request ID:", mintEvent.args.requestId.toString());
    console.log("\\n⏱️  Traits will be revealed in 10-30 seconds...");
    console.log("💡 Run 'npx hardhat run scripts/checkTraits.js --network baseSepolia' to see traits");
  }

  console.log("\\n🔗 View transaction:");
  console.log(`   https://sepolia.basescan.org/tx/${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## Run the Mint Script

```bash
npx hardhat run scripts/mint.js --network baseSepolia
```

You should see:

```
🎨 Minting a Random Traits NFT...

Minting from: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Next Token ID: 0

Sending mint transaction...
Callback Gas Limit: 100000
Payment Amount: 0.001 ETH

⏳ Transaction sent: 0x7f3a...b2c4
Waiting for confirmation...
✅ Minted in block: 8234567

🎉 NFT Minted!
Token ID: 0
Randomness Request ID: 1234567890

⏱️  Traits will be revealed in 10-30 seconds...
💡 Run 'npx hardhat run scripts/checkTraits.js --network baseSepolia' to see traits

🔗 View transaction:
   https://sepolia.basescan.org/tx/0x7f3a...b2c4
```

---

## What Just Happened

1. You called `mint()` on your contract
2. Your contract minted you NFT #0
3. Your contract requested randomness from dcipher
4. The transaction completed immediately (the NFT is yours)
5. But the traits are still "Revealing…" because the callback hasn't happened yet

Right now, multiple dcipher operators are:
- Seeing your randomness request event
- Generating partial threshold signatures
- Aggregating them into one complete signature
- Preparing to call back into your contract

Give it 10-30 seconds, then check the traits.

---

## Checking Your NFT's Traits

Create `scripts/checkTraits.js`:

```javascript
async function main() {
  // Replace with your deployed contract address
  const NFT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";
  
  // Which token do you want to check?
  const tokenId = 0;

  console.log("🔍 Checking traits for Token ID:", tokenId, "\\n");

  const nft = await hre.ethers.getContractAt("RandomTraitsNFT", NFT_ADDRESS);

  // Check if traits are revealed
  const seed = await nft.tokenTraitSeed(tokenId);
  
  if (seed === "0x0000000000000000000000000000000000000000000000000000000000000000") {
    console.log("⏳ Traits not revealed yet...");
    console.log("💡 The dcipher network is still processing your randomness request.");
    console.log("💡 This usually takes 10-30 seconds. Try again in a moment!");
    return;
  }

  console.log("✅ Traits revealed!");
  console.log("🎲 Random Seed:", seed, "\\n");

  // Get the traits
  const traits = await nft.getTraits(tokenId);
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("     NFT #" + tokenId + " TRAITS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔷 Shape:", traits.shape);
  console.log("🎨 Color:", traits.color);
  console.log("📏 Size:", traits.size);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n");

  // Get the full metadata
  console.log("🖼️  Getting metadata...\\n");
  const tokenURI = await nft.tokenURI(tokenId);
  
  // The tokenURI is a data URI, decode it to see the JSON
  if (tokenURI.startsWith("data:application/json;base64,")) {
    const base64Data = tokenURI.replace("data:application/json;base64,", "");
    const jsonString = Buffer.from(base64Data, "base64").toString("utf8");
    const metadata = JSON.parse(jsonString);
    
    console.log("📋 Metadata:");
    console.log("   Name:", metadata.name);
    console.log("   Description:", metadata.description);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## Run It

Wait about 30 seconds after minting, then:

```bash
npx hardhat run scripts/checkTraits.js --network baseSepolia
```

If traits haven't been revealed yet:

```
🔍 Checking traits for Token ID: 0

⏳ Traits not revealed yet...
💡 The dcipher network is still processing your randomness request.
💡 This usually takes 10-30 seconds. Try again in a moment!
```

Wait a bit more, run again.

Once revealed:

```
🔍 Checking traits for Token ID: 0

✅ Traits revealed!
🎲 Random Seed: 0x7f3a2b8c9d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     NFT #0 TRAITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔷 Shape: Pentagon
🎨 Color: Cyan
📏 Size: Large
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🖼️  Getting metadata...

📋 Metadata:
   Name: Random Shape #0
   Description: An NFT with traits determined by dcipher threshold randomness
```

**There it is.** Your NFT's traits, determined by a threshold signature that nobody could predict or manipulate. Those traits are now immutably stored on the blockchain.

---

## Troubleshooting

### "Traits not revealed yet" after 60+ seconds

- Check BaseScan to see if the callback transaction landed
- Verify you paid enough for the randomness request (try 0.002 ETH)
- Check dcipher network status

### "Max supply reached"

- You've minted all 100 NFTs
- Deploy a new contract or increase `maxSupply`

### "Insufficient funds"

- Get more Base Sepolia ETH from a faucet
- Each mint costs ~0.001-0.002 ETH
