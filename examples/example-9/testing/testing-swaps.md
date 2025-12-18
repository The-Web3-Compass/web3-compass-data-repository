# Testing the Cross-Chain Swap

Time to actually use the contract you deployed.

---

## Writing the Test Script

Create `scripts/testSwap.js`:

```javascript
// Addresses (update these with real values)
const SWAPPER_ADDRESS = "0xYourDeployedCrossChainSwapperAddress"; // Your deployed CrossChainSwapper
const RUSD_BASE_SEPOLIA = "0xYourRUSDTokenAddressOnBaseSepolia"; // RUSD token on Base Sepolia
const RUSD_AVAX_FUJI = "0xYourRUSDTokenAddressOnAvalancheFuji"; // RUSD token on Avalanche Fuji
const RECIPIENT_ADDRESS = "0xYourRecipientAddressOnDestinationChain"; // Where tokens go on destination chain

async function main() {
  const [signer] = await hre.ethers.getSigners();
  
  console.log("Testing swap with account:", signer.address);
  
  // Get contract instances
  const swapper = await hre.ethers.getContractAt("CrossChainSwapper", SWAPPER_ADDRESS);
  const rusd = await hre.ethers.getContractAt("IERC20", RUSD_BASE_SEPOLIA);
  
  // Check balance
  const balance = await rusd.balanceOf(signer.address);
  console.log("RUSD balance:", hre.ethers.formatEther(balance));
  
  // Define swap parameters
  const amountIn = hre.ethers.parseUnits("1", 18); // Swap 1 token
  const amountOut = hre.ethers.parseUnits("0.95", 18); // Receive 0.95 tokens (after network fee)
  const solverFee = hre.ethers.parseUnits("0.01", 18); // Pay 0.01 tokens to solver
  const destinationChainId = 43113; // Avalanche Fuji
  
  const totalNeeded = amountIn + solverFee;
  console.log("\\nSwap Parameters:");
  console.log("- Amount In:", hre.ethers.formatEther(amountIn), "RUSD");
  console.log("- Amount Out:", hre.ethers.formatEther(amountOut), "RUSD");
  console.log("- Solver Fee:", hre.ethers.formatEther(solverFee), "RUSD");
  console.log("- Total Needed:", hre.ethers.formatEther(totalNeeded), "RUSD");
  console.log("- Destination Chain:", destinationChainId, "(Avalanche Fuji)");
  console.log("- Recipient:", RECIPIENT_ADDRESS);
  
  // Approve tokens
  console.log("\\nApproving tokens...");
  const approveTx = await rusd.approve(SWAPPER_ADDRESS, totalNeeded);
  await approveTx.wait();
  console.log("✅ Tokens approved");
  
  // Initiate swap
  console.log("\\nInitiating cross-chain swap...");
  const swapTx = await swapper.initiateSwap(
    RUSD_BASE_SEPOLIA,      // tokenIn
    RUSD_AVAX_FUJI,         // tokenOut
    amountIn,               // amountIn
    amountOut,              // amountOut
    solverFee,              // solverFee
    destinationChainId,     // destinationChainId
    RECIPIENT_ADDRESS       // recipient
  );
  
  console.log("Transaction hash:", swapTx.hash);
  console.log("Waiting for confirmation...");
  
  const receipt = await swapTx.wait();
  console.log("✅ Swap initiated successfully!");
  console.log("Block number:", receipt.blockNumber);
  
  // Get the request ID from events
  let requestId = null;
  for (const log of receipt.logs) {
    try {
      const parsed = swapper.interface.parseLog({
        topics: log.topics,
        data: log.data
      });
      if (parsed && parsed.name === "SwapInitiated") {
        requestId = parsed.args.requestId;
        break;
      }
    } catch (e) {
      // Skip logs that don't match our interface
      continue;
    }
  }
  
  if (requestId) {
    console.log("\\nRequest ID:", requestId);
    console.log("\\n⏳ Swap is pending. A solver will execute it on the destination chain.");
    console.log("You can check the status later using the request ID.");
  } else {
    console.log("\\n⚠️ Could not extract request ID from transaction logs.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## Running Your First Swap

Before you run anything, make sure you have:

1. ✅ Test ETH on Base Sepolia (for gas)
2. ✅ Test ETH on Fuji Testnet (for checking balances later)
3. ✅ Test RUSD on Base Sepolia (to swap) - get from [https://faucet.dcipher.network/](https://faucet.dcipher.network/)
4. ✅ Updated all addresses in `testSwap.js`:
    - `SWAPPER_ADDRESS` - your deployed contract
    - `RECIPIENT_ADDRESS` - where you want tokens on Fuji

Then run:

```bash
npx hardhat run scripts/testSwap.js --network baseSepolia
```

If everything's set up correctly, you'll see output like:

```bash
Testing swap with account: 0x...
RUSD balance: 10.0

Swap Parameters:
- Amount In: 1.0 RUSD
- Amount Out: 0.95 RUSD
- Solver Fee: 0.01 RUSD
- Total Needed: 1.01 RUSD
- Destination Chain: 43113 (Avalanche Fuji)
- Recipient: 0x...

Approving tokens...
✅ Tokens approved

Initiating cross-chain swap...
Transaction hash: 0x...
Waiting for confirmation...
✅ Swap initiated successfully!
Block number: 12345678

Request ID: 0x...
⏳ Swap is pending. A solver will execute it on the destination chain.
```

---

## What Actually Happens After You Hit Enter

Here's the entire journey your tokens take:

**Minutes 0-1: Initial Broadcast**

- Your transaction gets mined on Base Sepolia
- Tokens are locked in the Router contract
- Event is emitted with your swap request
- Solvers' bots pick up the event immediately

**Minutes 1-3: Solver Evaluation**

- Multiple Solvers see your request
- They check: "Is this fee worth it?"
- They verify they have liquidity on Fuji
- First Solver to decide fulfills the swap

**Minutes 3-5: Token Transfer on Destination**

- Solver sends RUSD to your recipient on Fuji Testnet
- This is just a regular token transfer
- You can see it on Fuji Explorer if you're watching
- The tokens are REAL RUSD, not wrapped or bridged

**Minutes 5-15: dcipher Committee Verification**

- Committee nodes monitor both chains
- They verify: "Did user lock tokens on Base?" ✓
- They verify: "Did Solver send tokens on Fuji?" ✓
- They check all parameters match up
- Once threshold is reached, they generate signature

**Minutes 15-20: Settlement**

- Router on Base receives threshold signature
- Verifies the signature cryptographically
- Releases locked tokens + fee to Solver
- Swap marked as `executed = true`
- Done!

The timing can vary based on:

- Network congestion on both chains
- How attractive your solver fee is
- Current Solver activity on the network
- Block times on each chain

---

## Status Checker Script

Create `scripts/checkStatus.js`:

```javascript
const SWAPPER_ADDRESS = "0xYourDeployedCrossChainSwapperAddress"; // Your contract address
const REQUEST_ID = "0xYourSwapRequestIdFromTransaction"; // From the swap transaction

async function main() {
  const swapper = await hre.ethers.getContractAt("CrossChainSwapper", SWAPPER_ADDRESS);
  
  console.log("Checking status for request:", REQUEST_ID);
  console.log("═══════════════════════════════════════════\\n");
  
  try {
    const status = await swapper.getSwapStatus(REQUEST_ID);
    
    console.log("📋 Swap Details:");
    console.log("- Sender:", status.sender);
    console.log("- Recipient:", status.recipient);
    console.log("- Token In:", status.tokenIn);
    console.log("- Token Out:", status.tokenOut);
    console.log("- Amount In:", hre.ethers.formatEther(status.amountIn), "tokens");
    console.log("- Amount Out:", hre.ethers.formatEther(status.amountOut), "tokens");
    console.log("- Solver Fee:", hre.ethers.formatEther(status.solverFee), "tokens");
    console.log("- Verification Fee:", hre.ethers.formatEther(status.verificationFee), "tokens");
    console.log("- Source Chain:", status.srcChainId.toString());
    console.log("- Destination Chain:", status.dstChainId.toString());
    console.log("- Nonce:", status.nonce.toString());
    console.log("- Requested At:", new Date(Number(status.requestedAt) * 1000).toLocaleString());
    
    console.log("\\n🎯 Status:", status.executed ? "✅ COMPLETED" : "⏳ PENDING");
    
    if (status.executed) {
      console.log("\\n🎉 Your swap is complete!");
      console.log("Tokens should be in the recipient wallet on Fuji Testnet.");
    } else {
      console.log("\\n⏳ Your swap is still processing...");
      console.log("This usually takes 5-15 minutes. Check back soon!");
      console.log("\\nPossible reasons for delay:");
      console.log("- Solver is fulfilling the swap on destination chain");
      console.log("- dcipher committee is verifying the transaction");
      console.log("- Network congestion on either chain");
    }
  } catch (error) {
    console.error("\\n❌ Error fetching swap status:");
    console.error(error.message);
    console.log("\\nMake sure you're using the correct:");
    console.log("1. Contract address (SWAPPER_ADDRESS)");
    console.log("2. Request ID from your swap transaction");
    console.log("3. Network (should be baseSepolia)");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Checking Swap Status

Update `checkStatus.js` with your contract address and request ID, then run:

```bash
npx hardhat run scripts/checkStatus.js --network baseSepolia
```

You'll see either:

**If still pending:**

```bash
🎯 Status: ⏳ PENDING

⏳ Your swap is still processing...
This usually takes 5-15 minutes. Check back soon!
```

**If complete:**

```bash
🎯 Status: ✅ COMPLETED

🎉 Your swap is complete!
Tokens should be in the recipient wallet on Fuji Testnet.
```

---

> 💡 **Complete Code Repository**
>
> [https://github.com/The-Web3-Compass/dcipher-by-example.git](https://github.com/The-Web3-Compass/dcipher-by-example.git)
