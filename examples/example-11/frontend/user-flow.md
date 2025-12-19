# Part 2: Building the Frontend (Making It Actually Usable) (1)

## The Contract Works. Now Make It Human.

Part 1 was all about the contract. Fair randomness, cross-chain payouts, the whole nine yards. The mechanics are solid. The cryptography is sound. You could deploy this right now and it would work exactly as designed.

But here’s the thing.

Nobody’s going to use a lottery they can only interact with through Hardhat console commands. That’s not a product. That’s a developer tool. If you want actual humans to buy tickets, check results, and claim prizes, you need a frontend.

Not just any frontend. Something that makes the complexity disappear. Something where you connect your wallet, buy entries with a couple clicks, and claim your winnings without thinking about gas limits, transaction hashes, or ABI encodings.

That’s what we’re building in Part 2.

We’re using React with Vite for the framework, Wagmi for wallet connections and contract interactions, and TailwindCSS for styling. More importantly, we’re integrating **onlyswaps-js** to handle cross-chain prize claims without the user needing to understand what’s happening under the hood.

The full code is on GitHub: **[Example-11](https://github.com/The-Web3-Compass/dcipher-by-example/tree/main/Example-11)**

Clone it, install dependencies, and you’re ready to go. But before you just run it, let’s walk through how it actually works. Not line-by-line code review (you can read the repo for that), but the flow, the key integrations, and the parts that make this different from a standard dApp.

By the end, you’ll understand how to build frontends that use dcipher’s primitives. Not just for lotteries, but for any application that needs threshold randomness or cross-chain functionality.

Let’s make this thing usable.

---

## What Actually Happens When Someone Uses This

Let’s walk through the user experience. Not the developer experience. Not the technical flow. What an actual human sees and does when they interact with this lottery.

**1. Connect Wallet**

User lands on the page. Sees the lottery. Clicks “Connect Wallet.” MetaMask (or whatever) pops up. They approve. Now they’re connected to Base Sepolia.

**2. Check Lottery Status**

The frontend automatically fetches the current lottery details. Entry fee, prize pool, how many people entered, time remaining, current state (OPEN, DRAWING, or CLOSED).

If the lottery is OPEN and hasn’t ended yet, they can buy entries.

**3. Buy Entries**

User decides how many entries they want. Let’s say 3 entries at 1 RUSD each. Total cost: 3 RUSD.

First, they need to approve the lottery contract to spend their RUSD. The frontend handles this with a token approval transaction. User signs. Approval goes through.

Then they call `enterLottery` with the lottery ID and number of entries. User signs again. Transaction confirms. Their entries are recorded. Prize pool grows.

**4. Wait for Lottery to End**

Time passes. Other people enter. Prize pool accumulates. The frontend shows a countdown timer. When it hits zero, the lottery can be drawn.

**5. Draw Winner**

Anyone can trigger the draw once the lottery ends. User clicks “Draw Winner.” The frontend calls `drawWinner`, which requests randomness from dcipher and pays for the callback with a small amount of ETH (0.001 ETH in our case).

Transaction confirms. Lottery state changes to DRAWING. Now we wait for the dcipher network to generate randomness and call back.

**6. Randomness Callback**

This happens automatically. The dcipher network generates the random value, calls `onRandomnessReceived` on the contract, winner gets selected, lottery state changes to CLOSED.

The frontend polls for state changes and updates the UI when the winner is announced.

**7. Claim Prize (Same-Chain)**

If the user won and wants their prize on Base Sepolia (same chain), they click “Claim Prize.” Simple transfer. Done.

**8. Claim Prize (Cross-Chain)**

If the user won and wants their prize on Avalanche Fuji instead, they select “Claim on Avalanche Fuji” and click “Claim Cross-Chain.”

The frontend calls `claimPrizeCrossChain` with the destination chain ID, destination token address, and a solver fee. The contract approves the only swaps router, calls `requestCrossChainSwap`, and creates a swap intent.

Solvers see this intent, fulfill it by sending RUSD to the winner on Avalanche, then get reimbursed on Base once dcipher verifies both sides of the swap.

Winner gets their prize on Avalanche. No bridge. No wrapped tokens. Just works.

That’s the entire user flow. Now let’s see how the code makes this happen.

---

