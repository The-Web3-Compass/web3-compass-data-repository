# **Adding Candidates & Voters**

## **Introduction**

So far, we have established the foundation of our voting contract:

- Defined **state variables** to store essential election data.
- Created **structs** to organize voter and candidate details efficiently.
- Used **mappings** to store and retrieve voter and candidate information.

At this point, the contract can store data, but it does not allow any interaction. It is like setting up an election where no candidates can register and no voters can sign up. To make the contract functional, we need **functions**, which allow users to interact with the contract.

By the end of this lesson, you will be able to:

- Understand **what functions are** and how they work in Solidity.
- Learn about **function visibility** (`public`, `private`, `internal`, `external`).
- Understand **view and pure functions** and when to use them.
- Implement the `addCandidate()` function to allow candidates to enter the election.
- Implement the `registerVoter()` function to allow voters to sign up.
- Deploy and test the contract in **Remix**.

---

## **Understanding Functions in Solidity**

A function in Solidity is a block of reusable code that executes a specific task when called. Functions allow us to:

- Retrieve data from the contract, such as the number of candidates registered.
- Modify contract data, such as adding a new voter.
- Enforce logic, such as making sure only eligible voters can register.

Functions allow users to interact with a smart contract, enabling dynamic behavior rather than just storing static data.

---

## **Structure of a Solidity Function**

A function in Solidity follows a structured format:

```solidity

function functionName(parameters) visibility returns (returnType) {
    // Function logic
}
```

### **Breakdown of a Function**

1. **Function Name** – The identifier used to call the function.
2. **Parameters** – Inputs required for execution, if any (e.g., a candidate's name).
3. **Visibility** – Specifies who can access the function.
4. **Return Type (Optional)** – If the function returns data, its type must be specified.
5. **Function Logic** – The actual code that runs when the function is executed.

---

## **Function Visibility in Solidity**

Function visibility determines who can call a function and from where. Solidity provides four types of function visibility:

### **Public Functions (`public`)**

- Can be called from anywhere, both inside and outside the contract.
- If applied to a state variable, Solidity automatically creates a getter function for it.

### Example:

```solidity

function getCandidate(uint _id) public view returns (string memory) {
    return candidates[_id].name;
}
```

This function can be called externally to retrieve a candidate’s name.

---

### **Private Functions (`private`)**

- Can only be accessed within the same contract.
- Cannot be called by external users or child contracts.
- Typically used for internal calculations or helper functions that do not need external access.

### Example:

```solidity

function _generateCandidateId() private view returns (uint) {
    return candidatesCount + 1;
}
```

This function generates a candidate ID but cannot be accessed outside the contract.

---

### **Internal Functions (`internal`)**

- Similar to `private`, but can also be accessed by contracts that inherit from the current contract.
- Useful for sharing logic between a parent and child contract.

### Example:

```solidity

function _internalHelperFunction() internal pure returns (string memory) {
    return "This is an internal function";
}
```

This function can be accessed by any contract that inherits from this one.

---

### **External Functions (`external`)**

- Can only be called from outside the contract.
- More gas-efficient than `public` when accessed externally.
- Best used for functions that should only be executed via transactions and not by other functions inside the contract.

### Example:

```solidity

function addCandidate(string memory _name) external {
    // Logic here...
}
```

This function can only be called externally, not from within the contract itself.

---

## **View and Pure Functions**

Some functions do not modify contract data but only return information. Solidity optimizes such functions to reduce gas costs.

### **View Functions (`view`)**

- Read data from the contract but do not modify it.
- Do not require gas when called from another contract or a web interface.

### Example:

```solidity

function getCandidate(uint _id) public view returns (string memory) {
    return candidates[_id].name;
}
```

This function only retrieves a candidate’s name without making any changes.

---

### **Pure Functions (`pure`)**

- Do not read or modify contract storage.
- Used for computations that do not rely on blockchain state.

### Example:

```solidity

function calculateSquare(uint number) public pure returns (uint) {
    return number * number;
}
```

This function computes the square of a number without interacting with contract storage.

---

## **Implementing the `addCandidate()` Function**

### **Why This Function Is Needed**

At this stage, the contract does not allow candidates to register for the election. Without candidates, the voting process cannot take place. This function will enable candidates to enter the election.

### **Function Implementation**

```solidity

function addCandidate(string memory _name) public {
    candidatesCount++; // Increment the candidate count
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0); // Store candidate details
}
```

### **Explanation**

1. `candidatesCount++` increases the total number of candidates each time a new candidate is added.
2. The new candidate is stored in the `candidates` mapping with an automatically assigned ID(Candidate count)

---

## **Implementing the `registerVoter()` Function**

### **Why This Function Is Needed**

Right now, there is no way for voters to register, which means no one can participate in the election. This function will allow voters to sign up.

### **Function Implementation**

```solidity

function registerVoter(address _voter, uint8 _age) public {
    voters[_voter] = Voter(true, false, 0, _age);
}
```

### **Explanation**

1. The function accepts an Ethereum address and age as input.
2. A new voter is stored in the `voters` mapping, with `isRegistered` set to `true`.

---

## **Deploying and Testing the Contract in Remix**

Now that the functions are implemented, we will deploy and test the contract in Remix.

### **Steps to Deploy and Test**

1. Open Remix and create a new file named `VotingContract.sol`.
2. Copy and paste the contract code.
3. Compile the contract by selecting the **Solidity Compiler** tab and clicking **Compile VotingContract.sol**.
4. Deploy the contract using the **Deploy & Run Transactions** tab.
5. Test the functions:
    - Call `addCandidate("Alice")` and `addCandidate("Bob")`.
    - Call `registerVoter(0xYourEthereumAddress, 25)`.
    - Verify that the candidates and voters are correctly stored in the contract.

<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/buildlab/art-of-writing-smart-contracts/images/lesson-5/calling-functions.gif" alt="Node" width="600" height="350" />
</p>

---

## **Final Contract Code**

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

    // Function to add a candidate

    function addCandidate(string memory _name) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
    
    //function to register voters

    function registerVoter(address _voter, uint8 _age) public {
        voters[_voter] = Voter(true, false, 0, _age);
    }
}

```

---

## **Next Steps**

Right now, anyone can call the `addCandidate()` and `registerVoter()` functions without any restrictions. In the next lesson, we will introduce **modifiers** to control access and ensure only authorized users can perform these actions.

This structured approach ensures all key concepts are well explained before moving forward. Let me know if you need any refinements!