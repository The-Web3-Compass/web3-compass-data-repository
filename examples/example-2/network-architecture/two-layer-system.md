## The Network Architecture (How the Pieces Actually Connect)

Here's where we stop being theoretical and get concrete. dcipher isn't one thing it's a coordination between two layers that work together.

### Layer One: Smart Contracts (The On-Chain Anchor)

On the blockchain side, you've got a collection of smart contracts. These aren't doing the cryptography blockchains are terrible at complex cryptography because gas costs explode. Instead, these contracts act as the **coordination and verification layer**.

Think of them as the public bulletin board and the judge rolled into one.

**What the contracts do:**

They track which operators are registered in the network. When someone wants to become a node operator, they register through the contract, stake collateral, and declare their availability. The contract keeps this registry public so anyone can see who's participating.

They manage committee formation. When a new committee needs to form (say, for a randomness job or a cross-chain verification task), the contracts coordinate which operators get assigned. This happens through on-chain logic that anyone can verify.

They hold deals between developers and operators. If you're a developer who wants to use dcipher's capabilities, you enter into a "deal" with a committee. The deal specifies what work needs to be done, how often, at what cost, and what the service level expectations are. All of this lives on-chain in the contract.

They verify threshold signatures. When the off-chain operators produce a signature (randomness, a cross-chain attestation, whatever), the contracts verify it. They check that the signature is valid against the committee's public key. If it's valid, the contracts execute the corresponding action releasing funds, recording randomness, updating state.

They enforce slashing. If operators misbehave failing to perform their duties, producing invalid signatures, going offline during critical operations the contracts slash their staked collateral. This is how economic security gets enforced.

**The important thing to understand:** The contracts aren't doing threshold cryptography. They're just verifying the outputs and coordinating the workflow. The heavy cryptographic lifting happens off-chain.

### Layer Two: Off-Chain Operators (The Cryptographic Engine)

On the other side, you have **node operators** running dcipher agents. These are the entities doing the actual threshold cryptography running DKG, computing threshold signatures, monitoring blockchains, generating randomness.

**What the operators do:**

They run Distributed Key Generation ceremonies to create shared keys for their committee. This happens through multi-party computation where each operator contributes randomness and receives a key share. At the end, the committee has a shared public key, but no individual operator knows the complete private key.

They monitor blockchain state. For jobs that require watching on-chain events (like cross-chain verification), operators run full nodes or use RPC providers to track what's happening. When the specified condition is met, they know it's time to act.

They compute threshold signatures. When a job needs to be executed, each operator uses their key share to create a partial signature. These partials get aggregated into a complete BLS signature that proves the committee reached consensus.

They participate in randomness generation. For verifiable randomness, each operator contributes entropy. The final random value is computed through threshold operations that guarantee no single operator could bias the outcome.

They handle conditional encryption. For Blocklock jobs, operators collectively generate decryption keys only after verifying that the on-chain condition has been met.

**The critical insight:** Operators never communicate the raw key shares. All coordination happens through cryptographic protocols that preserve the threshold property. Even if you compromised one operator completely read their memory, stole their disk, intercepted their network traffic you'd learn nothing useful without compromising threshold many others.

### How the Two Layers Work Together

Here's the full loop:

**Setup:** A developer deploys a deal contract specifying their requirements. "I need verifiable randomness every hour, delivered to this contract address, with a 5-of-7 threshold." Operators see this deal, stake collateral, and join the committee.

**DKG Ceremony:** The selected operators run DKG off-chain. Each contributes to creating the shared key. At the end, they publish the committee's public key to the on-chain contract. Now everyone knows this committee exists and what their public key is.

**Job Execution:** When it's time to generate randomness (or verify a cross-chain event, or decrypt data), the operators perform the work off-chain using their threshold key shares. They produce a BLS signature attesting to the result.

**Verification:** The signature gets submitted to the on-chain contract. The contract verifies it against the committee's public key. If valid, the contract accepts the result and executes whatever logic was specified in the deal.

**Settlement:** Operators get paid for successful job completion. If they failed or misbehaved, they get slashed.

The blockchain provides public verifiability, economic security, and tamper-proof coordination. The operators provide cryptographic security, computational power, and the actual threshold signatures. Neither layer needs to trust the other—they're bound by mathematics and economics.

---
