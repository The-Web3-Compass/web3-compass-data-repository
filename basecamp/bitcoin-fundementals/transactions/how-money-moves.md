### Transactions

Alright, so we’ve explored how Bitcoin removes the need for trust in traditional financial systems by relying on cryptography, math, code, decentralization, and a whole other bunch of big, scary words. But what does that actually look like in practice? How does Bitcoin handle something as fundamental as moving money from one person to another?

Well, as in any other financial system, the answer is **transactions.** Every time someone sends Bitcoin, they’re creating a transaction—a record of value moving from one person to another. 

<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/basecamp/bitcoin-fundementals/images/transaction/transaction.gif" alt="Node" width="600" height="350" />
    </p>

These transactions are the engine that powers Bitcoin’s vision of a decentralized, trustless financial system.

If Bitcoin were a machine, transactions would be the moving parts that keep it running. Understanding how they work under the hood is actually quite essential to grasping what makes Bitcoin so revolutionary. Don’t worry; we’ll take it one step at a time.

---

### What Is a Bitcoin Transaction?

Imagine you’re sending someone a Bitcoin. What’s actually happening? Is it like handing over cash, wiring money through a bank, or emailing a file? Not quite. Bitcoin transactions are entirely digital and guided by code—they work in their own unique and secure way.

You can think of a Bitcoin as this **magical baton.** When you hold this baton, the Bitcoin network recognizes you as its rightful owner. Every time you pass it on, you leave a unique signature on it, proving you owned it before handing it over.

<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/basecamp/bitcoin-fundementals/images/transaction/list.gif" alt="Node" width="600" height="350" />
    </p>


But before we can dive into sending Bitcoin, let’s first understand what it means to **own** Bitcoin in the first place. Where is this magical baton stored, and how does the network know it belongs to you?

---

### 1. **Owning Bitcoin: What It Actually Means**

Owning Bitcoin doesn’t mean you have a shiny digital coin sitting on your computer or phone. In fact, there’s no “coin” at all—Bitcoin exists only as a record in a digital [ledger](https://www.web3compass.xyz/learn/learn-your-abcs?term=ledger) (blockchain).

So, what does ownership look like? I mean, how does one own a record in a ledger?

Think of it this way: ownership in Bitcoin is like having a key to a safety deposit box, but instead of a physical box, it’s a **digital address** on the ledger . This address is known as your **public key.** It’s unique to you and acts as the location where your Bitcoin is “stored.” When someone wants to send you Bitcoin, they essentially deposit it into this address—just like dropping something into your safety deposit box.

But there’s an important catch. While anyone can send Bitcoin to your public key, only you can access or move it. How? By using your **private key.**

**The Private Key: Your Master Key**

The **private key** is like the only key to your safety deposit box. It’s a long, randomly generated string of characters that proves you’re the rightful owner of the Bitcoin associated with your public key. Without the private key, the funds in your address are locked away forever—no one, not even the Bitcoin network itself, can access them.

And here’s the crucial part: you need your private key not just to prove ownership, but also to move your Bitcoin to someone else’s address. Whenever you send Bitcoin, your private key is used to create a unique **digital signature** that authorizes the transaction. This signature tells the Bitcoin network, “I own these funds, and I approve this transfer.”

Without your private key, you simply cannot move your Bitcoin. It’s as if you’re holding a locked safety deposit box without the key—no way to open it, no way to use what’s inside.

---

### Smoother Transition to Sending Bitcoin

Now that we understand what it means to “own” Bitcoin and how private and public keys work, let’s talk about **sending Bitcoin**—the process of passing that magical baton from one person to another.

---

### 4. **Sending Bitcoin: Passing the Baton**

When you want to send Bitcoin to someone else, you’re essentially handing them the baton. But to make sure the transfer is legitimate, you need to prove two things:

- **You actually own the baton** (you can’t pass something you don’t have).
- **You’re passing it to a specific person** (you can’t just yell, “Who wants it?”).

Here’s how it works:

1. You create a **digital signature** using your private key. This signature acts as proof that you own the baton and are authorizing its transfer.
2. The signature includes:
    - The **hash** (a unique digital fingerprint) of the previous transaction where you received the baton.
    - The **public key** of the person you’re passing it to (the recipient).

<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/basecamp/bitcoin-fundementals/images/transaction/signature.gif" alt="Node" width="600" height="350" />
    </p>


It’s like attaching a note to the baton that says, “This is mine, but now it belongs to Alex. Here’s proof that I’m the owner, and here’s who gets it next.”

---

### 5. **The Chain of Transactions: Building the Baton’s History**

Every time the baton changes hands, a new link is added to its history. This creates a **chain of ownership** that stretches back to the very first person who held it.

Imagine this baton has an uneditable diary. Each entry records:

- Who had the baton.
- Who it was passed to.
- The proof (signature) that the transfer was legitimate.

For example:

- “Alice got the baton from Bob.”
- “Bob got the baton from Carol.”

This unbroken chain of signatures is what makes Bitcoin secure. Every baton can be traced back to its origin, so you always know its history.

---

### 6. **Verification: The Network Watches the Pass**

Before the baton officially changes hands, the Bitcoin network steps in to verify the transfer. Think of it as a stadium full of referees watching the pass to make sure it’s fair.

The network checks:

- **Is your digital signature valid?** This proves you’re the rightful owner of the baton.
- **Is the transaction consistent with the rules of the network?** This ensures fairness and prevents unauthorised transfers.

If everything checks out, the transaction is added to the **blockchain**, a public, unchangeable ledger that keeps track of every baton pass.

---

### Why Is This System Brilliant?

Bitcoin transactions solve many challenges that traditional financial systems face:

- **No Physical Exchange:** The baton is entirely digital, so there’s no need to physically hand it over.
- **Decentralized Ledger:** Every transaction is recorded on the blockchain, which is maintained by the network rather than a central authority.
- **Transparency:** Anyone can trace the baton’s history to verify its authenticity.

However, this brings up an important challenge: What’s stopping someone from copying the baton and passing it to multiple people?

---

### The Double-Spending Problem: What’s the Catch?

As discussed in the previous section, digital money has one big flaw: it’s easy to copy. Imagine creating identical copies of the baton and passing them to several people at the same time. Chaos, right?

Traditional systems solve this problem by relying on trusted authorities like banks. They:

- Keep track of all transactions.
- Make sure you don’t spend money you don’t have.
- Resolve disputes if something goes wrong.

Bitcoin removes these middlemen, so it had to find a different way to solve the **double-spending problem.**

---

### How Bitcoin Stops Double-Spending

Bitcoin uses the blockchain and a clever process based on **majority rule** to prevent cheating. Here’s how it works:

1. **Announcing the Transaction**: The transaction is broadcast to the entire network, letting everyone know you’re sending Bitcoin.
2. **Verification by Nodes**: Nodes (computers running Bitcoin software) verify that the transaction follows the rules—checking the digital signature and ensuring the sender owns the Bitcoin they’re trying to spend.
3. **Majority Rule Among Nodes**: The nodes work together to decide whether the transaction is valid. If the majority of nodes agree, the transaction is approved and can be added to the blockchain. This ensures that no single node or small group can manipulate the process.
4. **Recording the Transaction**: Once the majority has approved the transaction, it is added to a new block, which is then linked to the previous blocks, creating the blockchain.

This process ensures that no one can spend the same Bitcoin twice. Every transaction is verified, recorded, and locked into the blockchain, creating an unalterable history of who owns what.

---

### Wrapping It Up

So, Bitcoin transactions are essentially like passing a baton. Each handoff adds a new, secure link to the chain of ownership, making the system transparent, tamper-proof, and trustless.

Next, we’ll explore the **Timestamp Server**—Bitcoin’s way of creating an organized, tamper-proof timeline for all transactions. Let’s keep going!