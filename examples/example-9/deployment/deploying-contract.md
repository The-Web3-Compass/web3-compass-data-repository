# Deploying to Base Sepolia

Now for the fun part: getting this contract onto a testnet and actually using it.

---

## The Deployment Script

Create a file: `scripts/deploy.js`

```javascript
// Router addresses for different networks
const ROUTER_ADDRESSES = {
  baseSepolia: "0xYouronly swapsRouterAddressOnBaseSepolia", // Base Sepolia Router address
  avalancheFuji: "0xYouronly swapsRouterAddressOnAvalancheFuji" // Avalanche Fuji Router address
};

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying CrossChainSwapper with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  
  // Get the network we're deploying to
  const networkName = hre.network.name;
  console.log("Deploying to network:", networkName);
  
  // Get the appropriate router address
  let routerAddress;
  if (networkName === "baseSepolia") {
    routerAddress = ROUTER_ADDRESSES.baseSepolia;
  } else if (networkName === "avalancheFuji") {
    routerAddress = ROUTER_ADDRESSES.avalancheFuji;
  } else {
    throw new Error(`No router address configured for network: ${networkName}`);
  }
  
  console.log("Using router address:", routerAddress);
  
  // Deploy the contract
  const CrossChainSwapper = await hre.ethers.getContractFactory("CrossChainSwapper");
  const swapper = await CrossChainSwapper.deploy(routerAddress);
  
  await swapper.waitForDeployment();
  
  const swapperAddress = await swapper.getAddress();
  console.log("CrossChainSwapper deployed to:", swapperAddress);  
  // Save the deployment info
  console.log("\\n---Deployment Complete---");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Note**: You'll need to get the actual Router addresses from the only swaps documentation. Check the [Supported Networks page](https://docs.dcipher.network/networks/onlyswaps) for current addresses.

---

## Deploy to Base Sepolia

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

**Save that contract address!** You'll need it for testing.
