#### Error Handling Basics

---

In Solidity, error handling ensures the contract functions behave as expected, especially when interacting with user input. For example, if someone tries to update a `Person` who doesn't exist, we should prevent that action and notify them with an error.

1.  **Using `require` Statements**\
     Solidity offers `require` for validating conditions:

        `function updatePerson(uint id, string memory newName, uint newAge) public {
        require(id < peopleCount, "Person does not exist.");
        Person storage person = peopleMap[id];
        person.name = newName;
        person.age = newAge;

    }`

        - **`require(id < peopleCount, "Person does not exist.");`**: This line checks if the ID is valid. If not, the transaction is reverted with an error message.
        - **Why Use `require`?**: It's the simplest way to prevent invalid actions and save gas fees by stopping execution early if the condition fails.

2.  **Other Error Handling Options**

    - **`assert`**: Used primarily for checking internal errors or bugs, typically in complex calculations. If `assert` fails, something is very wrong.
    - **`revert`**: Can be used for custom error handling in combination with conditions, similar to `require`.

3.  **Practice Adding Error Handling**

    - In your `updatePerson` function, add a `require` statement to check if the `id` exists.
    - Experiment with incorrect IDs to see the error handling in action.

**Practice Task**

- In `CRUDContract.sol`, add error handling to the `updatePerson` function using `require`.
- Test with valid and invalid IDs in Remix to observe error handling.

---

#### Practice Task

**File:** `content/lesson5/update_practice_task.md`
