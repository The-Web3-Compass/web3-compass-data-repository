#### Update Operation

---

Now that we can create and read entries, let's tackle the next part of CRUD: **Update**. The update function allows us to modify existing data within the contract. In this lesson, we'll add functionality to update details of a `Person` entry based on their unique ID.

1.  **Writing the Update Function**\
     Our `updatePerson` function will take in an ID, along with the new `name` and `age` values. It will locate the `Person` by their ID and update their details.

        Here's how our `updatePerson` function might look:





        `function updatePerson(uint id, string memory newName, uint newAge) public {
        Person storage person = peopleMap[id];
        person.name = newName;
        person.age = newAge;

    }`

        - **Parameters**: The function takes an ID (to locate the `Person`), a `newName`, and a `newAge`.
        - **Storage Reference**: Using `Person storage person = ...` allows us to update the `Person` entry directly in storage, rather than creating a copy.
        - **Updating Fields**: We then set `person.name` to `newName` and `person.age` to `newAge`.

2.  **Why Use `storage`?**\
    When dealing with structs, it's crucial to decide whether to use `storage` or `memory`:

    - **storage**: Directly points to the data stored on the blockchain. Any changes will be saved.
    - **memory**: A temporary copy used within the function; changes are not saved to the blockchain.

3.  **Testing the Update Operation in Remix**

    - Deploy the contract and add a few `Person` entries.
    - Use `updatePerson` with the correct ID to update the details of a `Person`.
    - Retrieve the updated `Person` with `getPerson` to confirm the changes.

**Practice Task**

- In `CRUDContract.sol`, add the `updatePerson` function and test it in Remix by modifying some entries and reading them back.
