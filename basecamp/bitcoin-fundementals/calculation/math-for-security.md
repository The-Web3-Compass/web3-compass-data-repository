# Math For Security

### How Bitcoin Keeps Your Transactions Secure: Beating the Odds ⚔️

Whoo-hoo! We’re in the final stretch of Bitcoin’s technical journey. So far, we’ve seen how it handles value, protects privacy, and keeps everything efficient—and sometimes a bit tricky to wrap your head around (you know what I mean). But now comes the big question: **what happens when someone actually tries to cheat the system?**

How does Bitcoin protect itself from attackers trying to rewrite the blockchain and mess with transactions? This section dives into one of Bitcoin’s most important features: **how it stays secure, even in the face of potential attacks.**

Fair warning, this is one the most math-heavy section in the whitepaper, but don’t worry—we’re not crunching numbers today. Instead, we’ll focus on what’s happening, why it works, and how Bitcoin’s design makes cheating nearly impossible.

Let’s gear up and break it down. 🛡️

---

### The Attack Scenario: Cheating the Blockchain

Imagine an attacker trying to rewrite history on the blockchain. Why would they do this? Here are some potential motivations:

1. **Double Spending**:
    - The attacker spends Bitcoin, receives goods or services, and then rewrites the blockchain to undo the payment.
2. **Reversing Transactions**:
    - By altering past transactions, the attacker could recover funds they’ve already spent.

However, the attacker faces some major limitations:

- They **cannot create new Bitcoin** out of thin air.
- They **cannot steal Bitcoin** from others.
- The network rejects **invalid transactions**, so the attacker must follow the rules of the system.

In essence, an attacker can only target their own transactions, and even then, they face overwhelming odds.

---

### The Race: Honest Chain vs. Attacker’s Chain

Bitcoin’s security boils down to a race between the **honest network** and the **attacker’s chain**. Here’s how it works:

- The **Honest Chain** is maintained by miners who follow the rules, adding valid blocks to the blockchain.
- The **Attacker’s Chain** is a separate version of the blockchain, created by the attacker in secret, with the goal of overtaking the honest chain.

Here’s the crucial rule: **Bitcoin nodes always consider the longest chain to be the valid one.** The longest chain isn’t just about the number of blocks—it’s the chain with the most cumulative Proof of Work, meaning the most computational effort has gone into building it.

For the attacker to succeed, they need to:

1. Solve Proof of Work puzzles faster than the honest network.
2. Build a chain longer than the honest chain to make it appear legitimate.

This race is essentially a battle of computational power: the honest network vs. the attacker. And with Bitcoin’s design, the odds are heavily stacked in favor of the honest network.

---

### Why the Odds Favor the Honest Chain

The beauty of Bitcoin’s design is that it stacks the odds heavily against attackers. Here’s why:

1. **Majority Mining Power**:
    
    The honest network controls the majority of computational power. If the honest chain has a higher chance (p) of finding the next block than the attacker (q), the attacker’s chances of success diminish rapidly.
    
2. **Exponential Drop in Success Probability**:
    
    As the honest chain gets further ahead, the probability of the attacker catching up drops exponentially.
    
    <p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/basecamp/bitcoin-fundementals/images/calculation/catch-up.gif" alt="Node" width="600" height="350" />
    </p>
    
    
    - For example:
        - If the attacker controls 10% of the network, their chances of catching up after falling 6 blocks behind are less than 0.1%.
        - Even with 30% control, the probability remains extremely low.

In simpler terms, the longer you wait for block confirmations, the safer your transaction becomes.

---

### What Are Block Confirmations?

A **block confirmation** occurs when a new block is added to the blockchain after your transaction has been included. Each confirmation represents an additional layer of security:

- **1 Confirmation**: Your transaction is included in a block.
- **2 Confirmations**: Another block is added on top, securing your transaction further.
- **6 Confirmations**: Your transaction is considered highly secure, as the likelihood of an attacker rewriting the blockchain becomes negligible.

    <p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/basecamp/bitcoin-fundementals/images/calculation/confirmation.gif" alt="Node" width="600" height="350" />
    </p>

Waiting for confirmations ensures that your transaction is buried deep enough in the blockchain to be virtually irreversible.

---

### The 51% Attack: Is It Feasible?

A **51% attack** refers to a scenario where an attacker controls more than half of the network’s computational power. In this case, the attacker could:

- Build blocks faster than the honest network.
- Potentially rewrite the blockchain and reverse their own transactions.

While this sounds alarming, it’s not a practical threat for several reasons:

1. **Enormous Costs**:
    - Acquiring 51% of the network’s mining power would require massive amounts of hardware, energy, and money.
2. **Self-Defeating**:
    - Even if the attacker succeeded, they would undermine trust in Bitcoin, devaluing the very currency they’re trying to exploit.
3. **Decentralization**:
    - Bitcoin’s global network of miners makes it incredibly difficult for any single entity to gain majority control.

---

### Why Wait for Confirmations?

When you receive a Bitcoin payment, it’s tempting to consider it final as soon as it appears in your wallet. But to ensure the transaction is secure, it’s best to wait for multiple confirmations:

- The attacker must not only rewrite the block containing your transaction but also all subsequent blocks.
- Each confirmation makes this task exponentially harder.

For most transactions, 6 confirmations (approximately 1 hour) is the gold standard for security.

---

### Real-World Implications: Bitcoin’s Trustworthy Design

Bitcoin’s security model ensures that:

1. **Attacks Are Impractical**:
    - The resources required to rewrite the blockchain are prohibitively expensive.
2. **Security Grows Over Time**:
    - With each confirmation, the probability of an attack succeeding becomes vanishingly small.
3. **Trust Is Decentralized**:
    - Bitcoin doesn’t rely on any single entity to maintain security—it’s a collective effort powered by honest participants.

---

### Wrapping It Up: Trusting the Odds 🎲

Bitcoin’s security isn’t just about fancy cryptography—it’s about stacking the deck so heavily against attackers that cheating becomes laughably impractical. By making attacks ridiculously expensive and ensuring that honest participation is more rewarding than bad behavior, Bitcoin creates a system that’s both robust and fair.

This is Bitcoin’s brilliance: a network that doesn’t need to rely on trust in banks or intermediaries. Instead, it trusts math, computation, and the collective power of its participants. Every block added is like another stone in an unbreakable fortress, making the network stronger with time.

So here we are, at the tail end of Bitcoin’s technical journey. Next, we’ll step back and look at the big picture—the conclusion of the whitepaper. What’s Bitcoin’s ultimate vision? Let’s cross the finish line together and find out! 🚀