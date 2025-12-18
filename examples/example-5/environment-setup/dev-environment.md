# Setting Up Your Development Environment

If you already went through Example 3 (the dice roller) and Example 4 (the lottery), you've got most of this. If not, here's the full setup.

## What You'll Need

- **Node.js (v18 or later)** → https://nodejs.org
- **npm** (comes with Node)
- **MetaMask or any EVM wallet** → https://metamask.io
- **Base Sepolia testnet ETH** (for gas)
- **A text editor** (VS Code, Cursor, whatever you like)

---

## Create a New Project

Start fresh so we don't have any conflicts with previous examples:

```bash
mkdir dcipher-random-nft
cd dcipher-random-nft
npm init -y
```

This creates a new Node.js project with a default `package.json`.

---

## Install Hardhat (Version 2.x)

We're using **Hardhat 2** because it's stable, well-documented, and just works:

```bash
npm install --save-dev hardhat@hh2
npx hardhat
```

When the setup wizard appears:
- Choose **"Create a JavaScript project"**
- Accept the default project root
- Say **yes** to adding a `.gitignore`
- Say **yes** to installing dependencies

This scaffolds a basic Hardhat project with sample contracts, tests, and scripts.

---

## Install Dependencies

Now we need the dcipher randomness SDK and OpenZeppelin contracts for ERC721:

```bash
npm install randomness-solidity @openzeppelin/contracts dotenv
```

Breaking that down:
- **`randomness-solidity`** → dcipher's randomness SDK (the `RandomnessReceiverBase` contract)
- **`@openzeppelin/contracts`** → battle-tested ERC721 implementation
- **`dotenv`** → for managing environment variables (RPC URLs, private keys)

---

## Configure Hardhat for Base Sepolia

Open `hardhat.config.js` and replace it with this:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.27",    
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

This configuration:
- Sets Solidity version to 0.8.27
- Enables the optimizer for gas efficiency
- Configures Base Sepolia network using environment variables

---

## Create Your `.env` File

Create a file called `.env` in your project root:

```bash
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key_here
```

### Get Your Private Key from MetaMask

1. Click the three dots next to your account
2. Account details → Show private key
3. Enter password → Copy
4. Paste into `.env`

### ⚠️ CRITICAL SECURITY WARNING

Add `.env` to your `.gitignore` **immediately**:

```bash
echo ".env" >> .gitignore
```

**Never, ever commit your private key to git.** Even on testnet. Just don't.

---

## Get Base Sepolia Testnet ETH

You'll need test ETH to deploy and interact with contracts.

**Recommended faucets:**
- https://faucet.quicknode.com/base/sepolia
- https://www.alchemy.com/faucets/base-sepolia

Request 0.5 ETH or more. You'll need it for:
- Contract deployment (~0.01 ETH)
- Multiple mint transactions (~0.001 ETH each)
- Randomness request payments (~0.001 ETH per request)

---

## Verify Your Setup

Let's make sure everything is working:

```bash
npx hardhat compile
```

You should see:

```
Compiled 1 Solidity file successfully
```

If you get errors, check:
- Node.js version (should be v18+)
- Hardhat installation
- Config file syntax

---

## Project Structure

Your project should now look like this:

```
dcipher-random-nft/
├── contracts/          # Solidity contracts go here
├── scripts/            # Deployment and interaction scripts
├── test/               # Contract tests (optional for this tutorial)
├── hardhat.config.js   # Hardhat configuration
├── package.json        # Node.js dependencies
├── .env                # Environment variables (DO NOT COMMIT)
└── .gitignore          # Git ignore file
```

Next, we'll create the NFT contract in the `contracts/` directory.
