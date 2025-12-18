## Setting Up Your Development Environment

Let's get your environment configured so you can start building with dcipher's capabilities.

### Prerequisites

You'll need Node.js (v18 or higher) and a package manager like npm or yarn. You'll also need an Ethereum wallet with some testnet funds for interacting with contracts.

You can install Node.js and npm here: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Installing the SDKs

For **verifiable randomness**, install the randomness SDK:

```bash
npm install randomness-js
```

For **conditional encryption** (Blocklock), install:

```bash
npm install blocklock-js
```

For **cross-chain swaps** (onlyswaps), install:

```bash
npm install onlyswaps-js
```

Each SDK comes with TypeScript bindings and handles the interaction with dcipher's smart contracts automatically.

### Connecting to the Network

Here's a basic setup for interacting with dcipher's randomness capability:

```jsx
import { ethers } from "ethers";
import { RandomnessClient } from "randomness-js";

// Connect to an RPC provider (use testnet for development)
const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

// Initialize the randomness client
const randomnessClient = new RandomnessClient(
  wallet,
  "RANDOMNESS_CONTRACT_ADDRESS" // Provided in docs for each network
);

// Request randomness
const tx = await randomnessClient.requestRandomness();
await tx.wait();

// Listen for the randomness to be fulfilled
randomnessClient.on("RandomnessFulfilled", (requestId, randomValue) => {
  console.log(`Received random value: ${randomValue}`);
});
```

### Supported Networks

dcipher currently supports:

- Ethereum testnets (Sepolia, Holesky)
- Polygon mainnet and testnet
- Arbitrum
- Base
- Avalanche

Check the [official documentation](https://docs.dcipher.network/networks/) for the latest contract addresses and network configurations.

### Next Steps

The documentation includes full guides for:

- Building a lottery system with verifiable randomness
- Creating sealed-bid auctions with Blocklock
- Integrating only swaps for cross-chain token transfers
- Running your own node operator

Each capability has example code, deployment guides, and troubleshooting tips. The Randamu team maintains active Discord and Telegram channels for developer support.

---
