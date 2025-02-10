# **Tracking Contract Activity**

## Tracking Events

So far, we have built a functional voting contract where:

- **Admins can add candidates** to the election.
- **Admins can register voters**, ensuring they meet the legal voting age.
- **Access control is enforced** using modifiers to restrict unauthorized users.

While the contract works, there is one issue: **there is no way to track what is happening** inside the contract unless we manually check the stored data.

For example:

- How do we know when a **new candidate is added**?
- How do we track **voter registrations**?

Currently, the contract stores this data in mappings, but there is **no automatic way to notify external applications** when an action occurs. This is where **Solidity events** come in.

By the end of this lesson, you will be able to:

- Understand **what events are** and why they are useful.
- Learn how to **emit events** in `addCandidate()` and `registerVoter()`.
- View event logs in **Remix** to track blockchain activity.

---

## **What Are Events in Solidity?**

An **event** in Solidity is a way to log information **on the blockchain** when a specific action occurs. Events allow external applications (such as a frontend UI) to **listen for changes** and respond accordingly.

Events are commonly used to:

- **Log important contract actions** (e.g., when a new voter registers).
- **Notify external applications** about blockchain changes.
- **Provide transparency** by recording historical contract activity.

### **How Events Work**

Events do not store data inside the contract's state but instead **write logs** to the blockchain. These logs:

- **Do not consume much gas**, making them efficient.
- **Can be accessed externally** but are **not directly accessible** within Solidity functions.

---

## **Defining an Event**

Events are declared using the `event` keyword. Here is the basic syntax:

```solidity
  
event EventName(parameters);
```

When an event is triggered using `emit`, the parameters are **recorded on the blockchain**.

```solidity
  
emit EventName(arguments);
```

Now, let's define and use events in our contract.

---

## **Adding Events to `addCandidate()`**

### **Step 1: Define the `CandidateAdded` Event**

We create an event that **logs when a candidate is added**:

```solidity
  
event CandidateAdded(uint candidateId, string name);
```

This event records:

- The **ID** of the newly added candidate.
- The **name** of the candidate.

### **Step 2: Emit the Event in `addCandidate()`**

Inside `addCandidate()`, we use `emit` to trigger the event after adding a candidate:

```solidity
  
function addCandidate(string memory _name) public onlyAdmin {
    candidatesCount++;
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);

    emit CandidateAdded(candidatesCount, _name); // Emit the event
}
```

### **How This Works**

- Every time a candidate is added, Solidity **logs** the event to the blockchain.
- The event contains the **candidate's ID and name**.
- External applications can listen for this event to **detect new candidates**.

---

## **Adding Events to `registerVoter()`**

### **Step 1: Define the `VoterRegistered` Event**

We create an event to **log when a new voter is registered**:

```solidity
  
event VoterRegistered(address voter, uint8 age);
```

This event records:

- The **Ethereum address** of the registered voter.
- The **age** of the voter.

### **Step 2: Emit the Event in `registerVoter()`**

Inside `registerVoter()`, we use `emit` to trigger the event after registering a voter:

```solidity
  
function registerVoter(address _voter, uint8 _age) public onlyAdmin {
    require(_age >= LEGAL_VOTING_AGE, "Voter must be at least 18 years old");

    voters[_voter] = Voter(true, false, 0, _age);

    emit VoterRegistered(_voter, _age); // Emit the event
}
```

### **How This Works**

- Every time a voter is registered, Solidity **logs** the event to the blockchain.
- The event contains the **voter's address and age**.
- External applications can listen for this event to **detect new voter registrations**.

---

## **Viewing Events in Remix**

After deploying the contract, we can test **event logs** in Remix.

### **Steps to View Events**

1. **Deploy the contract** in Remix.
2. **Call `addCandidate("Alice")`** and observe the transaction log.
3. **Expand the transaction details** and look for the **Logs** section.
4. **You will see the emitted event** showing the candidate's ID and name.


<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/buildlab/art-of-writing-a-contract/images/lesson-7/events.gif" alt="Node" width="600" height="350" />
</p>

1. **Repeat the process for `registerVoter()`**, passing an address and age.

Since events are **not stored in mappings**, they do not appear in the contract storage but can be viewed in the transaction logs.

---

## **Final Updated Contract with Events**

Here is the updated contract, now including **event logging** for `addCandidate()` and `registerVoter()`.

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

    // Events to log actions
    event CandidateAdded(uint candidateId, string name);
    event VoterRegistered(address voter, uint8 age);

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
        emit CandidateAdded(candidatesCount, _name); // Emit event
    }

    // Function to register a voter (restricted to admin)
    function registerVoter(address _voter, uint8 _age) public onlyAdmin {
        require(_age >= LEGAL_VOTING_AGE, "Voter must be at least 18 years old");
        voters[_voter] = Voter(true, false, 0, _age);
        emit VoterRegistered(_voter, _age); // Emit event
    }
}

```

---

## **Summary**

- **Events** allow Solidity contracts to log important actions on the blockchain.
- **Events do not store data in contract state** but are useful for **external applications** to track activity.
- We created the **`CandidateAdded` event**, which logs candidate ID and name.
- We created the **`VoterRegistered` event**, which logs the voter's address and age.
- **Events are emitted using `emit`**, making them part of the transaction logs.
- **Remix allows us to view event logs** in the transaction details.

---

## **Next Steps**

Now that our contract **logs candidate additions and voter registrations**, the next step is **controlling the voting process**. Right now, there is **no way to start or stop voting**, meaning people could vote **before candidates are even added**.

In the next lesson, we will introduce **functions to start and end the voting process**, ensuring that voting only happens within the correct timeframe.