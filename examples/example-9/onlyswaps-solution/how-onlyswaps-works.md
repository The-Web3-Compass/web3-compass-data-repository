# How only swaps Actually Works

Understanding only swaps is really about understanding who does what.

There are three roles that make the system work, and none of them require trusting a single entity.

---

## The Three Roles

### 1. The Requester (That's You)

You're the one initiating the swap.

You're not asking permission from a bridge. You're publishing an **offer**:

"I have tokens on Chain A.

I want tokens on Chain B.

Here's the fee I'm willing to pay."

That offer is public and permissionless. Anyone can act on it.

### 2. Solvers (Independent Liquidity Providers)

Solvers are independent actors with capital on multiple chains.

They aren't part of the protocol. They don't get special access. They just run software that scans for profitable swap requests.

Their logic is simple:

"Can I front liquidity on the destination chain, get reimbursed on the source chain, and earn a fee?"

If yes, they fill the request.

If not, they ignore it.

This is why pricing is market-driven. If your fee is too low, no one fills your swap. If it's fair, someone competes to fill it first.

### 3. The dcipher Network (The Verifier)

This is the trust anchor.

dcipher is a distributed network of nodes using **threshold cryptography**. No single node can approve a swap. No small group can cheat.

Their job isn't to move funds.

Their job is to **verify facts across chains**.

Did the requester lock the right amount?

Did the Solver send the right tokens to the right address?

Did everything happen within the agreed parameters?

Once enough nodes independently agree, they collectively produce a **threshold signature** that proves the swap is valid.

That signature is what enables settlement.

---

## Why This Model Avoids Classic Bridge Failures

Now that you've seen the roles, the advantages are obvious.

There's no giant pool of locked funds to drain.

There's no wrapped asset risk.

There's no single signer or multisig controlling settlement.

There's no protocol-level custody of user assets.

Security comes from **distributed verification**.

Liquidity comes from **competition**.

Settlement comes from **cryptography**, not trust.

This is exactly why the threshold cryptography you learned earlier matters. only swaps is a real, practical application of that foundation.

And now that you understand the mechanics, the Solidity we're about to write won't feel mysterious.

It'll feel inevitable.
