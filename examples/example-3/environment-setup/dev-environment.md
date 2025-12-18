## Setting Up Your Dev Environment (The Boring But Necessary Part)

Before we write any Solidity, let's get the tooling in place.

You'll need:

- **Node.js (v18 or later)** → [https://nodejs.org](https://nodejs.org/)
- **npm** (comes with Node) *or* **Yarn** → [https://yarnpkg.com](https://yarnpkg.com/)
- A basic understanding of smart contracts (even if you've only written a "Hello World," you're fine)

If you've built Solidity projects before, you're already set.

If not, don't worry, you'll follow this step-by-step without hitting any walls.

We'll be using:

- **Hardhat** → [https://hardhat.org](https://hardhat.org/)
- The **dcipher randomness Solidity library** (installed via npm)

Everything else, config… deployment scripts, contract inheritance….will be covered as we go.

Alright, now that the environment is ready, let's set up the project.

Start by creating a new directory and initializing a fresh Node project:

```bash
mkdir dcipher-randomness-demo
cd dcipher-randomness-demo
npm init -y
```

We're using **Hardhat** because it's the standard toolkit for Ethereum development.

As of December 2024, Hardhat 3 is the current version:

```bash
npm install --save-dev hardhat@hh2
npx hardhat init
```

When the setup wizard appears, choose:

**"Create a JavaScript project."**

Accept the defaults, say yes to installing dependencies, and let Hardhat scaffold the project for you.

Once everything is set, you will see a `hardhat.config.js` file in your new project folder and it should look something like this (else just copy-paste this):

```tsx
require("@nomicfoundation/hardhat-toolbox");

const config = {
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
    }
  }
};

export default config;

```

We're using Solidity 0.8.28 .

Now let's install the dcipher randomness library.

This is the piece that connects your contract to the threshold randomness network:

```bash
npm install randomness-solidity dotenv
```

The `randomness-solidity` package includes **`RandomnessReceiverBase.sol`**, the abstract contract your consumer contract will inherit from. This base contract handles all the infrastructure work for you: formatting randomness requests, accepting callbacks, validating threshold signatures, and passing the final random value into your contract.

All you need to implement is *what your contract does once randomness arrives*.

You'll notice we're installing `dotenv` as well.

You see, Hardhat doesn't read environment variables by default, so if you ever decide to keep non-sensitive config values in a `.env` file( which we will) , you'll want `dotenv` available.

That's it for setup. 

Time to write the actual contract.

---
