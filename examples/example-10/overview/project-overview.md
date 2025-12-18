## What We’re Actually Building

A payment gateway where:

- Customers pay on any supported chain (Avalanche, Base, Arbitrum, etc.)
- Merchants receive on their preferred chain (configurable per merchant)
- The conversion happens automatically via only swaps
- No manual intervention required
- Merchants can track all payments in one dashboard

**Three Core Components:**

**Smart Contract** → Coordinates payments, calls only swaps router, tracks settlement
**Frontend** → Customer/merchant interface for making and tracking payments
**Only Swaps Router** → Handles the actual cross-chain value transfer

The contract is the brain. Frontend is the face. Router is the muscle.

Let’s build each piece.

---
