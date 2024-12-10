# **Lesson 5: Creating the `SimpleBlockchain` Class**

---

### **Introduction: Building the Chain That Makes the Blockchain**

You’ve been on a roll so far—crafting blocks, giving them unique identities with hashes, and even securing them with Proof of Work. But let’s face it, a single block (or even two) doesn’t scream **blockchain**, does it? It’s like having a bunch of LEGO pieces scattered on the floor. Sure, they’re great individually, but the magic happens when you start connecting them to build something epic.

Today, we’re moving from individual blocks to a full-fledged **blockchain**. It’s time to:

1. Create the all-important **genesis block**—the cornerstone of your blockchain.
2. Add methods to link new blocks into a secure chain.
3. Watch your blockchain grow as you add blocks one by one.

Think of this lesson as assembling the backbone of your blockchain. Let’s get those blocks talking to each other!

---

### **Step 1: What’s a Blockchain, Anyway?**

Quick recap: as we discussed in **Lesson 1**, a blockchain is a digital ledger composed of blocks linked in a secure, tamper-proof sequence. This chain of blocks:

- **Links blocks together** using hashes.
- **Prevents tampering** because changing one block would break the entire chain.
- **Maintains trust** without relying on a central authority.

Today, you’ll implement this structure. Let’s start with the genesis block—the first block that begins the chain.

---

### **Step 2: Creating the Genesis Block**

The genesis block is like the first domino in a long line. It doesn’t have a predecessor, so its `previousHash` is set to `"0"`. Without it, there’s no chain—just a lonely list of blocks. Let’s code it!

---

### **Code: Genesis Block Creation**

```jsx
javascript
Copy code
class SimpleBlockchain {
  constructor() {
    // The blockchain starts with the genesis block
    this.chain = [this.createGenesisBlock()];
  }

  // Method to create the genesis block
  createGenesisBlock() {
    console.log("Creating the genesis block...");
    return new SimpleBlock(0, Date.now(), "Genesis Block", "0");
  }
}

```

---

### **Explanation**

1. **`constructor`**:
    - Initializes the blockchain with a single block: the genesis block.
    - The blockchain is represented as an array called `chain`, which holds all the blocks.
2. **`createGenesisBlock`**:
    - This method creates the first block in the chain.
    - It sets the `previousHash` to `"0"` because there’s no block before the genesis block.

Congratulations! You’ve laid the foundation of your blockchain. But a single block is like a book with only one page—not very exciting. Let’s add more blocks to the mix.

---

### **Step 3: Adding New Blocks**

Here’s where the fun begins. Every new block needs to:

1. **Link to the previous block** using its `hash`.
2. **Prove its validity** by being mined (thanks to the Proof of Work you built earlier).
3. **Join the chain** as the next member of the blockchain family.

---

### **Code: Adding Blocks**

```jsx
javascript
Copy code
class SimpleBlockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    console.log("Creating the genesis block...");
    return new SimpleBlock(0, Date.now(), "Genesis Block", "0");
  }

  getLatestBlock() {
    // Retrieves the most recent block in the chain
    return this.chain[this.chain.length - 1];
  }

  addNewBlock(newBlock) {
    // Link the new block to the latest block in the chain
    newBlock.blockHeader.previousHash = this.getLatestBlock().blockHeader.hash;

    // Mine the new block
    console.log(`Mining a new block with difficulty 2...`);
    newBlock.mineBlock(2);

    // Add the newly mined block to the chain
    this.chain.push(newBlock);
    console.log("Block successfully added to the blockchain!");
  }
}

```

---

### **Explanation**

1. **`getLatestBlock`**:
    - This method fetches the last block in the chain.
    - It ensures that new blocks link to the correct predecessor.
2. **`addNewBlock`**:
    - Links the new block to the latest block using the `previousHash` field.
    - Mines the new block using the `mineBlock` method, ensuring it meets the Proof of Work criteria.
    - Appends the mined block to the blockchain.

Now, your blockchain is dynamic—it can grow by adding new blocks. Let’s test it out and see your blockchain in action.

---

### **Step 4: Testing the Blockchain**

Here’s where you get to see all your hard work pay off. Let’s create a blockchain, add a couple of blocks, and visualize the structure.

---

### **Code: Testing the Blockchain**

```jsx
javascript
Copy code
// Instantiate a new blockchain
const myBlockchain = new SimpleBlockchain();

// Add two new blocks to the blockchain
const block1 = new SimpleBlock(1, Date.now(), "First block after genesis");
myBlockchain.addNewBlock(block1);

const block2 = new SimpleBlock(2, Date.now(), "Second block after genesis");
myBlockchain.addNewBlock(block2);

// Log the entire blockchain structure
console.log("\n--- Blockchain Structure ---");
console.log(JSON.stringify(myBlockchain, null, 2));

```

---

### **Explanations After the Code**

1. **Creating the Blockchain**:
    - The blockchain is instantiated with the genesis block already in place.
    - This ensures every new block has a foundation to build upon.
2. **Adding Blocks**:
    - Two new blocks are created (`block1` and `block2`) with custom data.
    - Each block is mined to meet the Proof of Work requirements before being added to the chain.
3. **Visualizing the Chain**:
    - The entire blockchain structure is logged in JSON format, showing:
        - The `index`, `timestamp`, `previousHash`, `hash`, and `nonce` of each block.
        - How each block links securely to the one before it.

By the end of this step, you have a fully functional blockchain capable of securely linking blocks together. Well done!

---

### **Complete Code for Lesson 5**

```jsx
javascript
Copy code
// Importing the crypto module for hashing
const crypto = require("crypto");

class SimpleBlock {
  constructor(blockIndex, timestamp, blockData, previousBlockHash = "") {
    this.blockHeader = {
      index: blockIndex,
      timestamp,
      previousHash: previousBlockHash,
      hash: "",
      nonce: 0,
    };

    this.blockBody = {
      data: blockData,
    };

    this.blockHeader.hash = this.generateHash();
  }

  generateHash() {
    const { index, timestamp, previousHash, nonce } = this.blockHeader;
    const dataString = JSON.stringify(this.blockBody.data);
    return crypto
      .createHash("sha256")
      .update(index + timestamp + previousHash + dataString + nonce)
      .digest("hex");
  }

  mineBlock(difficultyLevel) {
    while (
      this.blockHeader.hash.substring(0, difficultyLevel) !==
      Array(difficultyLevel + 1).join("0")
    ) {
      this.blockHeader.nonce++;
      this.blockHeader.hash = this.generateHash();
    }

    console.log(`Block mined with hash: ${this.blockHeader.hash}`);
  }
}

class SimpleBlockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    console.log("Creating the genesis block...");
    return new SimpleBlock(0, Date.now(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addNewBlock(newBlock) {
    newBlock.blockHeader.previousHash = this.getLatestBlock().blockHeader.hash;
    console.log(`Mining a new block with difficulty 2...`);
    newBlock.mineBlock(2);
    this.chain.push(newBlock);
    console.log("Block successfully added to the blockchain!");
  }
}

// Instantiate a new blockchain
const myBlockchain = new SimpleBlockchain();

// Add new blocks
const block1 = new SimpleBlock(1, Date.now(), "First block after genesis");
myBlockchain.addNewBlock(block1);

const block2 = new SimpleBlock(2, Date.now(), "Second block after genesis");
myBlockchain.addNewBlock(block2);

// Log the blockchain
console.log("\n--- Blockchain Structure ---");
console.log(JSON.stringify(myBlockchain, null, 2));

```

---

### **What’s Next?**

You’ve successfully built a blockchain capable of securely linking multiple blocks. But how do we ensure the chain remains valid as it grows? In the next lesson, we’ll:

1. Implement methods to validate the chain.
2. Explore what happens when someone tries to tamper with a block.

Let’s continue this journey in **Lesson 6**!