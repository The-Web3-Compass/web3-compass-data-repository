# **Variables, Data Types & State Management**

## Storing Data

Now that we’ve set up our Solidity contract, it’s time to **explore how Solidity stores and manages data**. In any programming language, variables hold values that change throughout the program’s execution. But in Solidity, things work a little differently because **smart contracts run on a blockchain**.

Every variable in a Solidity smart contract is stored in one of two places:

1. **Blockchain Storage (State Variables)** – These are **permanently recorded on the blockchain** and cost gas to modify.
2. **Temporary Memory (Local Variables)** – These only exist while a function is running and **do not** get stored permanently.

In this lesson, we’ll cover:

- **State variables** – How Solidity stores data on the blockchain.
- **Basic Solidity data types** – Numbers, addresses, booleans, and more.
- **Constants** – Why they save gas and improve efficiency.
- **Declaring an admin** – Automatically assigning the contract owner.
- **Defining a fixed voting age** – Using a constant value.
- **Deploying the contract** – Checking stored values in Remix.

---

## **State Variables: Storing Data on the Blockchain**

A **state variable** is a variable that is **permanently stored on the blockchain**. This means that even after the contract execution is over, the data remains accessible.

State variables are declared **outside of functions** inside the contract and can be **read** by anyone if marked `public`.

Example:

```solidity

uint public myNumber = 42;
```

What happens when we deploy this contract?

- `myNumber` is **stored permanently** on the blockchain.
- Because it’s marked `public`, Solidity **automatically generates a  function to get this value (a getter function)** so that external users can access the value.
- Modifying `myNumber` in a transaction **costs gas** because Ethereum needs to store the new value.

In our voting contract, we need to **store important data** such as:

- The **admin** (who is allowed to register voters and candidates).
- The **legal voting age**, which should never change.

---

### **Solidity Data Types**

Just like other programming languages, Solidity supports **multiple types of variables** to store different types of data.

**1️⃣ Unsigned and Signed Integers (Numbers)**

Solidity provides two types of numbers:

- **Unsigned Integers (`uint`)** – Can only store **positive** numbers (`0` and above).
- **Signed Integers (`int`)** – Can store **both positive and negative** numbers.

```solidity
uint public positiveNumber = 100;  // Unsigned integer (only positive)
int public negativeNumber = -50;   // Signed integer (allows negative values)
```

We can also specify the **size** of integers to optimize gas usage:

- `uint8`, `uint16`, `uint32`, … `uint256` (default is `uint256`).
- The smaller the size, the **less storage space** it consumes, but at the cost of a smaller range of values.

```solidity
 
uint8 public smallNumber = 255;  // Maximum value for uint8
int16 public temperature = -273; // Signed integer with smaller range
```

In Ethereum, **`uint256` is the most commonly used integer type** because it’s optimized for the Ethereum Virtual Machine (EVM).

---

**2️⃣ Boolean (True/False Values)**

Booleans store **true or false** values. These are useful for conditions, such as checking if **voting is open** or if **a voter has already voted**.

```solidity
 
bool public votingOpen = false;

```

We will use booleans later in the contract to ensure that only **registered voters** can vote and that **voting can only happen during the election period**.

---

**3️⃣ Addresses (Ethereum Wallets & Smart Contracts)**

Ethereum uses **addresses** to represent **wallets and smart contracts**. Solidity provides the `address` type to store these addresses.

### **Example:**

```solidity

address public userWallet = 0x123456789abcdef123456789abcdef123456789a;
```

Addresses are crucial in Solidity because they allow us to track:

- Who deployed the contract (the **admin**).
- Who is voting (**registered voters**).
- Who owns the smart contract (**contract ownership**).

---

**4️⃣ Strings (Text Data)**

Solidity allows text storage using **strings**, but **they are expensive to store**. Unlike other languages, Solidity does not have efficient built-in string operations.

```solidity
 string public candidateName = "Alice";
```

To reduce storage costs, Solidity developers prefer **identifiers (like numbers) instead of long text** when possible.

---

**5️⃣ Bytes (Fixed-Length Data Storage)**

Solidity provides `bytes` for storing **binary data** more efficiently than strings.

- `bytes1` to `bytes32` → Fixed-size arrays that store raw data more efficiently.

```solidity
bytes32 public candidateID = "Alice";  // More efficient than a string
```

Bytes are useful for **storing cryptographic hashes** and unique identifiers.

---

## **Declaring the Contract Admin**

Every voting system needs an **administrator**—someone who has special permissions to **register voters** and **add candidates**. This role should be assigned **automatically to the deployer** of the contract.

We can store this in a **state variable** using the `address` data type:

```solidity
address public admin;
```

At this stage, the `admin` variable **does not yet have a value**. We need to assign it during contract deployment.

---

## **Assigning the Admin at Deployment**

In our voting system, we need an **admin**—someone who has special privileges like **adding candidates** and **starting the election**. Instead of manually assigning an admin, we can **automatically set it to the person who deploys the contract**.

To do this, we use a **constructor**.

### **What is a Constructor?**

A **constructor** is a special function in Solidity that runs **only once**, immediately when the contract is deployed. It’s typically used for **initializing contract state variables**, like setting up the admin.

Here’s how we define it:

```solidity

constructor() {
    admin = msg.sender;
}
```

### **Breaking It Down:**

1. **`constructor() { ... }`**
    - This is the **constructor function**.
    - It **automatically executes** during contract deployment.
    - Unlike other functions, a constructor **never needs to be manually called**.
2. **`msg.sender` – What Does It Mean?**
    - `msg.sender` is a **global variable** in Solidity.
    - It **always refers to the Ethereum address that initiated the transaction**.
    - In this case, `msg.sender` is **whoever deployed the contract**.
    - Since the constructor runs at deployment, the deployer's address gets stored as `admin`.

Now, the admin will be **set automatically** as soon as the contract is deployed.

---

## **Using Constants: Defining the Legal Voting Age**

Some values in a smart contract **should never change** once they are set. Solidity provides a way to enforce this through **constants**.

Using constants has two main benefits:

1. **Gas efficiency** – Solidity **optimizes constants**, so they **don’t consume storage space** like normal variables.
2. **Prevents modification** – Constants cannot be changed after deployment.

Since the **legal voting age** will always be **18**, we define it as a constant:

```solidity
uint8 public constant LEGAL_VOTING_AGE = 18;

```

Now, anyone interacting with the contract can call `LEGAL_VOTING_AGE` and receive the fixed value **18**.

---

## **Declaring the Voting Status and Total Votes**

Now that we’ve assigned an **admin** and defined the **legal voting age**, we need two additional variables to manage the **voting process and track the results**:

1. **`votingOpen` (boolean)** – A flag that determines if voting is currently allowed.
2. **`totalVotes` (unsigned integer)** – A counter that keeps track of how many votes have been cast.

### **1️⃣ `votingOpen` – Controlling When Voting is Allowed**

A **voting process should only happen within a specific time period**. Before an election begins, voters shouldn’t be able to vote, and once voting ends, new votes shouldn’t be accepted.

To handle this, we introduce `votingOpen`, a **boolean (`bool`)** variable that determines whether voting is currently active.

```solidity
bool public votingOpen;
```

**Breaking It Down:**

- **`bool`** – The Solidity data type for **true/false** values.
- **`public`** – Allows anyone to check if voting is currently open.
- **`votingOpen`** – The name of our variable that tracks the voting status.

**How Does `votingOpen` Work?**

- **By default, Solidity initializes booleans to `false`**. This means that when the contract is deployed, `votingOpen` will **automatically be false**, preventing users from voting.
- Later, we will create functions to **start** and **end** the voting process by updating `votingOpen` to `true` or `false`.

### **2️⃣ `totalVotes` – Tracking the Total Number of Votes**

A voting system needs to keep track of **how many votes have been cast**. We introduce `totalVotes` as an **unsigned integer (`uint`)** to count the total number of votes.

```solidity
uint public totalVotes;
```

**Breaking It Down:**

- **`uint`** – A **positive number** (unsigned integer). Since votes **cannot be negative**, we use `uint` instead of `int`.
- **`public`** – Allows external users (like a frontend) to check how many votes have been cast.
- **`totalVotes`** – The name of our variable that stores the total vote count.

**How Does `totalVotes` Work?**

- When the contract is **first deployed**, `totalVotes` is automatically set to `0` (default value for unsigned integers).
- Every time someone votes, `totalVotes` **increases by 1**.
- This helps in tracking the overall participation in the election.

## **Final Contract with Variables & Data Types**

After adding all the stuff that we have discussed so far, our final contract should look something like this

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

    // Example integer and string
    uint public totalVotes;

    // Constructor sets the contract deployer as the admin
    constructor() {
        admin = msg.sender;
    }
}

```

---

## **Deploying & Checking Values in Remix**

Now let’s **deploy the contract** and verify the values using Remix.

1. **Compile the contract** in Remix.
2. **Deploy** the contract.
3. **Check values** by clicking on the variable names in the **Deployed Contracts** section.


<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/buildlab/art-of-writing-a-contract/images/lesson-3/interacting-with-contract.gif" alt="Node" width="600" height="350" />
</p>

---

## **Recap: What We Learned**

✅ Solidity supports **multiple data types**, including integers, booleans, addresses, and strings.

✅ **State variables** store information **permanently** on the blockchain.

✅ The **admin is automatically assigned** at deployment using `msg.sender`.

✅ **Constants** are gas-efficient and **cannot be changed**.

---

## **Next Lesson: Storing Voters & Candidates**

Now that we know how to store data, let’s take it further by storing **voter and candidate details** using **structs and mappings**.

Let’s move forward!