## Setting Up Your Environment (The Boring But Necessary Part)

Before we write any Solidity, we need to get the tooling sorted. If you’ve been following along with the other examples, this will look familiar. If not, don’t stress, we’ll cover everything.

### What You Need

**Node.js and npm** – Hardhat runs on Node, so this is non-negotiable. Check what you have:

```bash
node --version   # should be v18 or later
npm --version    # should be v9 or later
```

If you’re below that, head to [nodejs.org](https://nodejs.org/) and grab the LTS version.

**Hardhat v2** – We’re using Hardhat 2 because it’s stable, battle-tested, and the ecosystem is mature. Hardhat 3 exists, but for this example, we’re sticking with what works.

**Test Tokens** – You’ll need a few things to actually deploy and interact with the contract:

- **Base Sepolia ETH** for gas. Get it from the [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia).
- **RUSD tokens** for lottery entries. This is dcipher’s testnet token. Grab some from the [RUSD Faucet](https://faucet.dcipher.network/).

**A Wallet** – MetaMask, Rabby, whatever you prefer. You’ll need the private key for deployment. Standard EVM wallet stuff.

**A Code Editor** – VS Code, Cursor, Vim, Emacs, whatever lets you focus on code instead of fighting your tools.

That’s it. Nothing exotic. Standard Web3 development stack.

---

## Initializing the Project

Let’s spin up a fresh Hardhat project and install the dependencies we’ll need.

Create a new directory and initialize:

```bash
mkdir cross-chain-lottery
cd cross-chain-lottery
npm init -y
```

Install Hardhat v2:

```bash
npm install --save-dev hardhat@hh2
npx hardhat init
```

When Hardhat prompts you, choose **“Create a JavaScript project”** and accept the defaults.

You should end up with a structure like this:

```
cross-chain-lottery/
├── contracts/
├── scripts/
├── test/
├── hardhat.config.js
└── package.json
```

Nothing fancy. Just the basics.

### Install Dependencies

Now let’s grab the libraries we actually need.

```bash
npm install --save-dev randomness-solidity onlyswaps-solidity @openzeppelin/contracts dotenv
```

What each of these does:

**randomness-solidity** is dcipher’s randomness library. Gives us `RandomnessReceiverBase`, which handles all the request-and-receive randomness infrastructure.

**onlyswaps-solidity** is the OnlySwaps integration. We get the `IRouter` interface for cross-chain swaps.

**@openzeppelin/contracts** has the standard stuff. ERC20, ReentrancyGuard, all the utilities everyone uses. No point reinventing these.

**dotenv** keeps your private keys and RPC URLs out of your code. Use it.

### Configure Hardhat

Open `hardhat.config.js` and replace it with this:

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

A few things to note:

- We’re using Solidity **0.8.28** for consistency with the dcipher libraries.
- The optimizer is enabled. Good practice, even on testnet.
- We’re configuring Base Sepolia as our deployment target.

### Environment Variables

Create a `.env` file:

```bash
touch .env
```

Add your private key **without the `0x` prefix**:

```
PRIVATE_KEY=your_private_key_without_0x
```

**Critical security reminder**: Never commit `.env` files. Add this immediately:

```bash
echo ".env" >> .gitignore
```

Bots actively scan GitHub for exposed private keys. They don’t care if it’s testnet. Don’t be that person.

### Verify Your Setup

Let’s make sure everything compiles:

```bash
npx hardhat compile
```

You should see: **“Compilation finished successfully”**

If you get errors, double-check your Hardhat and Solidity versions. The config above uses Solidity 0.8.28, which is compatible with the dcipher contracts.

---
