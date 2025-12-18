# Setting Up Your Development Environment

Before we build anything, we need to get your local setup in order.

A clean environment now saves you hours of debugging later when things mysteriously refuse to work.

The good news: this is all standard tooling. Nothing exotic. If you've built Solidity projects before (which you have by now), this should feel familiar.

---

## What You Actually Need (And Why)

### 1. Node.js and npm

As always, we are going to use Hardhat and Hardhat runs on Node, so this is non-negotiable.

Check what you already have:

```bash
node --version   # should be v18 or higher
npm --version    # should be v9 or higher
```

If you're below that, head to [**nodejs.org**](https://nodejs.org/en) and install the **LTS version**.

---

### 2. Hardhat v2

We're using **Hardhat v2**, intentionally.

It's stable, battle-tested, and the ecosystem around it is mature.

---

### 3. Funded Wallets (Read This Carefully)

You need **one wallet**, but you need it funded on **multiple chains**.

Here's the key thing people mess up:

- EVM chains derive addresses the same way
    
    → **Same private key = same address on every EVM chain**
    
- Gas is chain-specific
    
    → You must fund **each chain separately**
    

That means:

- Your address on **Base Sepolia** needs Base Sepolia ETH
- That *same address* on **Avalanche Fuji** needs AVAX

Same wallet. Different gas tokens.

### Test Tokens You'll Need

- **Base Sepolia ETH**
    
    Use the Base Sepolia Faucet
    
- **Avalanche Fuji AVAX**
    
    Use the Avalanche Fuji Faucet
    
- **RUSD (Test Token)**
    
    Get it from the RUSD Faucet
    

RUSD is only swaps' testnet token. You can think of it as **testnet USDT**.

You'll need RUSD on **Base Sepolia**, because that's the asset we'll actually be swapping.

No RUSD → no swap.

---

### 4. A Code Editor

VS Code. Cursor. Sublime. Vim. Emacs if you're brave.

It genuinely doesn't matter. Use whatever lets you focus on the code instead of fighting your editor.

---

## Initialize the Project

Spin up a fresh Hardhat project.

```bash
mkdir onlyswaps-example
cd onlyswaps-example
npm init -y
npm install --save-dev hardhat@hh2
npx hardhat init
```

When Hardhat prompts you, choose:

> Create a JavaScript project

You should end up with a structure that looks like this:

```
onlyswaps-example/
├── contracts/
├── test/
├── hardhat.config.js
└── package.json
```

Nothing fancy yet. This is exactly what we want.

---

## Install only swaps Dependencies

Next, we pull in the libraries we'll actually be using.

### only swaps Solidity Library and dotenv

```bash
npm install --save-dev onlyswaps-solidity dotenv
```

This gives you the contracts and interfaces needed to interact with the only swaps Router. You're not reimplementing the protocol—you're integrating with it.

Alongside that, we install `dotenv` to handle configuration safely. RPC URLs, private keys, and other environment-specific values—you know the drill.

### OpenZeppelin Contracts

```bash
npm install --save-dev @openzeppelin/contracts
```

We'll use OpenZeppelin for standard ERC-20 interfaces and safety. No reason to reinvent those wheels.

---

## Configure Hardhat for Multiple Chains

Now we tell Hardhat where it can deploy and interact.

Open `hardhat.config.js` and replace it with the following:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
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
    avalancheFuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 43113,
    },
  },
};
```

A few things to note here:

- We're explicitly setting Solidity to **0.8.28** for consistency
- The optimizer is enabled (good practice, even on testnet)
- Both networks use the **same private key**, because it's the same wallet

---

## Environment Variables (Do This Properly)

Create a `.env` file:

```bash
touch .env
```

Add your private key **without the `0x` prefix**:

```
PRIVATE_KEY=your_private_key_without_0x
```

### Critical Security Reminder

- One key works across Base and Avalanche
- You must fund **both chains separately**
- **Never commit `.env` files**

Add this immediately:

```bash
echo ".env" >> .gitignore
```

Bots actively scan GitHub for exposed private keys.

They don't care if it's testnet. They'll still drain wallets automatically.

Install dotenv if it's not already there:

```bash
npm install --save-dev dotenv
```

Then add this to the top of your `hardhat.config.js`:

```javascript
require("dotenv").config();
```

### Verify Your Setup

Make sure everything works:

```bash
npx hardhat compile
```

You should see: **"Compilation finished successfully"**

If you get errors, double-check your Hardhat and Solidity versions. The config above uses Solidity 0.8.28, which is compatible with the only swaps contracts.
