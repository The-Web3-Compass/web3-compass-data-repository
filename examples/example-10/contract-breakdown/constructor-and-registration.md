## The Constructor: One-Time Setup

```solidity
constructor(
    address _routerAddress,
    uint256 _settlementChainId,
    address _settlementToken
) {
    require(_routerAddress != address(0), "Invalid router");
    require(_settlementToken != address(0), "Invalid token");

    router = IRouter(_routerAddress);
    settlementChainId = _settlementChainId;
    settlementToken = _settlementToken;
}
```

Runs once when you deploy. Sets the three immutable variables.

You pass in three things: `_routerAddress` (the only swaps router for this chain—different chains have different deployments but often same address), `_settlementChainId` (destination chain ID, usually Base with 8453 for mainnet or 84532 for Sepolia), and `_settlementToken` (the token merchants receive, usually USDC or USDT).

The validation is simple:

```solidity
require(_routerAddress != address(0), "Invalid router");
require(_settlementToken != address(0), "Invalid token");
```

Can't be zero addresses. Zero address means nothing, would break everything.

Notice we DON'T validate the chain ID. Any uint256 is technically valid. If you pass a bogus chain ID, the router calls will fail, but the contract won't break.

Here's what matters: once deployed, these values never change. All merchants on this contract instance settle to the same chain and token. If you want different settlement options, deploy multiple contracts.

This simplifies logic massively. No per-merchant routing decisions. No complex configuration. One contract → one settlement destination.

---

## Merchant Registration: The Onboarding Flow

```solidity
function registerMerchant(address _settlementAddress) external {
    require(_settlementAddress != address(0), "Invalid address");
    require(!merchants[msg.sender].isRegistered, "Already registered");

    merchants[msg.sender] = Merchant({
        isRegistered: true,
        settlementAddress: _settlementAddress,
        totalReceived: 0,
        pendingBalance: 0
    });

    emit MerchantRegistered(msg.sender, _settlementAddress);
}
```

Before receiving payments, merchants must register. One-time process.

Why require registration? It prevents accidental payments. If I mistype a merchant address and try to send them 1000 USDC, the transaction fails immediately. I don't lose money to a typo.

Also gives merchants control. They specify where funds go. Maybe their "merchant address" is a hot wallet for signing transactions, but they want payments to flow to cold storage.

Here's how it works: Merchant calls this function with their desired settlement address. Could be the same as `msg.sender`, could be different.

Contract checks two things. First, settlement address isn't address(0) (would burn funds). Second, this address isn't already registered (no re-registration).

Then creates a `Merchant` struct with `isRegistered = true`, their chosen settlement address, and zero balances (no payments yet).

Event emits. Frontends see it. Merchant is now ready to receive payments.

Merchants can also change where they receive payments:

```solidity
function updateSettlementAddress(address _newAddress) external {
    require(merchants[msg.sender].isRegistered, "Not registered");
    require(_newAddress != address(0), "Invalid address");
    merchants[msg.sender].settlementAddress = _newAddress;
}
```

Just call this function with the new address. Must be registered first. Must provide valid address. That's it.

Importantly: this doesn't affect existing pending payments. Those already have the old address baked into the swap request. Only future payments use the new address.

---
