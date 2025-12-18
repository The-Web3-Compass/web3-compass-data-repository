## DKG: The Engine That Makes It All Possible

If threshold signatures are the output, **Distributed Key Generation (DKG)** is the ceremony that creates the infrastructure to produce that output.

### What DKG Actually Does

A group of nodes collaboratively generates a key pair without any of them ever seeing the complete private key.

Each node contributes randomness. Those contributions combine into a polynomial. The polynomial defines the key structure. But the private key is never reconstructed signatures are generated directly from the shares.

This was covered in detail in the previous chapter, but here's the operational reality:

### The DKG Ceremony in Practice

**Phase 1: Setup**

When a new committee forms, the operators who'll be members connect to each other through a peer-to-peer network. They've already registered on-chain and staked collateral.

**Phase 2: Share Distribution**

Each operator generates a secret polynomial locally. They commit to this polynomial (using cryptographic commitments like Feldman's VSS), then send shares of their polynomial to each other operator over encrypted channels.

**Phase 3: Verification**

Each operator verifies that the shares they received are consistent with the public commitments. If an operator sends invalid shares, others can prove it and the invalid operator gets kicked out (and slashed).

**Phase 4: Key Reconstruction**

Each operator combines all the valid shares they received. This becomes their key share. The public key is computed by combining all the public commitments. This public key gets published to the on-chain registry.

**Phase 5: Operational**

The committee is now live. They have a shared public key, each holds a private key share, and they can start producing threshold signatures.

### Why This Matters

Without DKG, dcipher wouldn't be permissionless. There's no trusted dealer generating and distributing keys. The committee creates their own cryptographic identity through a protocol that doesn't require trusting any participant.

If you want to form a committee with your own security parameters, you just run DKG with the operators you choose. The network doesn't gate keep this the math works regardless of who's participating.

DKG happens separately for each committee. There's no global master key. When a committee dissolves, their key effectively disappears—the shares are destroyed and the key can never be reconstructed.

---
