---

## Actually Running This Thing

Once you’ve got the ABI copied and environment variables set, fire up the dev server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

Connect your wallet. Make sure you’re on Base Sepolia. If there’s an active lottery, you’ll see the lottery card with all the details.

Buy some entries. Wait for the lottery to end. Draw the winner. If you win, claim your prize (same-chain or cross-chain).

The entire flow works end-to-end. No backend server. No database. No API. Just your browser, your wallet, and the contracts.

---

Most dApp frontends are thin wrappers around contract calls. Connect wallet, call function, show transaction hash, done.

This one’s different. It integrates two dcipher primitives in a way that makes all the complexity invisible.

**Threshold randomness** - The user doesn’t know or care that multiple nodes are generating randomness using threshold cryptography. They just click “Draw Winner” and a winner gets selected. Fairly. Verifiably. Trustlessly.

**only swaps** - The user doesn’t know or care about solvers, swap intents, or cross-chain verification. They just select “Claim on Avalanche” and their prize shows up there. No bridge. No wrapped tokens. No manual steps.

The frontend’s job is making powerful primitives feel simple. That’s what this does.

You could build similar UX with traditional bridges and centralized oracles. But you’d be adding trust assumptions, security risks, and failure points.

With dcipher, you get the UX without the compromises.

---

## Building Your Own dApp with dcipher

If you’re building something using dcipher’s primitives, here’s what you actually need to know:

### For Threshold Randomness:

1. **Install the randomness library** - `npm install randomness-solidity`
2. **Inherit from RandomnessReceiverBase** in your contract
3. **Request randomness** - Call `_requestRandomnessPayInNative` with a callback gas limit
4. **Implement the callback** - Override `onRandomnessReceived` to handle the random value
5. **In your frontend** - Call your request function with `value` to pay for the callback
6. **Poll for results** - Watch contract state or listen for events to know when randomness arrives

### For only swaps:

1. **Install the library** - `npm install onlyswaps-solidity` (contract) and `npm install onlyswaps-js` (frontend)
2. **Import the router interface** - `import {IRouter} from "onlyswaps-solidity/src/interfaces/IRouter.sol"`
3. **Call requestCrossChainSwap** - Provide source token, destination token, amounts, solver fee, destination chain, and recipient
4. **In your frontend** - Either let the contract handle it (like we did) or use `onlyswaps-js` for direct integration
5. **Monitor swap status** - Use events or `onlyswaps-js` to track fulfillment

The patterns repeat across applications. Request randomness, handle callback. Request swap, monitor fulfillment. The primitives compose.

You could build:
- Cross-chain NFT mint with random traits
- Prediction market with verifiable outcomes

- Gaming platform with fair loot drops
- Anything needing randomness or cross-chain functionality

The lottery is one example. The primitives work everywhere.

---

## What You Actually Built

Part 1: Smart contract. Provably fair lottery. Cross-chain prize distribution.

Part 2: Frontend. Makes the contract usable by actual humans.

Together: Complete application. Not a demo. Not a proof of concept. Real lottery. Real testnets. Real tokens.

You could deploy this to mainnet right now (with proper audits and testing, obviously). People could buy tickets. Winners could be selected fairly. Prizes could be claimed on any supported chain.

The mechanics are sound. The security is solid. The UX is clean.

And it’s all built on dcipher’s threshold cryptography primitives. No centralized oracles. No bridge multisigs. No trust beyond the math.

That’s what makes this interesting.

That’s what makes this interesting. Not the React code (standard). Not the Wagmi integration (well-documented). The fact that you can build applications with these guarantees without sacrificing UX.

Fair randomness that feels instant. Cross-chain transfers that feel native. Decentralization that’s invisible to users.

That’s where Web3 is headed. And you just built it.

---

## Next Steps

You’ve built a complete cross-chain lottery. Contract and frontend. Randomness and swaps. Everything works.

Now what?

**Experiment.** Change entry fees. Add prize tiers. Make recurring lotteries. Build leaderboards. Use NFT prizes instead of tokens.

**Extend.** Integrate other dcipher primitives. Add blocklock encryption for sealed-bid auctions. Use threshold signatures for DAO governance. Combine primitives in ways nobody’s tried yet.

**Deploy.** Take this to mainnet. Run a real lottery. See how it performs with real users and real money. Learn from what breaks.

**Build something new.** You understand the primitives now. Randomness. Cross-chain swaps. Threshold cryptography. Use them to solve different problems.

The lottery was just the beginning.

The primitives are yours now.

Go build something interesting.