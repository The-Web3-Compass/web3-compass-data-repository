# **Storing Voters & Candidates**

## **Welcome to the Real Action!**

Right now, our voting contract is nothing more than an empty shell—it exists, but it doesn’t *do* anything. It’s like setting up an election with no candidates, no voters, and no way to count votes. In short, it’s useless. If we want to build a real, functional election system, we need to store and manage data effectively.

But here’s the catch: Solidity is *not* like traditional programming languages. In Python, JavaScript, or SQL, storing data is as simple as writing to a database or a file. Solidity, however, stores **everything** directly on the Ethereum blockchain, and every storage operation comes with a **gas cost**. If we store data inefficiently, users end up paying higher transaction fees. That means we need to be **smart** about how we store and retrieve voting information.

By the end of this lesson, you’ll know how to store voters, candidates, and voting results in a way that is both **efficient** and **cost-effective**. You’ll master:

- **Structs** – A way to group related data together.
- **Arrays** – A method to store multiple items in an ordered list.
- **Mappings** – A more efficient alternative to arrays for storing key-value pairs.
- **Tracking total candidates and votes** using counter variables.
- **Building a complete Solidity contract** that integrates everything we’ve learned.

Let’s break it down step by step.

---

## **Understanding Structs – Grouping Related Data**

### **Why Do We Need Structs?**

A voting system involves multiple pieces of related information. For example, a candidate in an election has:

- An **ID** to uniquely identify them.
- A **name** to display on the ballot.
- A **vote count** to track how many votes they have received.

Similarly, each voter has:

- A **registration status** indicating whether they are allowed to vote.
- A **voting status** showing whether they have already voted.
- A **chosen candidate ID** indicating who they voted for.
- An **age** to enforce a minimum voting requirement.

Handling all of these properties as **separate variables** would be messy and inefficient. Instead, Solidity allows us to group them together using **structs**.

### **Defining a Struct**

A **struct** in Solidity lets us create custom data types that bundle multiple properties into a single object.

### **Example: Declaring a Struct**

Let’s say we want to store information about cars. Instead of using separate variables for the brand and year, we can define a `Car` struct:

```solidity
 
struct Car {
    string brand;
    uint year;
}

```

Now, we can create and use a `Car` object like this:

```solidity
 
Car memory myCar = Car("Toyota", 2022);
string memory carBrand = myCar.brand; // "Toyota"

```

This allows us to keep related information together in a neat package.

### **Applying Structs to Our Voting Contract**

### **Defining a Candidate Struct**

To store candidate details efficiently, we define a `Candidate` struct:

```solidity
 
struct Candidate {
    uint id;
    string name;
    uint voteCount;
}

```

Instead of maintaining separate variables for candidate IDs, names, and vote counts, a **single variable** can now store all three properties in an organized way.

### **Defining a Voter Struct**

A voter also has multiple attributes, so we define a `Voter` struct:

```solidity
 
struct Voter {
    bool isRegistered;
    bool hasVoted;
    uint votedCandidateId;
    uint8 age;
}
```

Now, both **candidates and voters** have structured ways to store their details, making our contract cleaner and more manageable.

---

## **Using Arrays to Store Multiple Values**

### **Why Use Arrays?**

A struct allows us to store **one** item (one candidate or one voter). But elections involve **multiple candidates and many voters**, so we need a way to store a collection of these structs.

An array is a **list** that holds multiple values of the same type.

### **Declaring an Array**

Let’s start with a simple array that stores numbers:

```solidity
 
uint[] public numbers;
```

We can add values to this array using the `push` function:

```solidity
 
numbers.push(10);
numbers.push(20);
```

Now:

- `numbers[0]` returns `10`.
- `numbers[1]` returns `20`.

### **Declaring an Array of Structs**

Instead of storing just numbers, we can store multiple **Candidate** structs inside an array:

```solidity
 
Candidate[] public candidates;
```

Now, we can add multiple candidates like this:

```solidity
 
candidates.push(Candidate(1, "Alice", 0));
candidates.push(Candidate(2, "Bob", 0));
```

We can retrieve candidate details just like we do with numbers:

```solidity
 
string memory firstCandidate = candidates[0].name; // "Alice"
```

While arrays work, they have **major drawbacks** when used in Solidity.

---

## **The Limitations of Arrays**

Arrays are useful, but they have **three major issues** in Solidity:

### **1. Expensive Lookups**

Imagine an election with **10,000 voters**. If we store them in an array, checking if someone is registered means scanning through all **10,000 entries**, which is slow and costly in gas fees.

### **2. No Direct Key-Based Access**

With an array, we can only retrieve values by index (`candidates[0]`). But in a real voting system, we need to:

- Find a **candidate** by their unique **ID**.
- Look up a **voter** by their **Ethereum address**.

Arrays do not support key-based lookups, making searches inefficient.

### **3. Deletion is Inefficient**

If we remove a voter from an array, we must shift all elements to fill the gap, which consumes additional gas.

Because of these limitations, we need a **better way** to store data.

---

## **Using Mappings for Efficient Storage**

### **What Are Mappings?**

A **mapping** is a key-value store, similar to:

- **Dictionaries in Python (`dict`)**
- **Objects in JavaScript**

Mappings allow **instant lookups** without looping through thousands of entries.

### **Basic Example: A Mapping**

```solidity
 
mapping(address => uint) public balances;
```

This means each **Ethereum address** is linked to a **balance**.

Example usage:

```solidity
 
balances[msg.sender] = 100; // Assign balance of 100 to sender
uint userBalance = balances[msg.sender]; // Retrieve balance
```

Unlike arrays, mappings allow **instant retrieval**.

### **Storing Voters with a Mapping**

Since each voter has a **unique Ethereum address**, we use `address` as the key:

```solidity
 
mapping(address => Voter) public voters;
```

Adding a **voter**:

```solidity
 
voters[voterAddress] = Voter(true, false, 0, 25);
```

Retrieving **voter details**:

```solidity
 
bool isRegistered = voters[voterAddress].isRegistered;
```

### **Storing Candidates with a Mapping**

Each **candidate** has a unique **ID**, so we use `uint` as the key:

```solidity
 
mapping(uint => Candidate) public candidates;
```

Adding a **candidate**:

```solidity
 
candidates[candidateId] = Candidate(candidateId, "Alice", 0);
```

Retrieving a **candidate’s name**:

```solidity
 
string memory candidateName = candidates[candidateId].name;
```

Mappings provide **efficient** and **instant access**, making them ideal for our voting contract.

---

## **Tracking the Total Number of Candidates and Votes Cast**

Since mappings don’t have a built-in way to count entries, we use **counter variables**:

```solidity
 
uint public candidatesCount;
uint public totalVotes;
```

Every time a new candidate is added, we increment `candidatesCount`. When a voter casts a vote, we increment `totalVotes`.

---

## **Final Contract with Structs and Mappings**

Now, let’s update our contract while ensuring we keep everything from our previous version:

```solidity
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingContract {
    // Admin (Owner) of the contract
    address public admin;

    // Define a constant for the legal voting age
    uint8 public constant LEGAL_VOTING_AGE = 18;

    // Boolean to track voting status
    bool public votingOpen;

    // Total votes cast
    uint public totalVotes;

    // Struct for Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Struct for Voter
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedCandidateId;
        uint8 age;
    }

    // Mapping to store registered voters
    mapping(address => Voter) public voters;

    // Mapping to store candidates
    mapping(uint => Candidate) public candidates;

    // Total number of candidates
    uint public candidatesCount;

    // Constructor sets the contract deployer as the admin
    constructor() {
        admin = msg.sender;
    }
}
```

---

## **What’s Next?**

Now that we have a way to **store voters and candidates**, we need to allow the **admin to register voters and add candidates**.

In the next lesson, we’ll write functions to make our contract **interactive**, so the admin can actually **add candidates and register voters**.

Let’s keep building.