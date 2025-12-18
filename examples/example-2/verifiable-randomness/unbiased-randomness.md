## Verifiable Randomness

Trying to understand dcipher through its features is a trap. You need to think in terms of **capabilities** primitives you can compose into whatever your protocol needs.

### Why Randomness Is Hard

Randomness isn't a cute feature. It's structural. If your randomness can be influenced, you don't have a fair protocol you have a system quietly waiting to be exploited.

Lotteries, NFT reveals, game mechanics, validator selections, sequencing logic everything depends on randomness that adversaries cannot steer. And the usual toolbox isn't great:

**Block hashes are manipulable.** Miners can choose not to publish a block if the hash doesn't favor them.

**Server-based RNG is a trust problem.** You're asking people to believe the server operator isn't peeking.

**VRFs solve a narrow problem but collapse into a single point of failure** if the VRF generator is compromised.

### How dcipher's Randomness Works

dcipher generates randomness through a distributed protocol where no participant ever learns the final output until everyone does.

**The Play-by-Play:**

**Step 1: Entropy Contribution.** Each committee member generates their own random contribution locally. They commit to this contribution cryptographically before revealing it basically hashing it and publishing the hash.

**Step 2: Commitment Verification.** Once all commitments are in, the reveals happen. Each operator publishes their actual random value. If anyone's reveal doesn't match their commitment, the protocol catches them and they get slashed.

**Step 3: Threshold Aggregation.** The final randomness is computed by combining all valid contributions through threshold operations using BLS signatures. Each operator creates a partial signature over the combined entropy. The partials aggregate into one signature that proves the randomness was generated correctly.

**Step 4: On-Chain Verification.** The aggregated signature gets submitted to the smart contract along with the random value. The contract verifies the signature, confirming that threshold many operators agreed on this randomness. If valid, it accepts the randomness and makes it available to applications.

Because the threshold is typically set above 50%, you'd need to corrupt a majority of the committee to influence the output. And even then, you can't predict the result you can only try to bias it, which the cryptographic verification catches.

### What This Enables

Gaming systems that can't be rigged. Fair matchmaking. Randomized loot drops. Card shuffles that no player can predict or manipulate.

NFT mints that can't be influenced. No more sniping the rare traits because you can see the randomness before committing. The reveal happens fairly for everyone, simultaneously.

Validator selections nobody can bribe. Randomness determines who validates the next block, unpredictably.

This extends systems like drand (which dcipher's parent organization, Randamu, also maintains), but where drand relies on a fixed collective, dcipher is permissionless. Anyone can spin up a committee with custom trust assumptions.

### Why Randomness Matters (More Than People Admit)

Randomness isn't a cute feature. It's structural. If your randomness can be influenced, you don't have a fair protocol you have a system quietly waiting to be exploited.

Lotteries, NFT reveals, game mechanics, validator selections, sequencing logic, probabilistic algorithms everything depends on randomness that adversaries cannot steer. And the usual toolbox isn't great.

**Block hashes are manipulable.** Miners can choose not to publish a block if the hash doesn't favor them. The cost is giving up block rewards, but for high-value outcomes, that trade-off might be worth it.

**Server-based RNG is a trust problem.** You're asking people to believe that the server operator isn't peeking at the random number before revealing it, or isn't colluding with participants to rig outcomes.

**Delay functions are clever but impractical** for most real-world workloads. They work by making the computation take a predictable amount of time, but that time is often too long for applications that need fast randomness.

**VRFs solve a narrow problem but collapse into a single point of failure** if the VRF generator is compromised or corrupted.

dcipher generates randomness through a distributed protocol where no participant ever learns the final output until everyone does. The bias resistance is baked into the process—not stapled on afterward—and the proof is native.

Here's the play-by-play: Each committee member generates their own random contribution locally. They commit to this contribution cryptographically before revealing it. Once all commitments are in, the reveals happen. If anyone's reveal doesn't match their commitment, the protocol catches them and they get slashed. The final randomness is computed by combining all valid contributions through threshold operations.

Because the threshold is typically set above 50%, you'd need to corrupt a majority of the committee to influence the output. And even then, you can't predict the result you can only try to bias it, which the cryptographic verification catches.

This is randomness you can reason about cryptographically rather than politically. No trust assumptions beyond "the majority of the committee isn't colluding." And that assumption is enforced by economics (staking requirements), cryptography (threshold signatures), and verification (public proofs).

---
