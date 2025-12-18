## Building Your First Randomness Consumer

We're going to build a tiny contract called **`DiceRoller,`** nothing fancy, just a clean example of how to request randomness from dcipher, receive the callback, and actually *use* the random value on-chain. It's small, approachable, and it demonstrates every moving part of the randomness flow without drowning you in complexity.

Think of this as the "hello world" of threshold randomness.

Create `contracts/DiceRoller.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {RandomnessReceiverBase} from "randomness-solidity/src/RandomnessReceiverBase.sol";

contract DiceRoller is RandomnessReceiverBase {
    bytes32 public latestRandomness;
    uint256 public latestRequestId;
    uint256 public rollCount;

    event DiceRolled(uint256 indexed requestId, address indexed roller);
    event RandomnessReceived(uint256 indexed requestId, bytes32 randomValue);

    constructor(address _randomnessSender, address _owner)
        RandomnessReceiverBase(_randomnessSender, _owner)
    {}

    function rollDice(uint32 callbackGasLimit) external payable returns (uint256) {
        (uint256 requestId, uint256 requestPrice) = _requestRandomnessPayInNative(callbackGasLimit);

        latestRequestId = requestId;
        rollCount++;

        emit DiceRolled(requestId, msg.sender);

        return requestId;
    }

    function onRandomnessReceived(uint256 requestId, bytes32 randomness) internal override {
        require(latestRequestId == requestId, "Unexpected request ID");

        latestRandomness = randomness;

        emit RandomnessReceived(requestId, randomness);
    }

    function getLatestDiceRoll() external view returns (uint256) {
        return (uint256(latestRandomness) % 6) + 1;
    }
}

```

That's the entire contract. Let's break it down piece by piece because there's more going on here than you might think.

### **Importing RandomnessReceiverBase**

```solidity
import {RandomnessReceiverBase} from "randomness-solidity/src/RandomnessReceiverBase.sol";
```

This import is the key to everything.

`RandomnessReceiverBase` is the helper contract provided by the dcipher SDK.

It handles:

- formatting randomness requests
- verifying threshold signatures
- receiving callback data
- dispatching the randomness to your contract

Without this import, you'd have to implement the entire request→response pipeline yourself.

With it, you only implement the part that matters: **what your contract does when randomness arrives**.

### Inheriting from RandomnessReceiverBase

```solidity
contract DiceRoller is RandomnessReceiverBase {

```

By inheriting from `RandomnessReceiverBase`, your contract gets internal functions for requesting randomness and the infrastructure to receive callbacks. The base contract handles all the messy details of talking to dcipher's `RandomnessSender` contract.

Think of `RandomnessReceiverBase` as a standardized interface. The dcipher network knows how to communicate with anything that inherits from it. You implement what to do with the randomness. The base contract implements how to get it.

### **State Variables**

```solidity
bytes32 public latestRandomness;
uint256 public latestRequestId;
uint256 public rollCount;
```

We're tracking three simple pieces of state:

- **`latestRandomness`** – the most recent random value returned by dcipher.
    
    It's stored as a `bytes32` because that's the raw output format of the threshold signature (32 bytes of cryptographic entropy).
    
- **`latestRequestId`** – the ID of the most recent randomness request.
    
    We use this to verify that the callback we receive corresponds to the request we initiated.
    
- **`rollCount`** – a basic counter that tracks how many times the dice has been rolled.

In a production system, you'd likely store randomness per user, per game round, or per request. You might also maintain mappings or queues for pending operations.

For this example, keeping things minimal makes it easier to understand the pattern.

---

### **The Constructor**

```solidity
constructor(address _randomnessSender, address _owner)
    RandomnessReceiverBase(_randomnessSender, _owner)
{}
```

The constructor takes two parameters:

- **`_randomnessSender`** — the address of dcipher's deployed `RandomnessSender` contract on your chosen network.
    
    This is the contract your consumer will interact with when making randomness requests.
    
    (Each network has its own address. check [dcipher's documentation](https://docs.dcipher.network/networks/randomness) for the correct one.)
    
- **`_owner`** — the designated owner of your consumer contract.
    
    This matters for subscription-based payment methods and administrative controls.
    

Both values are forwarded to the `RandomnessReceiverBase` constructor, and that's all the initialization you need.

### Requesting Randomness: rollDice()

```solidity
function rollDice(uint32 callbackGasLimit) external payable returns (uint256) {
    (uint256 requestId, uint256 requestPrice) = _requestRandomnessPayInNative(callbackGasLimit);

    latestRequestId = requestId;
    rollCount++;

    emit DiceRolled(requestId, msg.sender);

    return requestId;
}
```

When someone calls `rollDice()`, we're asking dcipher to generate a random number.

`_requestRandomnessPayInNative()` sends a randomness request to the dcipher network. The "PayInNative" part means we're paying directly with native tokens (ETH on Ethereum, MATIC on Polygon, etc.) sent as `msg.value`. That's why the function is `payable`.

The `callbackGasLimit` parameter matters because randomness delivery is asynchronous. When dcipher fulfills your request, it calls back into your contract. That callback costs gas, and you need to prepay for it. The `callbackGasLimit` tells the system how much gas to allocate.

How much should you set?

For simple contracts like this, **100,000 gas** is typically enough. More complex callbacks that write to multiple storage slots or perform heavier logic might need **200,000–300,000**.

Set it too low and your callback fails (but you can request again). Set it too high and you overpay… though unused gas isn't consumed.

The function returns two values: **`requestId`** and **`requestPrice`**.

`requestId` is the unique identifier for this randomness request — you'll see it again in the callback.

`requestPrice` tells you what you paid. If `msg.value` is insufficient, the transaction reverts.

We store the request ID because we'll need it to verify the callback. We increment the roll count, emit an event for transparency, and return the request ID so the caller knows what to wait for.

### Receiving Randomness: onRandomnessReceived()

```solidity
function onRandomnessReceived(uint256 requestId, bytes32 randomness) internal override {
    require(latestRequestId == requestId, "Unexpected request ID");

    latestRandomness = randomness;

    emit RandomnessReceived(requestId, randomness);
}
```

This is the callback. When dcipher generates your random value, this function gets called automatically. You must implement it (it's abstract in the base contract). You must mark it `internal override`.

Behind the scenes: The `RandomnessSender` contract calls your contract's `receiveRandomness()` function (implemented in `RandomnessReceiverBase`). That function verifies the threshold signature using the network's public key. If verification passes, it calls your `onRandomnessReceived()` implementation. If verification fails, transaction reverts.

By the time your code runs, you know the randomness is legitimate. No proof checking needed. No signature verification needed. If this function executes, the math already checked out. That's your security guarantee.

We sanity check with `require(latestRequestId == requestId)` to make sure this callback matches our most recent request. In more complex contracts you'd maintain a mapping of pending requests. For this example, checking the latest ID works fine.

Then we store the random value and emit an event. Done. Your contract now has cryptographically verified, unpredictable randomness sitting in storage.

### Using the Randomness: getLatestDiceRoll()

```solidity
function getLatestDiceRoll() external view returns (uint256) {
    return (uint256(latestRandomness) % 6) + 1;
}
```

We have randomness stored as `bytes32`. How do we turn that into a dice roll?

Cast it to `uint256` (256-bit unsigned integer), modulo 6 to get a remainder between 0-5, add 1 to get 1-6. Basic math but it works.

Worth noting: you have 32 bytes (256 bits) of entropy in that `bytes32`. Way more than you need for a single dice roll. You could extract multiple random values from one `bytes32` by using different byte ranges or bit shifts. Bits 0-7 for one outcome, bits 8-15 for another, etc. More gas-efficient than requesting new randomness for every decision.

But we're keeping it straightforward. One request, one random value, one dice roll.

---

## Compiling the contract

Before we deploy anything, we should quickly **compile the contract** to make sure everything is wired up correctly. Hardhat will pull in the Solidity compiler, resolve imports, and generate the ABI and bytecode that the deployment script relies on.

Run this from the project root:

```bash
npx hardhat compile
```

If something's wrong, maybe a missing import, a mismatched Solidity version, or an outdated SDK, you'll catch it here instead of halfway through a deployment transaction. 

A clean compile tells you the contract is valid, the `RandomnessReceiverBase` import is recognized, and your constructor matches what the dcipher SDK expects.

---
