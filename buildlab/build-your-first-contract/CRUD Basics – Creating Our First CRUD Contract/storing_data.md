#### Storing Data in Arrays and Mappings

---

Now that we have a `Person` struct, let's look at ways to store multiple `Person` entries. Solidity provides two main data structures for storing collections of items: **arrays** and **mappings**.

1.  **Arrays**\
    Arrays are ordered collections of items. An array of `Person` structs would look like this:

    `Person[] public people;`

    Here, `people` is an array where each element is of type `Person`. We'll use this to store each new `Person` we create.

2.  **Mappings**\
    Mappings work like dictionaries or hash tables. They allow us to map a unique key to a value, making it easy to look up entries:

    `mapping(uint => Person) public peopleMap;`

    Here, each `Person` struct is mapped to a unique ID of type `uint`.

**Practice Task**

- In `CRUDContract.sol`, add an array called `people` to store `Person` entries.
- Add a mapping called `peopleMap` that maps `uint` IDs to `Person` entries.
