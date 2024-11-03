#### Data Visibility

---

Understanding data visibility is crucial in Solidity, especially since smart contracts are on a public blockchain where anyone can interact with them. Solidity provides four levels of visibility for functions and variables:

1.  **public**: Accessible by anyone, including external accounts, other contracts, and internally within the contract itself.
2.  **internal**: Only accessible within the contract and derived contracts (i.e., contracts that inherit from it).
3.  **private**: Accessible only within the contract, not even by derived contracts.
4.  **external**: Accessible only by external accounts or other contracts, but not internally within the contract itself.

In our `getPerson` example, marking it as `public` means anyone can call it and retrieve the data by providing a valid ID. Since we want to allow easy access to data, public visibility works well here.

**Visibility Example**:

`uint private internalCount; // Only accessible within this contract
uint public externalCount; // Accessible by anyone`

**Practice Task**

- In your `CRUDContract.sol`, add another variable, `internalCount`, with `private` visibility and experiment by trying to access it in Remix. Observe the visibility restrictions.
