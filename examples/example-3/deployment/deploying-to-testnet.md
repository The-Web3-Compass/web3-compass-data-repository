## Deploying Your Contract (Making It Real)

Time to put this thing on a real testnet. We'll deploy to **Base Sepolia**, which is a fast, stable testnet supported by dcipher.

### Before you deploy, you'll need:

### **1. MetaMask (or any EVM wallet)**

If you don't already have it:

[https://metamask.io/download/](https://metamask.io/download/)

### **2. Add Base Sepolia to MetaMask**

You can add it automatically via Chainlist:

[https://chainlist.org/chain/84532](https://chainlist.org/chain/84532)

Or manually:

- **Network Name:** Base Sepolia
- **RPC URL:** https://sepolia.base.org
- **Chain ID:** 84532
- **Currency:** ETH
- **Block Explorer:** [https://sepolia.basescan.org](https://sepolia.basescan.org/)

### **3. A Base Sepolia RPC URL (for Hardhat)**

This is what Hardhat uses to broadcast transactions.

You can grab one from any provider:

- **Alchemy:** [https://www.alchemy.com/faucets/base-sepolia](https://www.alchemy.com/faucets/base-sepolia)
- **QuickNode:** [https://www.quicknode.com](https://www.quicknode.com/)
- **Public RPC (not always reliable):** `https://sepolia.base.org`

### **4. Get Base Sepolia ETH (for gas)**

You'll need a bit of test ETH to deploy and interact with your contract.

Recommended faucets:

- [https://faucet.quicknode.com/base/sepolia](https://faucet.quicknode.com/base/sepolia)
- [https://www.alchemy.com/faucets/base-sepolia](https://www.alchemy.com/faucets/base-sepolia)

Once MetaMask has Base Sepolia ETH, you're ready.

### The deploy script … and what it does (short)

Now create a new folder called `/scripts`  and within it, create `deploy.js`

This is our deployment script and it:

- Gets a contract factory for `DiceRoller`.
- Reads the dcipher `RandomnessSender` address (you must set this for Base Sepolia).
- Uses the first signer (your deployer account) to deploy `DiceRoller(randomnessSender, owner)`.
- Waits for deployment and prints the deployed address and some quick sanity checks (rollCount, latestRequestId).

So in short: compile → deploy → print useful info.

Here's the script

```tsx

async function main() {
  const DiceRollerFactory = await ethers.getContractFactory("DiceRoller");

  // Replace with the RandomnessSender address for Base Sepolia from dcipher docs
  const randomnessSenderAddress = "0x_YOUR_RANDOMNESS_SENDER_ON_BASE_SEPOLIA";

  const [deployer] = await ethers.getSigners();
  const ownerAddress = deployer.address;

  console.log("Deploying DiceRoller...");
  console.log("Deployer:", deployer.address);
  console.log("RandomnessSender:", randomnessSenderAddress);

  const diceRoller = await DiceRollerFactory.deploy(
    randomnessSenderAddress,
    ownerAddress
  );

  await diceRoller.waitForDeployment();

  console.log("DiceRoller deployed to:", await diceRoller.getAddress());
  console.log("Roll count:", await diceRoller.rollCount());
  console.log("Latest request ID:", await diceRoller.latestRequestId());

  console.log("✅ Deployment complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

```

Before running this script, you need to set one important value: the **RandomnessSender** address for the network you're deploying to. 

Each chain has its own deployed instance, and dcipher maintains an up-to-date list here:

👉 [https://docs.dcipher.network/networks/randomness](https://docs.dcipher.network/networks/randomness)

Since we're using **Base Sepolia**, grab the RandomnessSender address for base sfrom that page and replace the placeholder in the deploy script. Your contract won't work without the correct address — this is the on-chain entry point the dcipher network uses to receive your randomness requests.

The second thing you need is a working Hardhat network configuration for Base Sepolia:

a valid **RPC URL** and a **private key** loaded with Base Sepolia test ETH. Once those are in your `.env`, Hardhat can actually broadcast the deployment transaction.

### Hardhat config (Base Sepolia)

Add a `baseSepolia` network to your Hardhat config. This example uses environment variables for the RPC and the private key.

```tsx
require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL,
      accounts: [process.env.BASE_SEPOLIA_PRIVATE_KEY]
    }
  }
};
```

Create `.env`:

```
BASE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
BASE_SEPOLIA_PRIVATE_KEY=your-private-key-here
```

Never commit `.env` to git. Add it to `.gitignore` immediately.

Deploy to Sepolia:

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

Your contract is now live on a testnet with real dcipher infrastructure running. 
Make sure you save your contract address

---
