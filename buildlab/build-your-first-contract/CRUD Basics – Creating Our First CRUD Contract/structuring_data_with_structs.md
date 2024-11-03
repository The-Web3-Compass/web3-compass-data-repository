#### Structuring Data with Structs

---

We're about to create a basic CRUD (Create, Read, Update, Delete) system in Solidity, but first, let's talk about how to structure data in a way that makes sense. Solidity provides a useful feature called a **struct**, which allows us to group related data together.

Think of a `struct` as a blueprint for an object. For example, if we're building a system to keep track of people, each person can have properties like `name`, `age`, and `wallet address`.

1.  **Defining a Struct**\
     Here's how to define a `struct` in Solidity:

        `struct Person {
        string name;
        uint age;
        address wallet;

    }`

        This `Person` struct will help us store and organize the data related to each person.

2.  **Using the Struct**\
    Once we have defined the `Person` struct, we can use it to create variables of type `Person` within our contract.

3.  **Storing Multiple People**\
    To store multiple `Person` entries, we'll use an **array** or **mapping**, which we'll discuss next.

**Practice Task**

- In a new file called `CRUDContract.sol`, define a contract named `CRUDContract`.
- Define a `Person` struct with `name`, `age`, and `wallet` as shown above.
- This struct will serve as the foundation of our CRUD operations.
