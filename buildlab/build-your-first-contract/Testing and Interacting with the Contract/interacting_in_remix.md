#### Interacting with the Contract in Remix

---

Now that our CRUD contract is complete, it's time to test and interact with it in Remix! This step will allow us to see our functions in action and check if everything works as expected.

1.  **Deploying the Contract**

    - Go to the **Deploy & Run Transactions** tab in Remix.
    - Choose the appropriate environment (e.g., **JavaScript VM** for local testing).
    - Click **Deploy**. This will compile and deploy your contract, making it available to interact with.

2.  **Using the Remix UI to Call Functions**\
    After deployment, you'll see a list of your contract's functions and state variables in Remix's UI.

    - **Create**: Use the `createPerson` function to add new entries. Enter values for `name` and `age`, then hit **transact** to execute the function.
    - **Read**: Retrieve data by calling `getPerson` with an ID. The data should appear directly in the output.
    - **Update**: Modify entries with `updatePerson`. Enter the `id`, `newName`, and `newAge` values and click **transact** to confirm the update.
    - **Delete**: Use `deletePerson` with an ID to remove a specific entry.

3.  **Observing Gas Costs**\
    Each transaction will show the **gas cost** required for the operation. Create and update operations typically cost more gas than read operations because they modify the blockchain's state.

**Practice Task**

- Deploy your contract and create a few entries.
- Call each CRUD function in Remix and observe the results.
- Pay attention to the gas costs for different operations.
