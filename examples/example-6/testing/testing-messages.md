# Testing Time-Locked Messages

Let's test the complete flow: create a message, wait for the reveal block, then decrypt.

## Create a Test Message

Create `scripts/createMessage.js`:

```javascript
const { Blocklock, encodeCiphertextToSolidity } = require("blocklock-js");
const { ethers } = require("ethers");

async function main() {
  const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";
  
  console.log("📝 Creating a time-locked message...\\n");

  const [sender] = await hre.ethers.getSigners();
  console.log("Sender:", sender.address);

  const contract = await hre.ethers.getContractAt("GiftMessage", CONTRACT_ADDRESS);

  // Get current block
  const currentBlock = await hre.ethers.provider.getBlockNumber();
  console.log("Current block:", currentBlock);

  // Set reveal block (100 blocks in the future = ~3 minutes on Base)
  const revealBlock = currentBlock + 100;
  console.log("Reveal block:", revealBlock);

  // The message to encrypt
  const messageText = "Hello from the past! 🎉";
  console.log("Message:", messageText);

  // Encrypt the message
  const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
  const blocklock = Blocklock.createFromChainId(provider, 84532); // Base Sepolia chain ID

  const encoded = ethers.AbiCoder.defaultAbiCoder().encode(["string"], [messageText]);
  const encrypted = blocklock.encrypt(ethers.getBytes(encoded), BigInt(revealBlock));

  const solidityCiphertext = encodeCiphertextToSolidity(encrypted);

  const formattedCiphertext = {
    u: {
      x: [BigInt(solidityCiphertext.u.x[0]), BigInt(solidityCiphertext.u.x[1])],
      y: [BigInt(solidityCiphertext.u.y[0]), BigInt(solidityCiphertext.u.y[1])],
    },
    v: solidityCiphertext.v,
    w: solidityCiphertext.w,
  };

  // Create message on-chain
  const recipient = sender.address; // Sending to yourself for testing
  
  console.log("\\nSending transaction...");
  const tx = await contract.createMessage(recipient, formattedCiphertext, revealBlock);
  
  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  
  console.log("\\n✅ Message created!");
  console.log("Block:", receipt.blockNumber);
  console.log("\\n⏳ Message will unlock at block:", revealBlock);
  console.log("💡 Wait ~3 minutes, then run the decrypt script");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run it:

```bash
npx hardhat run scripts/createMessage.js --network baseSepolia
```

---

## Check Message Status

Create `scripts/checkMessage.js`:

```javascript
async function main() {
  const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";
  const MESSAGE_ID = 0; // First message

  const contract = await hre.ethers.getContractAt("GiftMessage", CONTRACT_ADDRESS);

  const message = await contract.getMessage(MESSAGE_ID);
  const currentBlock = await hre.ethers.provider.getBlockNumber();

  console.log("\\n📬 Message Status\\n");
  console.log("From:", message.sender);
  console.log("To:", message.recipient);
  console.log("Reveal Block:", message.revealBlock.toString());
  console.log("Current Block:", currentBlock);
  console.log("Revealed:", message.revealed);

  if (message.revealed) {
    console.log("\\n🎉 Message:", message.decryptedMessage);
  } else {
    const blocksRemaining = Number(message.revealBlock) - currentBlock;
    console.log("\\n⏳ Blocks remaining:", blocksRemaining);
    console.log("💡 Estimated time:", Math.floor(blocksRemaining * 2 / 60), "minutes");
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

## Request Decryption

Once the reveal block is reached, create `scripts/decrypt.js`:

```javascript
async function main() {
  const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";
  const MESSAGE_ID = 0;

  console.log("🔓 Requesting decryption...\\n");

  const [user] = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt("GiftMessage", CONTRACT_ADDRESS);

  const message = await contract.getMessage(MESSAGE_ID);

  // Check if ready
  const canDecrypt = await contract.canDecrypt(MESSAGE_ID);
  if (!canDecrypt) {
    console.log("❌ Message not ready to decrypt yet");
    return;
  }

  // Request decryption
  const callbackGasLimit = 200000;
  const paymentAmount = hre.ethers.parseEther("0.001");

  console.log("Sending decryption request...");
  const tx = await contract.requestDecryption(
    MESSAGE_ID,
    callbackGasLimit,
    message.encryptedMessage,
    { value: paymentAmount }
  );

  console.log("Transaction hash:", tx.hash);
  await tx.wait();

  console.log("\\n✅ Decryption requested!");
  console.log("⏱️  Callback will arrive in 10-30 seconds");
  console.log("💡 Run checkMessage.js to see the decrypted message");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run it:

```bash
npx hardhat run scripts/decrypt.js --network baseSepolia
```

Wait 30 seconds, then check:

```bash
npx hardhat run scripts/checkMessage.js --network baseSepolia
```

You should see your decrypted message!

---

## Troubleshooting

**"Reveal block not reached yet"**
- Wait for more blocks to be mined
- Check current block vs reveal block

**"Insufficient payment for callback"**
- Increase payment amount to 0.002 ETH
- Check your wallet has enough ETH

**Callback takes longer than 30 seconds**
- Check BaseScan for the callback transaction
- Verify dcipher network status
- Wait up to 2 minutes for busy periods
