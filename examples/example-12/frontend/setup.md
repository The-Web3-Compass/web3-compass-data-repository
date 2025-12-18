## Getting Started (Yeah, The Setup Part)

Full code’s on GitHub. Grab it:

```bash
git clone https://github.com/The-Web3-Compass/dcipher-by-example
cd example-12/frontend
npm install
```

You’ll need to set up your environment variables. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your contract address:

```
VITE_MARKETPLACE_ADDRESS=0xYourDeployedContractAddress
```

This is the address you got when you deployed the contract in Part 1. The frontend needs this to know which contract to interact with.

### The ABI File (Don’t Skip This)

Okay, this trips up everyone. Pay attention.

When you deployed the contract in Part 1, Hardhat generated compilation artifacts. One of those artifacts is the ABI (Application Binary Interface). Think of it as the contract’s instruction manual. It tells your frontend what functions exist, what parameters they take, what they return.

Without the ABI, your frontend is blind. It can see the contract address, but it has no idea how to talk to it.

**Copy the ABI to the frontend:**

1. Navigate to `contract/artifacts/contracts/SealedBidMarketplace.sol/SealedBidMarketplace.json`
2. Copy the entire `abi` array from that file
3. Paste it into `frontend/src/contracts/abi.js`

Or just do this:

```bash
# From the project root
cd contract
npx hardhat compile
cd ..
cp contract/artifacts/contracts/SealedBidMarketplace.sol/SealedBidMarketplace.json frontend/src/contracts/abi.json
```

The frontend imports this ABI in `src/config/constants.js` and uses it for all contract interactions.

Without the ABI, the frontend can’t talk to the contract. With it, everything works.

### Run It

```bash
npm run dev
```

Frontend should be running on `http://localhost:5173`. Open it in your browser. Connect your wallet. You’re in.

---

