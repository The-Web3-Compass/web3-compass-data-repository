# Deploying Your NFT Contract to Base Sepolia

Time to deploy this contract to a real network. We're using **Base Sepolia** because it's fast, reliable, and dcipher has infrastructure running there.

## Before You Deploy: Get the RandomnessSender Address

Your contract needs to know where dcipher's `RandomnessSender` contract lives on Base Sepolia. This is the entry point your contract calls to request randomness.

According to dcipher's documentation (https://docs.dcipher.network/networks/randomness), the RandomnessSender address for Base Sepolia is:

```
0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779
```

**Important:** Always check the official docs for the most current address. Contract addresses can change between testnet versions.

---

## Create the Deployment Script

Create `scripts/deploy.js`:

```javascript
async function main() {
  console.log("🚀 Deploying RandomTraitsNFT to Base Sepolia...\\n");

  // CRITICAL: Replace with current RandomnessSender address from dcipher docs
  const RANDOMNESS_SENDER = "0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779";

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\\n");

  // Deploy the contract
  const RandomTraitsNFT = await hre.ethers.getContractFactory("RandomTraitsNFT");
  
  console.log("Deploying contract...");
  const nft = await RandomTraitsNFT.deploy(RANDOMNESS_SENDER, deployer.address);

  await nft.waitForDeployment();
  
  const contractAddress = await nft.getAddress();

  console.log("\\n✅ RandomTraitsNFT deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

This script:
1. Connects to your wallet (the first signer in `hardhat.config.js`)
2. Shows your balance to confirm you have test ETH
3. Deploys `RandomTraitsNFT` with the RandomnessSender address and your address as owner
4. Waits for confirmation
5. Prints the deployed contract address

---

## Make Sure Your .env Is Set Up

Double-check your `.env` file has:

```bash
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_actual_private_key_from_metamask
```

Make sure the private key has Base Sepolia ETH. If not, hit a faucet:
- https://faucet.quicknode.com/base/sepolia
- https://www.alchemy.com/faucets/base-sepolia

---

## Compile Your Contract

Always compile before deploying to catch any syntax errors:

```bash
npx hardhat compile
```

You should see:

```
Compiled 15 Solidity files successfully
```

If you get errors, read them carefully. Usually it's a missing import or typo.

---

## Deploy

Ready? Let's do this:

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

You should see output like:

```
🚀 Deploying RandomTraitsNFT to Base Sepolia...

Deploying from: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Account balance: 0.489234 ETH

Deploying contract...

✅ RandomTraitsNFT deployed to: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
```

**Save that contract address.** You'll need it for every script from here on.

---

## Verify on BaseScan (Optional)

If you want to verify your contract on BaseScan for transparency:

```bash
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS "0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779" "YOUR_WALLET_ADDRESS"
```

This makes the source code publicly viewable and proves your contract does what you say it does.

---

Your NFT contract is now live on Base Sepolia testnet, connected to dcipher's randomness network. Time to mint something.
