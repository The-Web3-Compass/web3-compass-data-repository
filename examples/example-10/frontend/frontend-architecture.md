## The Frontend Architecture

Let's look at how the frontend makes this usable.

We have two user types: Merchants (who register to receive payments and view payment history) and Customers (who make payments to merchants).

Three main components handle everything. `MerchantPanel` handles registration and status display. `PaymentPanel` is the form for making payments. `PaymentList` shows history of all payments.

Each component is self-contained. Uses wagmi hooks for blockchain interaction. Minimal state management.

The config file centralizes all constants:

```tsx
export const GATEWAY_ADDRESS = '0x9a957...' as const;
export const SOURCE_TOKEN = '0xFDdcB...' as const;
export const CHAIN_ID = 43113; // Avalanche Fuji
export const SETTLEMENT_CHAIN_ID = 84532; // Base Sepolia
```

Change these when deploying to different networks. Frontend reads from here, no hardcoded addresses scattered everywhere.

Wagmi configuration is simple:

```tsx
const config = createConfig({
  chains: [avalancheFuji],
  connectors: [injected()],
  transports: {
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
  },
})
```

We only configure Avalanche Fuji because that's where payments originate. Settlements happen on Base, but users never interact with Base directly. The only swaps router handles that. Simplified setup. One chain. One RPC. Done.

---

## Component Breakdown: MerchantPanel

```tsx
export function MerchantPanel() {
  const { address } = useAccount()
  const [settlementAddress, setSettlementAddress] = useState('')

  const { data: merchantInfo, refetch } = useReadContract({
    address: GATEWAY_ADDRESS,
    abi: PAYMENT_GATEWAY_ABI,
    functionName: 'getMerchantInfo',
    args: address ? [address] : undefined,
  })

  const { writeContract } = useWriteContract()

  const handleRegister = async () => {
    writeContract({
      address: GATEWAY_ADDRESS,
      abi: PAYMENT_GATEWAY_ABI,
      functionName: 'registerMerchant',
      args: [settlementAddress as `0x${string}`],
    }, {
      onSuccess: () => {
        // Show success message, refetch merchant info
      },
      onError: (error) => {
        // Show error message
      }
    })
  }
}
```

The flow is straightforward. Read merchant info from contract. If not registered, show registration form. On submit, call `registerMerchant`. On success, refetch info to update UI.

Why refetch? Wagmi's `useReadContract` doesn't automatically update when you write. You must manually trigger refetch. Alternatively, watch for events and invalidate queries.

Error handling looks like this:

```tsx
onError: (error) => {
  const msg = error.message.includes('User rejected')
    ? 'Transaction rejected by user'
    : error.message.includes('Already registered')
    ? 'You are already registered as a merchant'
    : `Registration failed:${error.message.slice(0, 100)}`
  setStatus({ type: 'error', message: msg })
}
```

Parse error messages. Show user-friendly versions. "User rejected" is clear. Raw revert strings are confusing.

---

## Component Breakdown: PaymentPanel

More complex. Involves token approval, amount calculations, validation.

```tsx
export function PaymentPanel() {
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')

  const { data: allowance } = useReadContract({
    address: SOURCE_TOKEN,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [userAddress, GATEWAY_ADDRESS],
  })

  const { data: merchantInfo } = useReadContract({
    address: GATEWAY_ADDRESS,
    abi: PAYMENT_GATEWAY_ABI,
    functionName: 'getMerchantInfo',
    args: merchant ? [merchant] : undefined,
  })

  const needsApproval = allowance < totalNeeded
```

**The Two-Step Payment:**

First time paying, you need approval. Frontend detects this:

```tsx
{needsApproval ? (
  <button onClick={handleApprove}>
    Step 1: Approve Tokens
  </button>
) : (
  <button onClick={handlePayment}>
    Make Payment
  </button>
)}
```

After approval transaction confirms, `allowance` updates, button changes to “Make Payment.”

**Amount Calculation:**

```tsx
const amountWei = parseUnits(amount, TOKEN_DECIMALS)
const solverFeeWei = parseUnits(DEFAULT_SOLVER_FEE, TOKEN_DECIMALS)
const totalNeeded = amountWei + solverFeeWei
const expectedSettlement = amountWei - (amountWei * slippage)
```

User enters amount in human-readable form (“10.5”). We convert to wei. Add solver fee. Calculate expected settlement (amount minus slippage).

Show this breakdown in UI:

```
Amount: 10.5 FUSD
Solver Fee: 0.01 FUSD
Total: 10.51 FUSD
```

User sees exactly what they’re paying.

**Merchant Validation:**

```tsx
const { data: merchantInfo } = useReadContract({
  // ... query merchant info
})

{merchant.length === 42 && !merchantInfo?.isRegistered && (
  <div className="field-hint error">⚠️ Merchant not registered</div>
)}
```

As user types merchant address, we query whether they’re registered. Show warning if not. Prevents failed transactions.

---

## Component Breakdown: PaymentList

Displays payment history with live status updates.

```tsx
export function PaymentList() {
  const { data: paymentIds } = useReadContract({
    functionName: 'getMerchantPayments',
    args: [merchantAddress],
  })

  return paymentIds.map(id => <PaymentItem key={id} paymentId={id} />)
}

function PaymentItem({ paymentId }) {
  const { data: payment } = useReadContract({
    functionName: 'getPayment',
    args: [paymentId],
  })

  const { data: isSettled } = useReadContract({
    functionName: 'isPaymentSettled',
    args: [paymentId],
  })

  const status = isSettled ? 'Settled' : 'Pending'
}
```

Two queries per payment:
1. Get payment details
2. Check if settled

Why separate? Because settlement status comes from the router, not from our contract’s storage. We could cache it, but querying live gives accurate results.

**Performance Consideration:**

If a merchant has 100 payments, that’s 200 queries. On page load. Ouch.

Better approach: batch queries or use a subgraph. For this tutorial, we kept it simple. Production app should optimize.

---
