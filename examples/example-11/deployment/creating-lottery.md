## Creating Your First Lottery (The Moment of Truth)

Now that the contract is deployed, let’s create a lottery. We’ve got a script for this in `scripts/createLottery.js`.

Create the file:

```jsx
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const networkName = hre.network.name;
  const [signer] = await hre.ethers.getSigners();

  console.log("\n=== Creating New Lottery ===");
  console.log("Network:", networkName);
  console.log("Signer:", signer.address);

  // Load deployment info
  const deploymentPath = `./deployments/${networkName}.json`;
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`No deployment found for${networkName}. Please deploy first.`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const lotteryAddress = deployment.contractAddress;

  console.log("Lottery Contract:", lotteryAddress);

  // Get contract instance
  const lottery = await hre.ethers.getContractAt("CrossChainLottery", lotteryAddress);

  // Lottery parameters
  const entryFee = hre.ethers.parseUnits("1", 6); // 1 RUSD (6 decimals)
  const duration = 24 * 60 * 60; // 24 hours in seconds

  console.log("\nLottery Parameters:");
  console.log("- Entry Fee:", hre.ethers.formatUnits(entryFee, 6), "RUSD");
  console.log("- Duration:", duration, "seconds (", duration / 3600, "hours )");

  // Create lottery
  console.log("\nCreating lottery...");
  const tx = await lottery.createLottery(entryFee, duration);
  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

  // Get current lottery ID
  const currentLotteryId = await lottery.lotteryId();
  console.log("\n✅ Lottery Created!");
  console.log("Lottery ID:", currentLotteryId.toString());

  // Get lottery details
  const lotteryDetails = await lottery.getLottery(currentLotteryId);
  console.log("\nLottery Details:");
  console.log("- ID:", lotteryDetails.id.toString());
  console.log("- Entry Fee:", hre.ethers.formatUnits(lotteryDetails._entryFee, 6), "RUSD");
  console.log("- Prize Pool:", hre.ethers.formatUnits(lotteryDetails._prizePool, 6), "RUSD");
  console.log("- Start Time:", new Date(Number(lotteryDetails.startTime) * 1000).toLocaleString());
  console.log("- End Time:", new Date(Number(lotteryDetails.endTime) * 1000).toLocaleString());
  console.log("- Participants:", lotteryDetails.participantCount.toString());
  console.log("- State:", ["OPEN", "DRAWING", "CLOSED"][lotteryDetails.state]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

What this script does:

It loads the deployment info from `deployments/baseSepolia.json` (the file we created during deployment). This gives us the contract address.

It connects to the deployed contract using `getContractAt`.

It sets lottery parameters: 1 RUSD entry fee, 24 hour duration. You can change these to whatever you want.

It calls `createLottery` on the contract, waits for confirmation, then fetches and displays the lottery details.

Run it:

```bash
npx hardhat run scripts/createLottery.js --network baseSepolia
```

You should see output like:

```
=== Creating New Lottery ===
Network: baseSepolia
Signer: 0xYourAddress
Lottery Contract: 0xYourContractAddress

Lottery Parameters:
- Entry Fee: 1.0 RUSD
- Duration: 86400 seconds ( 24 hours )

Creating lottery...
Transaction hash: 0x...
✅ Transaction confirmed in block: 12345678

✅ Lottery Created!
Lottery ID: 1

Lottery Details:
- ID: 1
- Entry Fee: 1.0 RUSD
- Prize Pool: 0.0 RUSD
- Start Time: 12/16/2025, 11:30:00 AM
- End Time: 12/17/2025, 11:30:00 AM
- Participants: 0
- State: OPEN
```

Your lottery is live. It’s open for entries. Prize pool is zero because nobody’s entered yet. State is OPEN.

You can verify this on [Base Sepolia Basescan](https://sepolia.basescan.org/) by searching for your contract address and checking the events. You’ll see a `LotteryCreated` event with your parameters.

---

## What We Actually Built

So what did we just do?

We built a smart contract that runs a lottery with provably fair randomness and lets winners claim on any chain they want. We deployed it to Base Sepolia. We created a lottery. It works.

The contract handles creation, entry, drawing, and claiming. Threshold cryptography ensures fairness. OnlySwaps enables cross-chain payouts without bridges or wrapped tokens.

This is a real lottery. Not a demo. Not a toy. You could run this in production right now (with some obvious improvements like better access control and testing, but the core mechanics work).

But there’s a problem.

Nobody’s going to interact with your lottery through Hardhat console commands. That’s not a product. That’s a developer tool.

If you want people to actually use this, you need a frontend. Something clean, intuitive, and fast. Something that abstracts away the blockchain complexity and just lets people buy lottery tickets and claim prizes.

That’s what Part 2 is for.

We’ll build a React frontend with Wagmi, Viem, and TailwindCSS. Wallet connections, token approvals, lottery entries, winner selection, cross-chain claims. The whole thing. And we’ll make it actually look good.

But before we do that, take a second to appreciate what you just built. This isn’t some tutorial toy. This is a real application using actual cutting-edge cryptography to solve actual problems. Fair randomness that nobody can manipulate. Cross-chain transfers that don’t need bridges. No centralized chokepoints anywhere.

The contract is done. The hard part is over.

Now we just need to make it beautiful.