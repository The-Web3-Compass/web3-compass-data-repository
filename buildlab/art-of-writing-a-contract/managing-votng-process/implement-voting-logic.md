# **Implementing Voting Logic**

## Let’s Vote

Now that we have established the rules for when voting can happen, it's time to implement the actual voting logic.

At this point, we have:

- Registered voters who meet the legal voting age requirement.
- Added candidates to the election.
- Controlled when voting starts and ends using the `votingOpen` variable.

However, there is one major issue—voters still cannot cast their votes. The `vote()` function is the missing piece that will allow eligible voters to participate in the election.

This function must enforce strict rules to ensure fairness and integrity in the voting process. Specifically, it should guarantee that:

- Only registered voters can cast a vote.
- A voter can only vote once.
- The vote count for the selected candidate is updated correctly.
- A record of the vote is emitted as an event on the blockchain.

By the end of this lesson, we will:

- Write the `vote()` function to handle voting.
- Validate voter registration, candidate selection, and prevent duplicate votes.
- Use events to log voting activity on the blockchain.

---

## **Validating Voting Conditions**

Before implementing the `vote()` function, we need to define the exact conditions under which a vote is valid. A voter should only be allowed to vote if:

1. They are a registered voter.
2. They have not already voted.
3. The candidate they are voting for exists.
4. The voting period is currently open.

If any of these conditions are not met, the function should reject the transaction to maintain the integrity of the election.

---

## **Defining the `Voted` Event**

Events are crucial in Solidity because they allow smart contracts to communicate with external applications, such as user interfaces. To track votes being cast, we define an event that logs each voting action.

```solidity
 
event Voted(address voter, uint candidateId);
```

This event records:

- The Ethereum address of the voter.
- The ID of the candidate they voted for.

By emitting this event whenever a vote is successfully cast, we create a permanent, transparent record of voting activity that can be retrieved later.

---

## **Implementing the `vote()` Function**

Now, we implement the `vote()` function, making sure to:

- Perform all necessary checks before allowing a vote.
- Update the voter's record to prevent double voting.
- Increment the candidate’s vote count.
- Update the total number of votes cast.
- Emit the `Voted` event.

```solidity
 
function vote(uint _candidateId) public whenVotingOpen {
    Voter storage sender = voters[msg.sender];

    require(sender.isRegistered, "You must be a registered voter");
    require(!sender.hasVoted, "You have already voted");
    require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

    sender.hasVoted = true;
    sender.votedCandidateId = _candidateId;

    candidates[_candidateId].voteCount++;
    totalVotes++;

    emit Voted(msg.sender, _candidateId);
}

```

---

### **Breaking Down the `vote()` Function**

1. **Retrieve the voter’s record from storage**
    
    ```solidity
     
    Voter storage sender = voters[msg.sender];
    ```
    
    This line creates a reference to the caller’s voter data inside the `voters` mapping. Since we use `storage`, any modifications made to `sender` directly affect the original data stored in the contract.
    
2. **Ensure the voter is registered**
    
    ```solidity
     
    require(sender.isRegistered, "You must be a registered voter");
    ```
    
    The function checks whether the sender’s address is in the `voters` mapping. If they are not registered, the transaction is immediately reverted.
    
3. **Ensure the voter has not already voted**
    
    ```solidity
     
    require(!sender.hasVoted, "You have already voted");
    ```
    
    This ensures that each voter can only cast one vote.
    
4. **Ensure the candidate ID is valid**
    
    ```solidity
     
    require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
    ```
    
    The function verifies that the candidate exists by checking that the provided `_candidateId` falls within the valid range of registered candidates.
    
5. **Record the voter’s choice**
    
    ```solidity
     
    sender.hasVoted = true;
    sender.votedCandidateId = _candidateId;
    ```
    
    This marks the voter as having cast their vote and records their chosen candidate.
    
6. **Increase the candidate’s vote count**
    
    ```solidity
     
    candidates[_candidateId].voteCount++;
    ```
    
    This ensures that the candidate receives the vote in their total count.
    
7. **Increment the total number of votes cast**
    
    ```solidity
     
    totalVotes++;
    ```
    
    Keeping track of the total number of votes helps in later stages when we retrieve and analyze election results.
    
8. **Emit the `Voted` event**
    
    ```solidity
     
    emit Voted(msg.sender, _candidateId);
    ```
    
    This creates a log on the blockchain that confirms the voting action.
    

---

## **Final Updated Contract**

With the voting function now complete, here is the fully updated contract:

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
    uint public totalVotes;

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
        totalVotes++;

        emit Voted(msg.sender, _candidateId);
    }
}

```

---

## **Testing the Voting Process in Remix**

1. Deploy the contract in Remix.
2. Try calling `vote(1)` before registering voters. The transaction should fail with `"You must be a registered voter"`.
3. Add a candidate using `addCandidate("Alice")` and register a voter.
4. Try voting before starting the election. The transaction should fail with `"Voting is not currently open"`.
5. Start the election using `startVoting()`.
6. Vote for a candidate and verify that the vote count increases.
7. Attempt to vote again and ensure the transaction fails with `"You have already voted"`.
8. End voting and attempt to vote again. The transaction should fail with `"Voting is not currently open"`.

---

## **Next Steps**

Now that voting is functional, the next step is to retrieve and display election results. In the next lesson, we will implement a function to determine the winner and return their details.