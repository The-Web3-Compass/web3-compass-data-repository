# Deploying to Base Sepolia

Time to get this contract on a real testnet.

We'll deploy to **Base Sepolia**, which is supported by dcipher's blocklock network.

---

## Compiling the Contract

Before deployment, make sure everything compiles cleanly:

```bash
npx hardhat compile
```

If you get any errors about missing imports, make sure you installed `blocklock-solidity`:

```bash
npm install blocklock-solidity
```

A clean compile means the contract is valid, imports are resolved, and you're ready to deploy.

---

## Deployment Script

First, you need the BlocklockSender contract address for Base Sepolia. According to the dcipher docs, the BlocklockSender address for Base Sepolia is:

```
0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e
```

Create `scripts/deploy.js`:

```javascript
async function main() {
  const blocklockSenderAddress = "0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e";

  console.log("Deploying SealedBidAuction...");
  console.log("BlocklockSender:", blocklockSenderAddress);

  const SealedBidAuction = await hre.ethers.getContractFactory("SealedBidAuction");
  const auction = await SealedBidAuction.deploy(blocklockSenderAddress);

  await auction.waitForDeployment();

  const address = await auction.getAddress();
  console.log("SealedBidAuction deployed to:", address);
  console.log("\n✅ Deployment complete");
  console.log("Save this address for the next steps!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Make sure your `.env` file has your Base Sepolia credentials:

```
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your-private-key-without-0x-prefix
```

---

## Deploy to Base Sepolia

Run the deployment script:

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

You should see output like:

```
Deploying SealedBidAuction...
BlocklockSender: 0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e
SealedBidAuction deployed to: 0xYourContractAddress

✅ Deployment complete
Save this address for the next steps!
```

**Save that contract address.** You'll need it for every script from here on.

Your auction contract is now live on Base Sepolia, connected to the dcipher blocklock network.
