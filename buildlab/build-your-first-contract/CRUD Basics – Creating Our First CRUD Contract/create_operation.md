#### Create Operation

---

Let's start with the first CRUD operation: **Create**. We'll write a function that creates a new `Person` and adds it to our `people` array.

1.  **Writing the Create Function**\
    We'll define a `createPerson` function that takes in a `name` and `age`, then adds a new `Person` to our `people` array:

    `uint public peopleCount = 0;

    function createPerson(string memory name, uint age) public {
    people.push(Person(name, age, msg.sender));
    peopleMap[peopleCount] = Person(name, age, msg.sender);
    peopleCount++;
    }`

    - `people.push(...)` adds a new `Person` to the `people` array.
    - `peopleMap[peopleCount] = ...` adds the same `Person` to the mapping, using `peopleCount` as the unique ID.
    - `msg.sender` represents the address of the person calling this function, allowing us to capture who created this `Person`.

2.  **Understanding Memory and Storage**

    - **Memory**: Temporary storage used only within the function call.
    - **Storage**: Permanent storage used to store data on the blockchain.
    - In our function, `name` and `age` are stored in memory, while the array/mapping data is in storage.

**Practice Task**

- In `CRUDContract.sol`, complete the `createPerson` function.
- Deploy the contract on Remix, and use the function to create a few people.

---

#### Practice Task

**File:** `content/lesson3/create_practice_task.md`
