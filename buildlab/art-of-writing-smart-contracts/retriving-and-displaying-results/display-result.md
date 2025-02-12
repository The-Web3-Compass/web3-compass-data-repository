# **Displaying Election Results**

## And the Winner is…

Now that our contract allows voters to **cast their votes**, we need a way to **determine the winner** once voting has ended.

Right now, votes are stored in each candidate’s `voteCount`, but there is **no way to retrieve the election results** easily.

To display the results, we will implement the `getWinner()` function, which will:

- **Ensure voting has ended before retrieving results**.
- **Loop through all candidates** to find the one with the highest vote count.
- **Return the winner’s name and vote count**.

Before diving into implementing the `getWinner()` function, let's first understand some important **control flow statements** in Solidity that will help us achieve this functionality.

---

## **Understanding Control Flow Statements**

In Solidity, **control flow statements** are used to control the **execution logic** within functions. These include:

1. **Conditional Statements (`if`, `require()`)**
    - Used to execute code **only when certain conditions are met**.
    - `require()` stops execution if the condition is **false**, preventing invalid actions.
    - The `if` statement allows us to check conditions and execute logic accordingly.
    
    **Example: Using `require()` to enforce a condition**
    
    ```solidity
       
    require(candidatesCount > 0, "No candidates available");
    ```
    
    - Ensures that candidates exist before running the function.
    
    **Example: Using `if` to compare values**
    
    ```solidity
       
    if (candidates[i].voteCount > winningVoteCount) {
        winningVoteCount = candidates[i].voteCount;
        winnerName = candidates[i].name;
    }
    ```
    
    - If the current candidate has **more votes** than the previous winner, update the winner.

---

1. **Looping Statements (`for`)**
    - Used to **iterate over data** and perform actions **repeatedly**.
    - `for` loops execute code **a fixed number of times**, making them useful for **searching through stored data**.
    
    **Example: Looping through candidates**
    
    ```solidity
       
    for (uint i = 1; i <= candidatesCount; i++) {
        // Logic for checking vote counts
    }
    ```
    
    - This loop **iterates through each candidate**, allowing us to find the one with the most votes.

---

### **Why Do We Need These Control Flow Statements?**

In our `getWinner()` function, we will:

- Use `require()` to **prevent accessing results before voting ends**.
- Use a `for` loop to **iterate through candidates** and find the one with the most votes.
- Use an `if` condition to **compare vote counts and track the leading candidate**.

---

## **Implementing the `getWinner()` Function**

Now that we understand the control flow statements, let’s implement the function that **retrieves the election results**.

```solidity
   
function getWinner() public view returns (string memory, uint) {
    require(!votingOpen, "Voting must be closed to determine the winner");
    require(candidatesCount > 0, "No candidates available");

    uint winningVoteCount = 0;
    string memory winnerName = "";

    for (uint i = 1; i <= candidatesCount; i++) {
        if (candidates[i].voteCount > winningVoteCount) {
            winningVoteCount = candidates[i].voteCount;
            winnerName = candidates[i].name;
        }
    }

    return (winnerName, winningVoteCount);
}
```

---

### **Breaking Down the `getWinner()` Function**

1. **Ensure voting has ended before retrieving results**
    
    ```solidity
       
    require(!votingOpen, "Voting must be closed to determine the winner");
    ```
    
    - If `votingOpen == true`, the function **fails**, preventing access before voting ends.
2. **Ensure there are candidates in the election**
    
    ```solidity
       
    require(candidatesCount > 0, "No candidates available");
    ```
    
    - If there are no candidates, there cannot be a winner.
3. **Initialize variables to track the highest vote count and winner name**
    
    ```solidity
       
    uint winningVoteCount = 0;
    string memory winnerName = "";
    ```
    
    - `winningVoteCount` stores the **highest number of votes found**.
    - `winnerName` stores the **name of the leading candidate**.
4. **Loop through all candidates to find the winner**
    
    ```solidity
       
    for (uint i = 1; i <= candidatesCount; i++) {
        if (candidates[i].voteCount > winningVoteCount) {
            winningVoteCount = candidates[i].voteCount;
            winnerName = candidates[i].name;
        }
    }
    ```
    
    - The loop **iterates through all candidates**.
    - If a candidate's `voteCount` is **higher than the current highest vote count**, they become the new **leading candidate**.
5. **Return the winner’s name and vote count**
    
    ```solidity
       
    return (winnerName, winningVoteCount);
    ```
    
    - The function returns the **name of the winning candidate** and **the total votes they received**.

---

## **Final Updated Contract**

Here is the updated contract, now including **the ability to retrieve election results**.

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

    address public admin;
    uint8 public constant LEGAL_VOTING_AGE = 18;
    bool public votingOpen;

    event CandidateAdded(uint candidateId, string name);
    event VoterRegistered(address voter, uint8 age);
    event VotingStarted();
    event VotingEnded();
    event Voted(address voter, uint candidateId);

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
        Voter storage sender = voters[msg.sender];

        require(sender.isRegistered, "You must be a registered voter");
        require(!sender.hasVoted, "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        sender.hasVoted = true;
        sender.votedCandidateId = _candidateId;

        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    function getWinner() public view returns (string memory, uint) {
        require(!votingOpen, "Voting must be closed to determine the winner");
        require(candidatesCount > 0, "No candidates available");

        uint winningVoteCount = 0;
        string memory winnerName = "";

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winnerName = candidates[i].name;
            }
        }

        return (winnerName, winningVoteCount);
    }
}

```

---

## **Next Steps**

Now that we can determine the **winner of the election**, the next step is to **deploy, test, and interact with the contract** in **Remix and Ethereum testnets**.

In the next lesson, we will:

- **Deploy the contract** in a test environment.
- **Simulate an election from start to finish**.
- **Interact with the contract through Remix and Web3 tools**.