## The Security Model (What Guarantees You Actually Get)

Security in a network like this isn't about "are the nodes honest?" It's about: what assumptions do you rely on to guarantee correctness?

### The Core Assumption

The system assumes that in every committee, **at least a threshold of nodes behave honestly**. For most committees, that threshold is set above 50%meaning you need a majority.

If that holds, the guarantees are strong:

No single node can bias the randomness.

No single node can reconstruct the private key.

No single node can fabricate a signature.

Cheating attempts get caught through cryptographic verification.

This is Byzantine Fault Tolerant (BFT). The protocol tolerates arbitrary failures nodes that crash, go silent, or actively try to sabotage.

### Economic Security Layer

On top of cryptography, dcipher adds economic security. Committee members stake tokens. If they misbehave producing invalid shares, going offline during critical operations, violating protocol rules they get slashed.

This creates a strong disincentive. Not only is it cryptographically hard to cheat, it's economically stupid to try.

The staking requirement also makes Sybil attacks expensive. You can't spin up 1000 fake nodes each requires locked capital.

### Committee Rotation

Committees rotate regularly. This prevents attackers from having time to corrupt a static set of nodes. By the time you've compromised a meaningful number, the network has moved to a new configuration.

Each committee has its own DKG and its own key. When they rotate out, key shares are destroyed. The key can never be reconstructed. Any secrets it protected remain secure even if every member gets compromised later.

Ephemeral. Disposable. Secure by design.

### Verification is Cheap, Creation is Hard

Because the output is a standard BLS signature, verification is cheap. Any chain that supports BLS (most chains) can verify dcipher outputs with a single signature check.

But creating that signature requires threshold cooperation, distributed key generation, Byzantine consensus, economic stakes, and cryptographic proofs. That's where the security lives making creation hard while keeping verification easy.

---
