### What’s in store?

Welcome back! So far, we’ve explored the revolutionary ideas behind blockchain and how it introduced a trustless, decentralized system to the world. But now it’s time to get into the nitty-gritty: **how does blockchain actually store data?**

Well, think of blockchain as the world’s most secure and meticulously organized book. Each **block** is like a page in this book, recording specific information. 


<p align="center">
    <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/basecamp/blockchain-starterpack/images/how-blockchain-store-data/a-block-a-page/block.gif" alt="block" width="600" height="350" />
</p>

Just like every page in a book has a defined structure—headings, paragraphs, maybe even footnotes—each block in the blockchain has its own carefully designed structure. Let’s dive in and break it down.

---

### **What is a Block?**

At its core, a block is the fundamental unit of a blockchain. You can think of it as a **container** or a **digital page** that holds essential data. But this isn’t just any ordinary container—it’s built to ensure that the information inside is secure, transparent, and impossible to tamper with.

Each block has two main parts: the **block header** and the **block body**. Together, they store all the information needed to make the blockchain work.


<p align="center">
    <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/basecamp/blockchain-starterpack/images/how-blockchain-store-data/a-block-a-page/hb.gif" alt="block structure" width="600" height="350" />
</p>

---

### **1. The Block Header: The Brain of the Block**

If a block is like a page in our metaphorical book, the **block header** is the title, table of contents, and index all rolled into one. It organizes the data about the block (The Block Metadata) and connects it to the rest of the blockchain.

Here’s what you’ll typically find in a typical block header:

### **1.1 Timestamp**

The timestamp is like the date at the top of a diary entry. It records exactly when the block was created. This ensures that every block in the blockchain is stored in chronological order, making it a timeline of events.

### **1.2 Block Number**

Think of this as the page number in the book. It helps everyone in the network keep track of where this block fits in the overall blockchain.

### **1.3 Previous Hash**

This is a reference to the block that came before it—like a footnote pointing to the previous page. It’s what links the blocks together, ensuring that no block stands alone. Without this connection, the “chain” in blockchain wouldn’t exist.

### **1.4 Nonce (Number Only Used Once)**

The nonce is a unique number included in each block during the mining process. It plays a key role in creating the block’s unique and valid fingerprint, called a bock hash. We’ll explore how hashing works in the next section, but for now, think of the nonce as the secret ingredient that ensures the block is valid and ready to be added to the blockchain.

### **1.5 Merkle Root**

This one might sound technical, but it’s vital. The Merkle root is like a summary of the block’s contents. It condenses all the transactions or data stored in the block into a single value. This allows anyone to verify that the block’s contents haven’t been altered without needing to check every transaction individually.

The block header is like the brain of the block—it keeps everything organized, connected, and verifiable.


<p align="center">
    <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/basecamp/blockchain-starterpack/images/how-blockchain-store-data/a-block-a-page/header.gif" alt="header" width="600" height="350" />
</p>

---

### **2. The Block Body**

If the header is the brain, the **block body** is ..well… the body. This is where the actual data—the stuff we care about—is stored.


<p align="center">
    <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/basecamp/blockchain-starterpack/images/how-blockchain-store-data/a-block-a-page/data.gif" alt="data" width="600" height="350" />
</p>

### **2.1 Transactions**

For Bitcoin and similar blockchains, the block body functions like a digital ledger, recording transactional data. Each transaction includes:

- The sender’s address.
- The receiver’s address.
- The amount being transferred.
- A digital signature to verify the authenticity of the transaction.

### **2.2 Other Types of Data**

Not all blockchains are focused on financial transactions. Depending on the type of blockchain, the block body can store:

- **Supply chain data**: Tracking the journey of products from factories to stores.
- **Smart contract code**: Self-executing code that automatically run when conditions are met.
- **Healthcare records**: Safeguarding patient data while allowing secure, authorized access.
- **Digital art ownership**: Recording who owns what in the NFT (non-fungible token) world.

### **2.3 Capacity**

Just like a page in a book has limited space, a block can only hold so much data. For example, Bitcoin blocks have a size limit of **1MB**, which determines how many transactions can fit into a single block.

The block body is all about storing the valuable data that makes the blockchain useful, whether that’s tracking money, products, or even digital assets.

---

### **How Do Blocks Work Together?**

Now that we know what’s inside a block, let’s talk about how blocks fit together. Each block isn’t an isolated container—it’s part of a much larger system. By linking blocks together through the **previous hash**, blockchain creates a secure and immutable chain of data.

This chain structure ensures that every block is connected, and any attempt to tamper with one block would break the entire chain. It’s like a row of dominoes—move one, and the rest are affected.

---

For now, think of the blockchain as a beautifully structured book where every page (block) has a clear purpose and connection to the pages before and after. It’s a system designed for accuracy, security, and transparency.

In the next section, we’ll explore the magic of **hashing**—the secret sauce that makes blockchain tamper-proof and trustworthy and an actual chain.