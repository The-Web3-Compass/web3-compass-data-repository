## How Developers Should Approach This

When building on this contract, think in layers.

Start by understanding what `only swaps` does. Before writing any code, read their docs. Deploy test contracts. Make some swaps manually. Once you viscerally understand "I request a swap, solver fulfills it, I can check if it executed," the payment gateway makes sense.

Then deploy the contract on testnet first. Avalanche Fuji is free and fast. Base Sepolia is also free. Use the provided deploy script:

```jsx
const ROUTER_ADDRESS = "0x16323707e61d20A39AaE5ab64808e480B91658aB";
const SETTLEMENT_CHAIN = 84532; // Base Sepolia
const SETTLEMENT_TOKEN = "0x9Eb..."; // USDC on Base Sepolia

const PaymentGateway = await ethers.getContractFactory("CrossChainPaymentGateway");
const gateway = await PaymentGateway.deploy(
  ROUTER_ADDRESS,
  SETTLEMENT_CHAIN,
  SETTLEMENT_TOKEN
);
```

Verify on block explorer. Test basic functions (register merchant, check registration).

Next, test with real tokens. Get testnet tokens from Avalanche Fuji faucet. Swap for testnet USDT. Approve the gateway. Call makePayment with small amount.

Watch what happens. Check the only swaps router. Did a solver fulfill? Did tokens arrive on Base Sepolia? How long did it take? Understanding timing and success rates informs your frontend UX.

Then build the frontend. Start simple: merchant registration form, payment form (merchant address, amount), payment list. Don't try to build everything at once. Get basic flow working. Then add polish.

Finally, handle edge cases. What if swap fails? What if solver doesn't fulfill? What if customer sends wrong amount? Build error handling. Show clear messages. Maybe add a "request refund" function for stuck payments.

This is the path. Start with understanding. Then deploy and test manually. Then automate with frontend. Then handle edge cases. Don't skip steps. Each builds on the last.

---
