
## Setting Up Your Environment

If you've built Solidity projects before, this will be familiar. If not, we'll walk through everything you need.

You'll need:

- **Node.js (v18 or later)** → [https://nodejs.org](https://nodejs.org/)
- **npm** or **Yarn** for package management
- Basic Solidity knowledge (functions, mappings, inheritance)

We're using:

- **Hardhat** (version 2.22.x is current as of December 2024)
- **randomness-solidity** (dcipher's Solidity library for randomness)
- **dotenv** (for managing environment variables)

Let's set up a fresh project:

```bash
mkdir fair-lottery
cd fair-lottery
npm init -y
```

Install Hardhat:

```bash
npm install --save-dev hardhat
npx hardhat init
```

Choose **"Create a JavaScript project"** when prompted. Accept the defaults. Let it install the recommended dependencies.

Now install the dcipher randomness library:

```bash
npm install randomness-solidity dotenv
```

Here's what each does:

- **randomness-solidity**: The Solidity contracts you'll inherit from. Handles the dcipher protocol integration, signature verification, and callback routing.
- **dotenv**: For managing environment variables like RPC URLs and private keys without committing them to git.

Your `hardhat.config.js` should look like this:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
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

Create a `.env` file in your project root:

```bash
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your-private-key-here-without-0x-prefix
RANDOMNESS_SENDER_ADDRESS=0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779
```

**Never commit your `.env` file.** Add it to `.gitignore` immediately:

```bash
echo ".env" >> .gitignore
```

The `RANDOMNESS_SENDER_ADDRESS` is the dcipher RandomnessSender contract on Base Sepolia. This is the contract that processes randomness requests and delivers callbacks. You can find addresses for all supported networks in the dcipher documentation.

Get some Base Sepolia testnet ETH from faucets:

- [https://www.alchemy.com/faucets/base-sepolia](https://www.alchemy.com/faucets/base-sepolia)
- [https://faucet.quicknode.com/base/sepolia](https://faucet.quicknode.com/base/sepolia)

You'll need enough to:

- Deploy the contract (~0.005 ETH)
- Buy lottery tickets (whatever ticket price you set)
- Pay for randomness callbacks (~0.001 ETH per request)

Environment is ready. Let's write the lottery contract.

---
