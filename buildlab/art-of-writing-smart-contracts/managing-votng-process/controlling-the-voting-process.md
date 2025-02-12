# **Controlling the Voting Process – Starting & Ending Voting**

## Start and End your Vote!

So far, our voting contract allows **candidates to register** and **voters to sign up**, but there is a **major problem**—there is **no control over when voting starts or ends**. Right now, if we were to implement a voting function, voters could cast their votes at any time, even **before candidates are registered**.

To ensure a structured voting process, we need to introduce **mechanisms to control when voting happens**. This lesson will cover:

- Implementing `startVoting()` and `endVoting()` functions.
- Ensuring voting can only begin if **candidates exist**.
- Emitting events (`VotingStarted` and `VotingEnded`) to track these actions.

By the end of this lesson, you will be able to:

- Understand how to **control state changes** in a smart contract.
- Implement **functions that enable and disable voting**.
- Use **events** to log when voting starts and ends.

---

## **Defining the Voting State**

To track whether **voting is open or closed**, we introduce a new **state variable**:

```solidity
bool public votingOpen;
```

- When `votingOpen` is `true`, **voting is allowed**.
- When `votingOpen` is `false`, **voting is closed**.

Initially, `votingOpen` is **false**, meaning voting is **not allowed** until explicitly started.

---

## **Implementing the `startVoting()` Function**

### **Why Do We Need This?**

Voting should **only begin when there are candidates** in the election. If there are **no candidates**, voting is pointless.

### **Step 1: Define the `VotingStarted` Event**

We create an event to **log when voting begins**:

```solidity
event VotingStarted();
```

### **Step 2: Implement `startVoting()`**

We check if there are **candidates** before allowing voting to begin.

```solidity
 function startVoting() public onlyAdmin {
    require(candidatesCount > 0, "Cannot start voting without candidates");
    require(!votingOpen, "Voting is already open");

    votingOpen = true;

    emit VotingStarted();
}
```

### **Explanation**

1. The function **checks if candidates exist** (`candidatesCount > 0`).
2. It ensures **voting is not already open** (`!votingOpen`).
3. If both conditions are met, `votingOpen` is set to **true**.
4. The `VotingStarted` event is emitted, **logging** the action.

---

## **Implementing the `endVoting()` Function**

### **Why Do We Need This?**

Once voting has started, we need a way to **close voting** to prevent votes from being cast indefinitely.

### **Step 1: Define the `VotingEnded` Event**

We create an event to **log when voting ends**:

```solidity
event VotingEnded();
```

### **Step 2: Implement `endVoting()`**

We ensure voting **is currently open** before allowing it to be closed.

```solidity
function endVoting() public onlyAdmin {
    require(votingOpen, "Voting is not currently open");

    votingOpen = false;

    emit VotingEnded();
}
```

### **Explanation**

1. The function checks if **voting is currently open** (`votingOpen == true`).
2. If voting is open, it **sets `votingOpen` to false**, disabling voting.
3. The `VotingEnded` event is emitted, **logging** the action.

---

## **Final Updated Contract**

Here is the updated contract, now including **functions to start and end voting**.

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

    // Total number of candidates
    uint public candidatesCount;

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

    // Events to log actions
    event CandidateAdded(uint candidateId, string name);
    event VoterRegistered(address voter, uint8 age);
    event VotingStarted();
    event VotingEnded();

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
        emit CandidateAdded(candidatesCount, _name);
    }

    // Function to register a voter (restricted to admin)
    function registerVoter(address _voter, uint8 _age) public onlyAdmin {
        require(_age >= LEGAL_VOTING_AGE, "Voter must be at least 18 years old");
        voters[_voter] = Voter(true, false, 0, _age);
        emit VoterRegistered(_voter, _age);
    }

    // Function to start voting (restricted to admin)
    function startVoting() public onlyAdmin {
        require(candidatesCount > 0, "Cannot start voting without candidates");
        require(!votingOpen, "Voting is already open");

        votingOpen = true;

        emit VotingStarted();
    }

    // Function to end voting (restricted to admin)
    function endVoting() public onlyAdmin {
        require(votingOpen, "Voting is not currently open");

        votingOpen = false;

        emit VotingEnded();
    }
}

```

---

## **Testing the Contract in Remix**

### **Steps to Test `startVoting()`**

1. **Deploy the contract** in Remix.
2. **Try calling `startVoting()` before adding candidates** → The transaction should **fail** with the error **"Cannot start voting without candidates"**.
3. **Call `addCandidate("Alice")` and `addCandidate("Bob")`** to add candidates.
4. **Call `startVoting()`** → The transaction should succeed, and the event `VotingStarted` will be logged.

### **Steps to Test `endVoting()`**

1. **Call `endVoting()` before starting voting** → The transaction should **fail** with the error **"Voting is not currently open"**.
2. **Call `startVoting()`** to open voting.
3. **Call `endVoting()`** → The transaction should succeed, and the event `VotingEnded` will be logged.

---

## **Summary**

- Introduced a **new state variable `votingOpen`** to track whether voting is allowed.
- Implemented `startVoting()` to **open voting** only if candidates exist.
- Implemented `endVoting()` to **close voting** when the admin decides.
- Used **events (`VotingStarted` and `VotingEnded`)** to log voting state changes.
- Ensured **proper validation with `require()`** to prevent invalid state transitions.

---

## **Next Steps**

Now that we have control over when voting can take place, the next step is to **ensure that votes can only be cast during the voting period**. Right now, anyone could theoretically call a voting function **at any time**, even when voting is closed.

In the next lesson, we will introduce **function modifiers to restrict voting actions to only when voting is open**.