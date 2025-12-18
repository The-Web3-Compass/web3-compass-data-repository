Before deployment, let's verify everything compiles correctly:

```bash
npx hardhat compile
```

You should see output like:

```bash
Compiled 1 Solidity file successfully (evm target: paris).
```

If you get errors about missing imports:

```bash
npm install randomness-solidity
```

If you see warnings about optimizer runs or Solidity version, those are usually safe to ignore. We're using modern Solidity (0.8.20) with the optimizer enabled, which is production-ready.

A clean compile means:

- All imports resolved
- Contract syntax is valid
- You're ready to deploy

---

## Deploying to Base Sepolia

Time to get this lottery on a real testnet.

We're deploying to **Base Sepolia** because it's supported by dcipher's randomness network and has fast block times for testing.

First, make sure your `.env` file has these values:

```bash
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your-private-key-without-0x
RANDOMNESS_SENDER_ADDRESS=0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779
```

The `RANDOMNESS_SENDER_ADDRESS` is dcipher's RandomnessSender contract on Base Sepolia. This is official and documented at [https://docs.dcipher.network/networks/randomness](https://docs.dcipher.network/networks/randomness).

Create `scripts/deploy.js`:

```jsx
const hre = require("hardhat");

async function main() {
  console.log("Deploying FairLottery...");
  
  *// Deployment parameters*
  const ticketPrice = hre.ethers.parseEther("0.01"); *// 0.01 ETH per ticket*
  const maxTickets = 100;
  
  *// dcipher RandomnessSender contract address for Base Sepolia*
  const randomnessSender = process.env.RANDOMNESS_SENDER_ADDRESS || "0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779";
  
  console.log("Parameters:");
  console.log("- Ticket Price:", hre.ethers.formatEther(ticketPrice), "ETH");
  console.log("- Max Tickets:", maxTickets);
  console.log("- RandomnessSender:", randomnessSender);
  
  const FairLottery = await hre.ethers.getContractFactory("FairLottery");
  const lottery = await FairLottery.deploy(
    ticketPrice,
    maxTickets,
    randomnessSender
  );
  
  await lottery.waitForDeployment();
  
  const address = await lottery.getAddress();
  console.log("\nFairLottery deployed to:", address);
  console.log("\nSave this address for the frontend!");
  
  *// Wait for block confirmations*
  console.log("\nWaiting for block confirmations...");
  await lottery.deploymentTransaction().wait(5);
  
  *// Verify on Etherscan (optional but recommended)*
  console.log("\nVerifying contract...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [ticketPrice, maxTickets, randomnessSender],
    });
    console.log("Contract verified on Etherscan");
  } catch (error) {
    console.log("Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Make sure you have testnet ETH in the account corresponding to your private key. You'll need about 0.01 ETH for deployment.

Deploy:

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

You should see output like:

```bash
Deploying FairLottery...
Parameters:
