# **Access Control – Using Modifiers**

## Total Control !

In the previous lesson, we implemented the `addCandidate()` and `registerVoter()` functions, allowing candidates to enter the election and voters to register. However, there is a major issue: **anyone can call these functions**, meaning any user on the blockchain can register candidates or voters.

This creates the following problems:

- Someone could **add fake candidates** with random names.
- Any user could **register voters**, even if they are not authorized.

To **prevent unauthorized access**, Solidity provides **modifiers**, which allow us to enforce rules before executing a function.

By the end of this lesson, you will be able to:

- Understand **what function modifiers are** and how they work.
- Learn how to **use the `require()` statement** to enforce conditions.
- Implement an `onlyAdmin` modifier to restrict sensitive functions.
- Apply the modifier to `addCandidate()` to ensure **only the admin** can add candidates.
- Apply the `onlyAdmin` modifier to `registerVoter()`, along with a **minimum voting age check**.

---

## **Understanding Function Modifiers**

A **modifier** in Solidity is a reusable piece of code that **runs before** a function executes. It allows us to **add conditions** to functions, such as restricting access to the contract administrator.

Instead of writing the same access control logic in multiple functions, we define a **modifier** once and apply it wherever needed.

### **How Modifiers Work**

Modifiers help enforce **rules and restrictions** before executing function logic. For example:

- Ensuring that **only the admin** can add candidates and register voters.
- Preventing certain functions from running under **invalid conditions**.

### **Basic Structure of a Modifier**

A modifier follows this structure:

```solidity
 
modifier modifierName() {
    // Logic to enforce before function execution
    _;
}
```

The **underscore (`_`)** is important. It represents the **original function code**, meaning that Solidity will execute the modifier logic **before** running the actual function.

---

## **Using `require()` to Enforce Conditions**

Before we implement modifiers, we need to understand `require()`.

### **What is `require()`?**

`require()` is a built-in Solidity function that **checks if a condition is met**. If the condition is **false**, the function stops execution and **reverts the transaction**, preventing any changes.

It is commonly used for:

- **Access control** – ensuring only authorized users can call a function.
- **Input validation** – making sure function parameters are valid.
- **State conditions** – ensuring certain operations can only occur under specific conditions.

### **Example of `require()` in a Function**

```solidity
 
function setAdmin(address _admin) public {
    require(_admin != address(0), "Invalid address");
    admin = _admin;
}
```

This function ensures that the `_admin` address is **not** `0x0` (an invalid address) before setting it.

Now, let's use `require()` to **restrict access** to certain functions.

---

## **Implementing the `onlyAdmin` Modifier**

### **Why Do We Need This Modifier?**

Right now, **anyone** can call `addCandidate()`. We need to **restrict this function** so that only the **contract administrator** can execute it.

To achieve this, we will:

1. **Declare an admin variable** to store the admin’s address.
2. **Create an `onlyAdmin` modifier** to restrict certain functions.
3. **Apply the modifier** to `addCandidate()`.

### **Step 1: Defining the Admin Variable**

First, we define a **state variable** to store the admin's address.

```solidity
 
address public admin;
```

The `admin` variable will hold the Ethereum address of the person who deployed the contract.

We set the `admin` variable in the constructor so that **whoever deploys the contract automatically becomes the admin**.

```solidity
 
constructor() {
    admin = msg.sender; // The deployer of the contract becomes the admin
}
```

### **Step 2: Creating the `onlyAdmin` Modifier**

Now, let's define a modifier that **only allows the admin to call a function**.

```solidity
 
modifier onlyAdmin() {
    require(msg.sender == admin, "Only admin can call this function");
    _;
}
```

### **How It Works**

1. `msg.sender` represents the **Ethereum address calling the function**.
2. `require(msg.sender == admin, "Only admin can call this function")` ensures that only the admin can proceed.
3. If `msg.sender` is **not** the admin, the function **reverts** with an error message.
4. If the condition is met, `_;` executes the **original function code**.

---

## **Applying `onlyAdmin` to `addCandidate()`**

Now that we have the `onlyAdmin` modifier, we apply it to `addCandidate()`.

### **Updated `addCandidate()` Function**

```solidity
 
function addCandidate(string memory _name) public onlyAdmin {
    candidatesCount++;
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
}
```

Now, only the **admin** can add candidates.

---

## **Applying `onlyAdmin` to `registerVoter()` and Adding Age Restriction**

Now that `addCandidate()` is restricted to the admin, we do the same for `registerVoter()`. However, we also need to **enforce a minimum voting age**.

### **Step 1: Define a Constant for the Legal Voting Age**

Since the **legal voting age is fixed**, we define it as a constant at the beginning of the contract.

```solidity
 
uint8 public constant LEGAL_VOTING_AGE = 18;
```

- `uint8` is used since age is always a small positive number.
- `constant` ensures that the value **cannot be changed after deployment**.

### **Step 2: Enforce the Age Restriction in `registerVoter()`**

We add a `require()` statement to check if the voter's age is **greater than or equal to** `LEGAL_VOTING_AGE`.

```solidity
 
function registerVoter(address _voter, uint8 _age) public onlyAdmin {
    require(_age >= LEGAL_VOTING_AGE, "Voter must be at least 18 years old");
    voters[_voter] = Voter(true, false, 0, _age);
}
```

### **Explanation**

- The function **first checks** if the voter's age meets the **minimum requirement**.
- If `_age` is **less than** `LEGAL_VOTING_AGE`, execution is **stopped**, and the transaction is **reverted** with an error message.
- If the voter is eligible, their details are **stored** in the `voters` mapping.

---

## **Final Updated Contract**

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

    // Modifier to restrict function access to only the admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Function to add a candidate (restricted to admin)
    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Function to register a voter (restricted to admin)
    function registerVoter(address _voter, uint8 _age) public onlyAdmin {
        require(_age >= LEGAL_VOTING_AGE, "Voter must be at least 18 years old");
        voters[_voter] = Voter(true, false, 0, _age);
    }
}
```

## **Deploying and Testing the Contract in Remix**

Now that we have implemented access control and validation, it's time to **deploy and test the contract in Remix**.

### **Steps to Deploy and Test**

1. **Open Remix** and create a new file named `VotingContract.sol`.
2. **Copy and paste the contract code** into the file.
3. **Compile the contract** by selecting the **Solidity Compiler** tab and clicking **Compile VotingContract.sol**.
4. **Deploy the contract** using the **Deploy & Run Transactions** tab:
5. **Test the functions**:
    - Call `addCandidate("Alice")` and `addCandidate("Bob")`.
    - Call `registerVoter(0xYourEthereumAddress, 25)`.
    - Verify that the candidates and voters are correctly stored by checking the mappings.
6. **Attempt to call restricted functions from a different address**:
    - Switch to a different account in Remix.
    - Try calling `addCandidate()` or `registerVoter()`—the transaction should fail with `"Only admin can call this function"`.

<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/buildlab/art-of-writing-a-contract/images/lesson-6/switch-accounts.gif" alt="Node" width="600" height="350" />
</p>

## **Next Steps**

Now that we have **proper access control and validation**, our contract lacks **visibility into events** such as candidate additions or voter registrations.

In the next lesson, we will introduce **Solidity events**, which allow us to **log important actions on the blockchain** for better transparency and tracking.