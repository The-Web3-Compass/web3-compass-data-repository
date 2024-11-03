#### Delete Operation

---

We've reached the final CRUD operation: **Delete**. In this lesson, we'll create a function to remove data from our contract. In Solidity, deleting data requires some creativity, especially when dealing with arrays.

1.  **Writing the Delete Function**\
     To delete a `Person` entry from `peopleMap`, we can set the entry to its default state, effectively removing its data. Here's what our `deletePerson` function might look like:

        `function deletePerson(uint id) public {
        require(id < peopleCount, "Person does not exist.");
        delete peopleMap[id];

    }`

        - **Parameters**: The function takes an ID to locate and delete the `Person`.
        - **`delete` Keyword**: Using `delete` sets the struct back to its default state.
        - **Error Handling**: We use `require` to ensure the ID exists.

2.  **Deleting from an Array**\
     If we're storing people in an array (like `people`), deleting an item creates a "gap." To handle this, we can replace the deleted item with the last item in the array:

        `function deletePersonInArray(uint index) public {
        require(index < people.length, "Index out of bounds");
        people[index] = people[people.length - 1];
        people.pop();

    }`

        - **Replacing with Last Item**: This swaps the item to be deleted with the last item, then removes the last item to avoid a gap.
        - **Efficiency**: This technique is efficient, but it doesn't preserve order. If order matters, we'd need a more complex solution.

3.  **Testing the Delete Operation in Remix**

    - Deploy your contract.
    - Use `createPerson` to add a few entries.
    - Call `deletePerson` and `deletePersonInArray` to remove entries and check if they're deleted as expected.

**Practice Task**

- In `CRUDContract.sol`, add the `deletePerson` and `deletePersonInArray` functions.
- Deploy the contract in Remix, create a few `Person` entries, and test both delete functions.
