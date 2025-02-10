# **Restricting Voting Actions**

## Controlled Actions

In the previous lesson, we introduced **functions to start and end voting**, ensuring that voting can only occur within the correct timeframe.

However, there's a critical issue:

- Nothing stops someone from voting before the process officially begins.
- Voters could still attempt to cast votes after voting has ended.

Right now, if we were to create a voting function, it could be called **at any time**, even when voting is closed. This means unauthorized votes could be cast, compromising the integrity of the election.

To address this, we need a way to **restrict voting actions to only when voting is open**.

By the end of this lesson, you will be able to:

- Understand the importance of using **modifiers** to enforce voting restrictions.
- Implement a **`whenVotingOpen`** modifier to allow voting **only during the active voting period**.
- Apply this modifier to future **voting-related functions** to ensure voting integrity.

---

## **Declaring the Voting Function**

Before implementing restrictions, let's define the function that will allow voters to cast their votes.

```solidity
 
function vote(uint _candidateId) public {
    // Voting logic will be implemented in the next lesson
}
```

At this point, this function does nothing. However, if we deployed the contract, anyone could call this function at any time, whether voting was open or not. This is what we need to prevent.

---

## **Why Do We Need the `whenVotingOpen` Modifier?**

A function modifier allows us to **enforce a rule before a function executes**.

We have already used a modifier (`onlyAdmin`) to **restrict certain actions to the contract administrator**. Now, we will introduce a **new modifier** that ensures voting functions **can only execute when voting is open**.

Instead of adding a `require()` check inside every voting function, we define a **modifier once** and apply it to all relevant functions.

---

## **Creating the `whenVotingOpen` Modifier**

The `whenVotingOpen` modifier will ensure that voting functions **only execute when voting is active**.

```solidity
 
modifier whenVotingOpen() {
    require(votingOpen, "Voting is not currently open");
    _;
}
```

### **How This Works**

1. The modifier checks if `votingOpen` is `true`. If voting is open, the function executes.
2. If `votingOpen` is `false`, the transaction **reverts** with an error message.
3. The `_` symbol allows the **original function** to execute only if the condition passes.

---

## **Applying `whenVotingOpen` to the Voting Function**

Now that we have defined the modifier, we apply it to the `vote()` function.

```solidity
 
function vote(uint _candidateId) public whenVotingOpen {
    // Voting logic will be implemented in the next lesson
}
```

### **What Happens When `vote()` is Called?**

- If `votingOpen == true`, the function executes normally.
- If `votingOpen == false`, the function fails, and an error message is returned.

---

## **Updated Contract with `whenVotingOpen` Modifier**

Here is the updated contract, now including the `whenVotingOpen` modifier.

```solidity
 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingContract {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedCandidateId;
        uint8 age;
    }

    mapping(address => Voter) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;
    uint public totalVotes; // Tracks total votes cast

    address public admin;
    uint8 public constant LEGAL_VOTING_AGE = 18;
    bool public votingOpen; // Tracks if voting is currently allowed

    event CandidateAdded(uint candidateId, string name);
    event VoterRegistered(address voter, uint8 age);
    event VotingStarted();
    event VotingEnded();

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier whenVotingOpen() {
        require(votingOpen, "Voting is not currently open");
        _;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function registerVoter(address _voter, uint8 _age) public onlyAdmin {
        require(_age >= LEGAL_VOTING_AGE, "Voter must be at least 18 years old");
        voters[_voter] = Voter(true, false, 0, _age);
        emit VoterRegistered(_voter, _age);
    }

    function startVoting() public onlyAdmin {
        require(candidatesCount > 0, "Cannot start voting without candidates");
        require(!votingOpen, "Voting is already open");

        votingOpen = true;
        emit VotingStarted();
    }

    function endVoting() public onlyAdmin {
        require(votingOpen, "Voting is not currently open");

        votingOpen = false;
        emit VotingEnded();
    }

    function vote(uint _candidateId) public whenVotingOpen {
        // Voting logic will be implemented in the next lesson
    }
}
```

---

## **Testing the `whenVotingOpen` Modifier in Remix**

### **Steps to Test the Modifier**

1. Deploy the contract in Remix.
2. Try calling `vote(1)` before voting starts. The transaction should **fail** with the error **"Voting is not currently open."**
3. Call `addCandidate("Alice")` and `startVoting()` to open voting.
4. Call `vote(1)` again. The transaction should now succeed (once voting logic is implemented).
5. Call `endVoting()`, then try `vote(1)` again. The transaction should fail with **"Voting is not currently open."**

Even though the `vote()` function currently does nothing, this confirms that the **modifier is correctly restricting voting actions**.

---

## **Summary**

- A **modifier** is a reusable condition that enforces rules before a function executes.
- The `whenVotingOpen` modifier **ensures voting functions can only execute when voting is active**.
- It is applied to `vote()`, preventing unauthorized voting attempts.
- Testing in Remix confirms that the modifier **works as expected**.

---

## **Next Steps**

Now that we have restricted **when voting can happen**, the next step is to **implement the actual voting logic**.

In the next lesson, we will write the `vote()` function, ensuring that:

- Only **registered voters** can vote.
- Each voter can vote **only once**.
- Votes are **counted correctly**.