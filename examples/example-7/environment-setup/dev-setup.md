# Setting Up Your Environment

If you followed the randomness example, you already have most of what you need. But let's make sure everything's ready.

You'll need:

- **Node.js (v18 or later)** → https://nodejs.org
- **npm** or **Yarn** for package management
- Basic Solidity knowledge

We're using:
- **Hardhat** (version 2.22.x is current as of December 2024)
- **blocklock-solidity** (dcipher's Solidity library)
- **blocklock-js** (for off-chain encryption)
- **dotenv** (for environment variables)

---

## Project Setup

Create a fresh project:

```bash
mkdir sealed-bid-auction
cd sealed-bid-auction
npm init -y
```

Install Hardhat:

```bash
npm install --save-dev hardhat@^2.22.0
npx hardhat init
```

Choose **"Create a JavaScript project"** when prompted. Accept defaults and let it install dependencies.

Now install the dcipher libraries:

```bash
npm install blocklock-solidity blocklock-js dotenv
```

Here's what each does:

- **blocklock-solidity**: The Solidity contracts you'll inherit from. Handles the protocol integration.
- **blocklock-js**: JavaScript library for off-chain encryption. You'll use this to encrypt bids before submitting them.
- **dotenv**: For managing environment variables (RPC URLs, private keys, etc.)

---

## Configuration

Your `hardhat.config.js` should look like this:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

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
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532
    }
  }
};
```

Create a `.env` file (and immediately add it to `.gitignore`):

```bash
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your-private-key-here-without-0x-prefix
```

**Never commit your `.env` file.** Add it to `.gitignore` right now:

```bash
echo ".env" >> .gitignore
```

---

## Get Testnet ETH

Get some Base Sepolia testnet ETH from faucets:
- https://www.alchemy.com/faucets/base-sepolia
- https://faucet.quicknode.com/base/sepolia

Your environment is ready. Time to write the auction contract.
