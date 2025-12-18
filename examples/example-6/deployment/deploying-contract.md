# Deploying to Base Sepolia

Time to deploy this contract to a real network.

## Get the BlocklockSender Address

Your contract needs to know where dcipher's `BlocklockSender` contract lives on Base Sepolia.

According to dcipher's documentation, the BlocklockSender address for Base Sepolia is:

```
0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e
```

**Important:** Always check the official docs for the most current address.

---

## Create the Deployment Script

Create `scripts/deploy.js`:

```javascript
async function main() {
  console.log("🚀 Deploying GiftMessage to Base Sepolia...\\n");

  const BLOCKLOCK_SENDER = "0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e";

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\\n");

  const GiftMessage = await hre.ethers.getContractFactory("GiftMessage");
  
  console.log("Deploying contract...");
  const contract = await GiftMessage.deploy(BLOCKLOCK_SENDER);

  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();

  console.log("\\n✅ GiftMessage deployed to:", contractAddress);
  console.log("\\n💡 Save this address for your frontend config!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## Verify Your .env

Double-check your `.env` file:

```bash
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_actual_private_key_from_metamask
```

Make sure the private key has Base Sepolia ETH. If not, hit a faucet:
- https://faucet.quicknode.com/base/sepolia
- https://www.alchemy.com/faucets/base-sepolia

---

## Compile

Always compile before deploying:

```bash
npx hardhat compile
```

Should see: `Compiled X Solidity files successfully`

---

## Deploy

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

Expected output:

```
🚀 Deploying GiftMessage to Base Sepolia...

Deploying from: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Account balance: 0.489234 ETH

Deploying contract...

✅ GiftMessage deployed to: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318

💡 Save this address for your frontend config!
```

**Save that contract address.** You'll need it for every frontend interaction.

---

## Verify on BaseScan (Optional)

To verify your contract on BaseScan:

```bash
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS "0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e"
```

This makes the source code publicly viewable and proves your contract does what you say it does.

---

Your time-locked message contract is now live on Base Sepolia testnet!
