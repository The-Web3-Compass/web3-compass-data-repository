# Setting Up Your Development Environment

You'll need:
- **Node.js (v18 or later)** → https://nodejs.org
- **npm** (comes with Node)
- **Hardhat** for Solidity development
- **MetaMask or any EVM wallet** → https://metamask.io
- **Base Sepolia testnet ETH** (for gas)

---

## Create a New Project

```bash
mkdir dcipher-timelock-messages
cd dcipher-timelock-messages
npm init -y
```

---

## Install Hardhat

```bash
npm install --save-dev hardhat@hh2
npx hardhat
```

When the setup wizard appears:
- Choose **"Create a JavaScript project"**
- Accept defaults
- Say **yes** to `.gitignore`
- Say **yes** to installing dependencies

---

## Install Dependencies

```bash
npm install blocklock-solidity blocklock-js dotenv ethers
```

Breaking that down:
- **`blocklock-solidity`** → dcipher's blocklock SDK (contracts you'll inherit from)
- **`blocklock-js`** → frontend encryption library
- **`dotenv`** → environment variable management
- **`ethers`** → Ethereum library

---

## Configure Hardhat for Base Sepolia

Open `hardhat.config.js`:

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
      url: process.env.BASE_SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
```

---

## Create `.env` File

```bash
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key_here
```

**Get your private key from MetaMask:**
1. Click three dots → Account details
2. Show private key → Enter password
3. Copy and paste into `.env`

**⚠️ CRITICAL:** Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

Never commit your private key to git.

---

## Get Base Sepolia Testnet ETH

Faucets:
- https://faucet.quicknode.com/base/sepolia
- https://www.alchemy.com/faucets/base-sepolia

Request 0.5 ETH or more for:
- Contract deployment (~0.01 ETH)
- Message creation (~0.001 ETH each)
- Decryption requests (~0.001 ETH each)

---

## Verify Setup

```bash
npx hardhat compile
```

Should see: `Compiled 1 Solidity file successfully`

Your environment is ready!
