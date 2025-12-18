## only swaps: Cross-Chain Coordination in Practice

Now let's look at how these capabilities come together in a real application: only swaps, dcipher's cross-chain token transfer protocol.

### The Problem with Traditional Bridges

Bridges today are fragile. Behind every "trustless" marketing slogan, there's usually a set of relayers, a permissioned operator group, or a multisig controlling everything.

Most bridges operate in one of these broken modes:

**Lock-and-mint:** Lock tokens on Chain A, mint wrapped tokens on Chain B. If the locked collateral gets hacked, the wrapped tokens become worthless.

**Liquidity pools:** Pre-fund pools on both chains, swap against those pools. Fast, but the pools are massive honeypots and the liquidity is capital-inefficient.

**Oracle + relayer:** Oracles watch Chain A, relayers submit proofs to Chain B. You're trusting the oracle set and the relayers not to collude.

### How only swaps Actually Works

![OnlySwaps](https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/examples/example-2/images/only-swaps.png)

**Step 1: User Creates a Swap Request**

You want to move 1000 USDC from Ethereum to Arbitrum. You lock your tokens on Ethereum and publish a **swap request** an order book entry announcing: "I have 1000 USDC locked on Ethereum. I want 990 USDC delivered on Arbitrum. I'm offering 10 USDC as a fee to whoever makes this happen."

That request sits there, visible on-chain, waiting for someone to fill it.

**Step 2: Solver Fulfills the Request**

You don't wait for some centralized bridge operator. Instead, **solvers** (independent liquidity providers) monitor these requests. A solver sees your offer and thinks, "10 USDC for moving 1000 USDC? I'll take that trade."

The solver uses their own capital to send you 990 USDC on Arbitrum. They're fronting the liquidity. They haven't touched your locked USDC yet they're just fulfilling your intent with their own funds.

Why would they do this? Because they're about to get reimbursed, plus earn that 10 USDC fee.

**Step 3: dcipher Committee Verifies**

Now the dcipher committee steps in. They're watching both chains through their off-chain operators. They verify:

- Your 1000 USDC is actually locked on Ethereum
- The solver actually sent you 990 USDC on Arbitrum
- The transaction IDs match the swap request

Once threshold many committee members verify these facts, they collectively produce a BLS threshold signature attesting to the fulfillment.

**Step 4: Solver Gets Reimbursed**

The solver takes that threshold signature back to Ethereum and presents it to the smart contract. The contract verifies the signature (standard BLS verification), confirms it's valid, and releases the locked funds to the solver.
The solver receives 1000 USDC (the original locked amount) + 10 USDC (the fee you offered) = 1010 USDC total. They paid out 990 USDC on Arbitrum, so their net profit is 20 USDC minus gas costs.
You got your funds on the destination chain. The solver got paid. The committee verified everything cryptographically. No trust required.

### Why This Model Is Different

What's actually happening here:

**No custodian holds your funds.** The Ethereum smart contract holds them in escrow. Release only happens when a valid threshold signature proves the swap was fulfilled.

**No relayers you have to trust.** Solvers are economically motivated, not trusted. If they don't fulfill the swap, they don't get paid. Simple.

**No liquidity pools to drain.** There's no locked liquidity sitting in a bridge contract waiting to be exploited. Solvers bring their own capital transaction-by-transaction.

**No wrapped tokens.** You lock native USDC on Ethereum, you receive native USDC on Arbitrum. The solver already had that capital on Arbitrum. There's no minting of synthetic bridged tokens.

**No challenge windows.** The moment the threshold signature is verified, the funds release. No seven-day delays. No optimistic assumptions that get challenged later.

The dcipher committee isn't moving your assets. They're **verifying that the movement happened correctly** and producing cryptographic proof that both chains can trust.

You get the speed of liquidity pools (solvers front capital immediately), the security of lock-and-verify (nothing happens without threshold verification), and the efficiency of intent-based systems (no permanently locked liquidity).

### The Fee Structure (Because Economics Matter)

Fees in only swaps have two components:

**Solver Fee (Flat):** This is what you offer to solvers as an incentive to fulfill your swap. It's a competitive market you can set this however you want. Higher fees get your swap fulfilled faster because solvers prioritize profitable orders.

If market conditions change (maybe gas spikes on the destination chain and solvers aren't biting), you can update this fee. The swap request just sits there until a solver thinks it's worth doing.

**Network Fee (Percentage):** This is what dcipher charges for the verification service. It's a percentage of your swap amount (currently capped at 50% but typically much lower). This fee compensates the committee members for watching chains, verifying transactions, and producing threshold signatures.

So if you're swapping 1000 USDC with a 1% network fee and 10 USDC solver fee, here's the math:

- You lock: 1000 + 10 = 1010 USDC on the source chain
- You receive: 1000 - 10 (1%) = 990 USDC on the destination chain
- Solver receives: 1000 + 10 = 1010 USDC on the source chain (after verification)
- Network receives: 10 USDC (the 1% fee, deducted from swap amount)

The fee market self-regulates. When demand is high, solver fees rise. When chains are quiet, fees drop. There's an API you can query for recommended fees based on current market conditions.

### Solver Competition (The Hidden Genius)

Solvers compete. There's no single entity with a monopoly on fulfilling swaps. Anyone with capital can run the only swaps solver binary and participate.

If one solver goes offline, others pick up the slack. If one solver tries to cheat (not fulfilling after claiming they did), the dcipher committee catches it and they don't get reimbursed. If one solver gets too greedy with low fulfillment rates, users just offer higher fees and other solvers step in.

This competitive dynamic means the system stays liquid even without permanent locked capital. Solvers only commit funds transaction-by-transaction, which is far more capital-efficient than traditional bridges.

And from a security perspective, compromising solvers doesn't break the system. A malicious solver can refuse to fulfill swaps (annoying but not catastrophicanother solver just does it). But they can't steal locked funds because those funds only release on valid threshold signatures from the dcipher committee.

The real security guarantee comes from the threshold signature. And that's where we get back to why threshold cryptography is the foundation of everything.

---
