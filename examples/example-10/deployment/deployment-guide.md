## Deployment Strategy: Getting This Running

Deployment isn’t just “deploy contract and hope.” You need testnet tokens, proper configuration, verification, and testing. Let’s do this methodically.

### Environment Setup

First, set up your development environment properly.

**Install Dependencies:**

```bash
# Initialize hardhat project if you haven't
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Install OpenZeppelin contracts
npm install @openzeppelin/contracts

# Install only swaps SDK
npm install only swaps-solidity

# Install dotenv for managing secrets
npm install dotenv
```

**Configure Hardhat:**

Create `hardhat.config.js`:

```jsx
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
    avalancheFuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 30000000000, // 30 gwei
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      chainId: 84532,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1000000000, // 1 gwei
    }
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: "snowtrace", // doesn't need real key for testnet
      baseSepolia: process.env.BASESCAN_API_KEY
    }
  }
};
```

**Create `.env` file:**

```bash
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key
```

**CRITICAL:** Never commit `.env` to git. Add it to `.gitignore` immediately.

### Step 1: Get Testnet Tokens

You need tokens on both chains for testing.

**Avalanche Fuji:**

1. Get AVAX from faucet:
    
    ```bash
    # Visit https://core.app/tools/testnet-faucet/
    # Connect wallet
    # Request AVAX
    ```
    
2. Get testnet USDT/USDC (the “FUSD” in our example):
    
    ```bash
    # Visit https://faucet.circle.com/ for USDC
    # Or use a testnet DEX to swap AVAX for test stablecoins
    ```
    
    The testnet token we’re using: `0xFDdcB87aFED6B20cF7616A7339Bc5f8aC37154C3`
    

**Base Sepolia:**

You don’t technically need tokens here since you’re not paying gas to deploy (only on Avalanche). But if you want to test cross-chain IN to Base, get:

1. Base Sepolia ETH:
    
    ```bash
    # Visit https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
    # Or bridge from Sepolia ETH
    ```
    
2. Base Sepolia USDC: `0x9Eb392A6286138E5d59a40Da5398e567Ab3AAd7c`

### Step 2: Deploy The Contract

Deploy on Avalanche Fuji (where customers will pay):

```bash
npx hardhat run scripts/deploy.js --network avalancheFuji
```

The deploy script (`deploy.js`):

```jsx
const ROUTER_ADDRESSES = {
  avalancheFuji: "0x16323707e61d20A39AaE5ab64808e480B91658aB",
  baseSepolia: "0x16323707e61d20A39AaE5ab64808e480B91658aB"
};

const SETTLEMENT_CONFIG = {
  chainId: 84532,  // Base Sepolia
  token: "0x9Eb392A6286138E5d59a40Da5398e567Ab3AAd7c"  // USDC on Base
};

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const PaymentGateway = await hre.ethers.getContractFactory("CrossChainPaymentGateway");

  console.log("Deploying CrossChainPaymentGateway...");
  const gateway = await PaymentGateway.deploy(
    ROUTER_ADDRESSES.avalancheFuji,
    SETTLEMENT_CONFIG.chainId,
    SETTLEMENT_CONFIG.token
  );

  await gateway.waitForDeployment();
  const gatewayAddress = await gateway.getAddress();

  console.log("✅ CrossChainPaymentGateway deployed to:", gatewayAddress);
  console.log("\nSave this address! Update your frontend config:");
  console.log(`export const GATEWAY_ADDRESS = '${gatewayAddress}' as const;`);

  console.log("\nVerify on Snowtrace:");
  console.log(`https://testnet.snowtrace.io/address/${gatewayAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Expected Output:**

```
Deploying with account: 0x1234...5678
Account balance: 5000000000000000000
Deploying CrossChainPaymentGateway...
✅ CrossChainPaymentGateway deployed to: 0x9a957CBf2938A8f18cC622dCa7452003A3e8f154

Save this address! Update your frontend config:
export const GATEWAY_ADDRESS = '0x9a957CBf2938A8f18cC622dCa7452003A3e8f154' as const;

Verify on Snowtrace:
https://testnet.snowtrace.io/address/0x9a957CBf2938A8f18cC622dCa7452003A3e8f154
```

**Copy that address.** You’ll need it everywhere.

### Step 3: Verify The Contract

Verification makes the contract readable on block explorers. Crucial for transparency.

```bash
npx hardhat verify --network avalancheFuji \
  0x9a957CBf2938A8f18cC622dCa7452003A3e8f154 \
  "0x16323707e61d20A39AaE5ab64808e480B91658aB" \
  "84532" \
  "0x9Eb392A6286138E5d59a40Da5398e567Ab3AAd7c"
```

Those three parameters match your constructor arguments:
1. Router address
2. Settlement chain ID
3. Settlement token address

If verification succeeds:

```
Successfully verified contract CrossChainPaymentGateway on Etherscan.
https://testnet.snowtrace.io/address/0x9a957...#code
```

Now anyone can read your contract code directly on Snowtrace. Builds trust.

### Step 4: Test Contract Functions Manually

Before building the frontend, test that everything works via command line.

**Test 1: Register As Merchant**

Create `scripts/testRegister.js`:

```jsx
const GATEWAY_ADDRESS = "0x9a957CBf2938A8f18cC622dCa7452003A3e8f154";

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const gateway = await hre.ethers.getContractAt("CrossChainPaymentGateway", GATEWAY_ADDRESS);

  console.log("Registering merchant:", signer.address);
  console.log("Settlement address:", signer.address); // Using same address for simplicity

  const tx = await gateway.registerMerchant(signer.address);
  console.log("Transaction sent:", tx.hash);

  await tx.wait();
  console.log("✅ Registration confirmed!");

  const merchantInfo = await gateway.getMerchantInfo(signer.address);
  console.log("\nMerchant Info:");
  console.log("  Registered:", merchantInfo.isRegistered);
  console.log("  Settlement Address:", merchantInfo.settlementAddress);
  console.log("  Total Received:", merchantInfo.totalReceived.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run it:

```bash
npx hardhat run scripts/testRegister.js --network avalancheFuji
```

**Test 2: Make A Payment**

Create `scripts/testPayment.js` (the one you provided):

```jsx
const GATEWAY_ADDRESS = "0x9a957CBf2938A8f18cC622dCa7452003A3e8f154";
const SOURCE_TOKEN = "0xFDdcB87aFED6B20cF7616A7339Bc5f8aC37154C3";

async function main() {
  const [signer] = await hre.ethers.getSigners();

  console.log("Testing payment flow...");
  console.log("Payer:", signer.address);

  const gateway = await hre.ethers.getContractAt("CrossChainPaymentGateway", GATEWAY_ADDRESS);
  const sourceToken = await hre.ethers.getContractAt("IERC20", SOURCE_TOKEN);

  // Check balance
  const balance = await sourceToken.balanceOf(signer.address);
  console.log("Token balance:", hre.ethers.formatUnits(balance, 6), "FUSD");

  if (balance < hre.ethers.parseUnits("15.01", 6)) {
    console.log("❌ Insufficient balance. Need at least 15.01 FUSD");
    return;
  }

  // Approve tokens
  console.log("\n📝 Step 1: Approving tokens...");
  const amountIn = hre.ethers.parseUnits("15", 6);
  const solverFee = hre.ethers.parseUnits("0.01", 6);
  const totalNeeded = amountIn + solverFee;

  const approveTx = await sourceToken.approve(GATEWAY_ADDRESS, totalNeeded);
  await approveTx.wait();
  console.log("✅ Tokens approved");

  // Make payment
  console.log("\n💸 Step 2: Making payment...");
  const orderId = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes(`ORDER-${Date.now()}`)
  );
  const expectedSettlement = hre.ethers.parseUnits("14.25", 6); // 5% slippage

  const paymentTx = await gateway.makePayment(
    signer.address, // paying to self for testing
    orderId,
    SOURCE_TOKEN,
    amountIn,
    expectedSettlement,
    solverFee
  );

  console.log("Transaction sent:", paymentTx.hash);
  const receipt = await paymentTx.wait();
  console.log("✅ Payment confirmed!");

  // Extract payment ID from events
  for (const log of receipt.logs) {
    try {
      const parsed = gateway.interface.parseLog({
        topics: log.topics,
        data: log.data
      });

      if (parsed && parsed.name === "PaymentInitiated") {
        console.log("\n📊 Payment Details:");
        console.log("  Payment ID:", parsed.args.paymentId);
        console.log("  Order ID:", parsed.args.orderId);
        console.log("  Amount Paid:", hre.ethers.formatUnits(parsed.args.amountPaid, 6), "FUSD");
        console.log("  Expected Settlement:", hre.ethers.formatUnits(parsed.args.expectedSettlement, 6), "FUSD");
        console.log("  Swap Request ID:", parsed.args.swapRequestId);

        console.log("\n⏳ Waiting for solver to fulfill...");
        console.log("Check status with:");
        console.log(`  npx hardhat run scripts/checkPaymentStatus.js --network avalancheFuji`);
        console.log("  (Update PAYMENT_ID in that script to:", parsed.args.paymentId + ")");
        break;
      }
    } catch (e) {
      continue;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run it:

```bash
npx hardhat run scripts/testPayment.js --network avalancheFuji
```

**Expected Output:**

```
Testing payment flow...
Payer: 0x1234...5678
Token balance: 50.5 FUSD

📝 Step 1: Approving tokens...
✅ Tokens approved

💸 Step 2: Making payment...
Transaction sent: 0xabc...def
✅ Payment confirmed!

📊 Payment Details:
  Payment ID: 0x789...012
  Order ID: 0x345...678
  Amount Paid: 15.0 FUSD
  Expected Settlement: 14.25 FUSD
  Swap Request ID: 0x901...234

⏳ Waiting for solver to fulfill...
```

Now wait 10-30 seconds and check if the swap executed.

**Test 3: Check Payment Status**

Create `scripts/checkPaymentStatus.js`:

```jsx
const GATEWAY_ADDRESS = "0x9a957CBf2938A8f18cC622dCa7452003A3e8f154";
const PAYMENT_ID = "0x789...012"; // From previous step

async function main() {
  const gateway = await hre.ethers.getContractAt("CrossChainPaymentGateway", GATEWAY_ADDRESS);

  console.log("Checking payment:", PAYMENT_ID);

  const payment = await gateway.getPayment(PAYMENT_ID);

  if (payment.timestamp === 0n) {
    console.log("❌ Payment not found");
    return;
  }

  console.log("\n📋 Payment Details:");
  console.log("  Payer:", payment.payer);
  console.log("  Merchant:", payment.merchant);
  console.log("  Amount Paid:", hre.ethers.formatUnits(payment.amountPaid, 6), "FUSD");
  console.log("  Expected Settlement:", hre.ethers.formatUnits(payment.amountSettled, 6), "FUSD");
  console.log("  Source Chain:", payment.sourceChainId.toString());
  console.log("  Source Token:", payment.sourceToken);
  console.log("  Timestamp:", new Date(Number(payment.timestamp) * 1000).toLocaleString());

  const statusNames = ["Pending", "Settled", "Completed", "Refunded"];
  console.log("  Status:", statusNames[payment.status]);

  // Check if swap executed
  const isSettled = await gateway.isPaymentSettled(PAYMENT_ID);
  console.log("\n🔍 Settlement Status:");
  console.log("  Swap Executed:", isSettled ? "✅ YES" : "⏳ Pending");

  if (isSettled) {
    const merchantInfo = await gateway.getMerchantInfo(payment.merchant);
    console.log("  Merchant Settlement Address:", merchantInfo.settlementAddress);
    console.log("\n✅ Merchant has received funds on Base Sepolia!");
    console.log("   View on Base explorer:");
    console.log(`   https://sepolia.basescan.org/address/${merchantInfo.settlementAddress}`);
  } else {
    console.log("\n⏳ Solver is processing. Check again in 10-30 seconds.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run it:

```bash
npx hardhat run scripts/checkPaymentStatus.js --network avalancheFuji
```

If swap executed:

```
📋 Payment Details:
  Payer: 0x1234...5678
  Merchant: 0x1234...5678
  Amount Paid: 15.0 FUSD
  Expected Settlement: 14.25 FUSD
  Timestamp: 12/18/2024, 10:40:45 AM

🔍 Settlement Status:
  Swap Executed: ✅ YES
  Merchant Settlement Address: 0x1234...5678

✅ Merchant has received funds on Base Sepolia!
   View on Base explorer:
   https://sepolia.basescan.org/address/0x1234...5678
```

Go to that Base Sepolia explorer link. Check the merchant’s USDC balance. It should have increased by ~14.25 USDC.

That’s the entire flow working. Tokens moved from Avalanche to Base in seconds.

### Step 5: Deploy The Frontend

Now that the contract works, build the UI.

**Update Frontend Config:**

In `src/config.ts`:

```tsx
export const GATEWAY_ADDRESS = '0x9a957CBf2938A8f18cC622dCa7452003A3e8f154' as const;
export const SOURCE_TOKEN = '0xFDdcB87aFED6B20cF7616A7339Bc5f8aC37154C3' as const;
export const CHAIN_ID = 43113; // Avalanche Fuji
export const SETTLEMENT_CHAIN_ID = 84532; // Base Sepolia
```

**Install Frontend Dependencies:**

```bash
cd frontend
npm install
```

**Run Development Server:**

```bash
npm run dev
```

Visit `http://localhost:5173`. Connect wallet. Try the full flow:
1. Register as merchant
2. Make a payment to yourself
3. Watch payment list update as swap settles

**Build For Production:**

```bash
npm run build
```

Deploy to Vercel/Netlify/wherever you host static sites:

```bash
# Vercel example
vercel --prod
```

### Step 6: Monitoring & Maintenance

Once deployed, you need ongoing monitoring.

**Create A Monitoring Script:**

```jsx
// scripts/monitor.js
async function main() {
  const gateway = await hre.ethers.getContractAt("CrossChainPaymentGateway", GATEWAY_ADDRESS);

  console.log("Monitoring payments...\n");

  // Listen for new payments
  gateway.on("PaymentInitiated", async (paymentId, orderId, merchant, payer, ...args) => {
    console.log("🆕 New Payment:", paymentId);
    console.log("   Payer:", payer);
    console.log("   Merchant:", merchant);

    // Wait a bit then check if settled
    setTimeout(async () => {
      const isSettled = await gateway.isPaymentSettled(paymentId);
      if (isSettled) {
        console.log("✅ Payment settled:", paymentId);
      } else {
        console.log("⚠️  Payment NOT settled after 30s:", paymentId);
        // Could send alert here
      }
    }, 30000); // 30 seconds
  });

  console.log("Listening for events... (Ctrl+C to stop)");
}

main();
```

Run this continuously:

```bash
npx hardhat run scripts/monitor.js --network avalancheFuji
```

Set up alerts for payments that don’t settle within 60 seconds. Indicates solver issues or liquidity problems.

### Common Deployment Issues

**Issue 1: “Insufficient funds for gas”**

You don’t have enough AVAX to pay for deployment gas.

Solution: Get more AVAX from faucet.

**Issue 2: “Nonce too high”**

Your local nonce got out of sync with on-chain nonce.

Solution:

```bash
# Reset nonce
npx hardhat clean
# Try deployment again
```

**Issue 3: Contract verification fails**

Constructor parameters don’t match.

Solution: Double-check the parameters you pass to `verify`. They must EXACTLY match what you passed to deploy.

**Issue 4: Payment stays pending forever**

No solver fulfilled the swap.

Reasons:
- Solver fees too low (increase from 0.01 to 0.05)
- Amount too small (solvers ignore tiny amounts)
- Destination chain gas price spiked (solvers waiting for cheaper gas)

Check the only swaps router events to see if any solver attempted fulfillment.

**Issue 5: Frontend can’t connect to contract**

Wrong chain or wrong address in config.

Solution:
- Make sure MetaMask is on Avalanche Fuji
- Double-check GATEWAY_ADDRESS matches deployed address
- Clear browser cache and reconnect wallet

---

---

---

## Real-World Considerations

**Solver Liquidity:**

Only swaps relies on solvers having capital on both chains. If you’re doing high volume, talk to solver operators. Make sure they can handle your traffic.

Otherwise payments might sit pending for minutes or fail entirely.

**Gas Price Volatility:**

Solver fees are fixed at payment time. If gas prices spike on the destination chain, solvers might not fulfill (unprofitable).

Consider dynamic fee models. Or buffer fees by 50% to account for volatility.

**Failed Swaps:**

What happens if no solver fulfills? User’s tokens are stuck in the router.

Build a refund mechanism. After X hours, allow users to reclaim tokens. Or have a customer service process to handle this manually.

**Regulatory:**

If you’re processing real money at scale, regulatory requirements apply. KYC/AML might be needed.

This tutorial shows the tech. Legal compliance is separate but necessary.

---

## What You’ve Built

You built a payment gateway that:
- Accepts payments on one chain (Avalanche)
- Settles on a different chain (Base)
- Handles token conversion automatically
- Requires no manual bridging
- Completes in seconds, not minutes

The smart contract coordinates everything. Only swaps provides the cross-chain infrastructure. The frontend makes it usable.

Customers just click “Pay.” Merchants just receive money. The complexity is hidden.

This is what cross-chain commerce should feel like. Seamless. Fast. Simple.

That’s the power of purpose-built protocols like only swaps combined with focused applications like this payment gateway.

You’re not building a bridge. You’re building a payment experience that happens to work across chains.

That’s the difference.