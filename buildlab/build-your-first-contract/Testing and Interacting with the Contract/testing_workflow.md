#### Testing Workflow

---

Testing is a crucial part of smart contract development. With our CRUD functions in place, here's a suggested workflow for testing each function:

1.  **Initial Setup**

    - First, create a few entries using `createPerson`.
    - Use `getPerson` to confirm the data was stored correctly.

2.  **Test Edge Cases**

    - Try calling `updatePerson` with an invalid ID (e.g., an ID that hasn't been created) and observe the error handling.
    - Test the `deletePerson` function with both valid and invalid IDs to ensure it's working as expected.

3.  **Use Soft Deletes (Optional)**

    - If you added a `soft delete` mechanism in Lesson 6, test that entries marked as "inactive" are not returned in search functions.
    - Confirm that your contract only allows active entries to be updated.

4.  **Monitoring Gas Efficiency**

    - Compare gas usage between `createPerson`, `updatePerson`, and `deletePerson`.
    - Consider any optimizations for functions that consume the most gas.

**Practice Task**

- Follow the testing workflow above to test each CRUD function and ensure all edge cases are covered.
- Note any gas optimizations you'd like to consider for future improvements.
