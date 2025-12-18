## What This Contract Actually Does (The Real Breakdown)

### The Inheritance Chain (And Why It Matters)

```solidity
contract CrossChainLottery is RandomnessReceiverBase, ReentrancyGuard {
```

We’re inheriting from two contracts here, and both are doing heavy lifting.

`RandomnessReceiverBase` is the dcipher randomness integration. This gives us the ability to request random numbers from the threshold network and receive callbacks when they’re ready. Without this, we’d be stuck with block hashes (manipulatable), timestamps (gameable), or external oracles (centralized). With it, we get cryptographically verifiable randomness that no single party can control.

`ReentrancyGuard` is OpenZeppelin’s standard protection against reentrancy attacks. Any function marked `nonReentrant` can’t be called recursively. This matters because we’re transferring tokens and changing state, which historically has been a massive attack vector in Ethereum contracts. Remember the DAO hack? Reentrancy. This guard prevents that entire class of exploits.

### The State Machine (Three States, One Flow)

```solidity
enum LotteryState { OPEN, DRAWING, CLOSED }
```

Every lottery moves through these three states in order. You can’t skip. You can’t go backwards.

**OPEN** → People can buy entries. The lottery is live. The prize pool is growing.

**DRAWING** → The lottery ended. We’ve requested randomness. We’re waiting for the dcipher network to generate the random value and call us back. Nobody can enter. Nobody can claim. We’re in limbo.

**CLOSED** → Winner has been selected. Prize is locked for them. They can claim whenever they want, either on Base or cross-chain.

This state machine prevents a whole category of bugs. You can’t draw a winner twice. You can’t claim before a winner exists. You can’t enter after the lottery ended. The contract enforces the flow at the type level.

### The Lottery Struct (Everything in One Place)

```solidity
struct Lottery {
    uint256 id;
    uint256 prizePool;
    uint256 entryFee;
    uint256 startTime;
    uint256 endTime;
    address[] participants;
    address winner;
    uint256 randomnessRequestId;
    bytes32 randomValue;
    LotteryState state;
    bool prizeClaimed;
}
```

This struct holds everything about a lottery. Not scattered across multiple mappings, not split between storage slots, just one coherent data structure.

The `participants` array is interesting. When you buy 3 entries, your address gets pushed three times. This means when we select a winner using `randomValue % participants.length`, buying more entries literally increases your chances proportionally. Simple. Fair. Transparent.

The `randomnessRequestId` connects our lottery to the dcipher callback. When `onRandomnessReceived` gets called, we use this ID to figure out which lottery the randomness is for. Critical for the async flow.

