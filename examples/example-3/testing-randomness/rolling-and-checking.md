## Rolling the Dice (Your First Real Randomness Request)

Your contract is deployed. The dcipher network is watching. Let's request some randomness.

Create `scripts/rollDice.js`:

```tsx

async function main() {
  const diceRollerAddress = "<YOUR DICE ROLLER CONTRACT ADDRESS>";
  const diceRoller = await ethers.getContractAt("DiceRoller", diceRollerAddress);

  const callbackGasLimit = 100000;

  // Increase if needed — revert means price was too low
  const valueToSend = ethers.parseEther("0.0003");

  console.log("Rolling the dice...\\n");

  const tx = await diceRoller.rollDice(callbackGasLimit, {
    value: valueToSend,
  });

  console.log("tx hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("confirmed in block:", receipt.blockNumber);

  // Try to find DiceRolled event
  let parsedEvent = null;

  for (const log of receipt.logs) {
    try {
      const parsed = diceRoller.interface.parseLog(log);
      if (parsed.name === "DiceRolled") {
        parsedEvent = parsed;
        break;
      }
    } catch {
      /* ignore non-DiceRoller logs */
    }
  }

  if (!parsedEvent) {
    console.log("DiceRolled event not found — but transaction succeeded.");
    return;
  }

  console.log("Request ID:", parsedEvent.args.requestId.toString());
  console.log("\\nNow wait 10–30 seconds, then run checkRandomness.js");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

```

This script does one thing: it sends a randomness request to your deployed `DiceRoller` contract.

It connects to the contract, tells it how much gas dcipher should use when calling back, attaches a bit of ETH to pay for the request, and sends the transaction. Once the transaction is confirmed, the script looks through the logs to find the `DiceRolled` event and extracts the `requestId`.

That's it.

After this script runs, the dcipher network picks up your request, starts generating the threshold signature in the background, and your contract will get the randomness a few seconds later

Now, go ahead and Run it:

```bash
npx hardhat run scripts/rollDice.js --network baseSepolia
```

Your request is now in the wild. The dcipher network operators saw your event and started their threshold signing process. Multiple nodes independently generating partial signatures. Those partials getting aggregated into one complete signature. That signature becoming your randomness.

Now you wait. Usually 10-30 seconds. Sometimes longer if the network is busy.

### Checking Your Result

Once you've requested randomness, the dcipher network processes it in the background. To see whether your contract has already received the callback, run this small script.

Create `scripts/checkRandomness.js`:

```tsx
async function main() {
  const diceRollerAddress = "<YOUR DICE ROLLER CONTRACT ADDRESS>";
  const diceRoller = await ethers.getContractAt("DiceRoller", diceRollerAddress);

  const latestRandomness = await diceRoller.latestRandomness();

  if (latestRandomness === ethers.ZeroHash) {
    console.log("Randomness not received yet. Wait a bit longer...");
    return;
  }

  console.log("Randomness received:", latestRandomness);

  const diceRoll = await diceRoller.getLatestDiceRoll();
  console.log("Dice roll:", diceRoll.toString());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

```

This script simply checks whether your contract has been called back by dcipher yet.

1. It connects to your deployed `DiceRoller` contract.
2. Reads `latestRandomness` from storage.
3. If the callback hasn't happened, the value will still be `0x00…00`, so it tells you to wait.
4. If randomness *has* arrived, it prints the raw 32-byte random value.
5. Then it calls `getLatestDiceRoll()` to convert that value into a number between 1 and 6 and prints your dice roll.

Nothing fancy, just a quick way to confirm the end-to-end flow is working.

### Run the script

```bash
npx hardhat run scripts/checkRandomness.js --network baseSepolia
```

If the randomness hasn't arrived yet, wait a bit and run it again. Once it shows a real value, you know the whole request → threshold signing → callback pipeline worked.

---

> 💡 You can find the complete code here: [https://github.com/The-Web3-Compass/dcipher-by-example](https://github.com/The-Web3-Compass/dcipher-by-example)

---
