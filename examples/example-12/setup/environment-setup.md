## Setting Up Your Development Environment

Standard Web3 development stack. If you’ve built smart contracts before, this will look familiar.

### Prerequisites

**Node.js v18+** and **npm v9+**:

```bash
node --version
npm --version
```

If you’re below that, grab the LTS version from [nodejs.org](https://nodejs.org/).

**Hardhat v2** for compilation and deployment. We’re using Hardhat 2 because it’s stable and the ecosystem is mature.

**Test Tokens**:
- **Base Sepolia ETH** for gas: [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
- **RUSD tokens** for bids/payments: [RUSD Faucet](https://faucet.dcipher.network/)

**A Wallet** with the private key exported. MetaMask, Rabby, whatever you use. You’ll need the private key for deployment.

**Code Editor** of your choice. VS Code, Cursor, Vim, whatever helps you focus.

That’s it. Nothing exotic.

---

## Initializing the Project

Create a new directory and set up Hardhat:

```bash
mkdir sealed-bid-marketplace
cd sealed-bid-marketplace
npm init -y
npm install --save-dev hardhat@hh2
npx hardhat init
```

Choose **“Create a JavaScript project”** and accept the defaults.

Your structure should look like:

```
sealed-bid-marketplace/
├── contracts/
├── scripts/
├── test/
├── hardhat.config.js
└── package.json
```

### Install Dependencies

Now grab the libraries we need:

```bash
npm install --save-dev blocklock-solidity onlyswaps-solidity @openzeppelin/contracts dotenv
```

What each does:

**blocklock-solidity** - dcipher’s time-locked encryption library. Gives us `AbstractBlocklockReceiver` for handling encrypted bids and automatic decryption callbacks.

**onlyswaps-solidity** - only swaps integration for cross-chain payments. Provides the `IRouter` interface.

**@openzeppelin/contracts** - Standard utilities. ERC20, ReentrancyGuard, all the battle-tested components everyone uses.

**dotenv** - Keeps your private keys out of your code. Always use this.

### Configure Hardhat

Replace `hardhat.config.js` with:

```jsx
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/**@type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532,
    },
  },
};
```

Key points:
- Solidity **0.8.28** for compatibility with dcipher libraries
- Optimizer enabled (good practice even on testnet)
- Base Sepolia configured as deployment target

### Environment Variables

Create `.env`:

```bash
touch .env
```

Add your private key **without the 0x prefix**:

```
PRIVATE_KEY=your_private_key_here_without_0x
```

**Security reminder**: Add `.env` to `.gitignore` immediately:

```bash
echo ".env" >> .gitignore
```

Bots scan GitHub for exposed keys. Don’t be that person.

### Verify Setup

Compile to make sure everything works:

```bash
npx hardhat compile
```

You should see: **“Compilation finished successfully”**

If you get errors, double-check your Solidity version and dependency versions.

