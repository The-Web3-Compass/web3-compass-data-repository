## Deploying to Base Sepolia (Making It Real)

Time to put this contract on a real testnet. We’ll deploy to Base Sepolia, which is fast, stable, and supported by dcipher.

Create `scripts/deploy.js`:

```jsx
const hre = require("hardhat");

// Base Sepolia addresses
const NETWORK_CONFIG = {
  baseSepolia: {
    randomnessSender: "0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779",
    router: "0x16323707e61d20A39AaE5ab64808e480B91658aB",
    rusdToken: "0x9Eb392A6286138E5d59a40Da5398e567Ab3AAd7c",
  },
};

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const networkName = hre.network.name;

  console.log("\n=== Deploying CrossChainLottery ===");
  console.log("Network:", networkName);
  console.log("Deployer:", deployer.address);
  console.log(
    "Balance:",
    hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)),
    "ETH"
  );

  const config = NETWORK_CONFIG[networkName];
  if (!config) {
    throw new Error(`No configuration found for network:${networkName}`);
  }

  console.log("\nUsing addresses:");
  console.log("- RandomnessSender:", config.randomnessSender);
  console.log("- OnlySwaps Router:", config.router);
  console.log("- RUSD Token:", config.rusdToken);

  // Entry fee: 1 RUSD (6 decimals)
  const entryFee = hre.ethers.parseUnits("1", 6);

  console.log("\nDeploying contract...");
  const CrossChainLottery = await hre.ethers.getContractFactory("CrossChainLottery");
  const lottery = await CrossChainLottery.deploy(
    config.randomnessSender,
    deployer.address, // owner
    config.router,
    config.rusdToken,
    entryFee
  );

  await lottery.waitForDeployment();
  const lotteryAddress = await lottery.getAddress();

  console.log("\n✅ CrossChainLottery deployed to:", lotteryAddress);

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: networkName,
    contractAddress: lotteryAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    config: config,
    entryFee: entryFee.toString(),
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    `${deploymentsDir}/${networkName}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📝 Deployment info saved to:", `${deploymentsDir}/${networkName}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

What this script does:

We hardcode the dcipher contract addresses for Base Sepolia. These are the official deployments. You can verify them in the [dcipher docs](https://docs.dcipher.network/) if you’re paranoid (you should be).

We get a contract factory, deploy with the right constructor arguments, wait for confirmation.

We save the deployed address and config to a JSON file in `deployments/`. Makes it easy to reference when we build the frontend later.

### Run the Deployment

Make sure you have Base Sepolia ETH in your wallet, then run:

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

You should see output like:

```
=== Deploying CrossChainLottery ===
Network: baseSepolia
Deployer: 0xYourAddress
Balance: 0.1 ETH

Using addresses:
- RandomnessSender: 0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779
- OnlySwaps Router: 0x16323707e61d20A39AaE5ab64808e480B91658aB
- RUSD Token: 0x9Eb392A6286138E5d59a40Da5398e567Ab3AAd7c

Deploying contract...

✅ CrossChainLottery deployed to: 0xYourContractAddress

📝 Deployment info saved to: ./deployments/baseSepolia.json
```

Your contract is now live on Base Sepolia. Save that address. You’ll need it.

---
