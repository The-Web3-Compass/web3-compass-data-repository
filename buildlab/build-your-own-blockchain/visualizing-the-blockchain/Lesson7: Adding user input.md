# **Lesson 7: Adding User Input**

---

### **Introduction: Your Blockchain, Your Data**

Congratulations! Your blockchain is already a robust system capable of mining blocks, linking them securely, and validating itself. But let’s be honest—it still feels a bit… robotic. Hardcoding data is fine for learning, but blockchains in the real world thrive on **user interaction**. Think Bitcoin or Ethereum—users create transactions, and the blockchain records them.

Today, we’re going to take a step in that direction. By the end of this lesson, your blockchain will:

1. Accept data directly from the user.
2. Dynamically create blocks based on the input.
3. Feel a lot closer to how actual blockchains operate.

It’s time to breathe some life into your blockchain. Let’s get started!

---

### **Step 1: Introducing the `readline` Module**

The `readline` module in Node.js allows us to interact with users directly through the terminal. It will enable us to:

- Prompt users for custom block data.
- Dynamically create blocks with this data.
- Close the gap between a static program and an interactive blockchain.

Here’s how it works:

1. **Create a Readline Interface**: This connects the terminal’s input and output streams.
2. **Ask for Input**: Use `rl.question` to prompt the user for block data.
3. **Close the Interface**: Once the user is done, cleanly close the connection.

Let’s integrate `readline` into our blockchain!

---

### **Step 2: Modifying the Blockchain for User Input**

To make your blockchain interactive:

1. Use `readline` to prompt the user for data.
2. Dynamically add blocks to the chain based on the input.

---

### **Code: Adding User Input**

```jsx
javascript
Copy code
const crypto = require("crypto");
const readline = require("readline");

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

// Setting up the Readline Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Interactive Blockchain Function
function interactiveBlockchain() {
  const myBlockchain = new SimpleBlockchain();

  function addBlockRecursively(blockIndex, totalBlocks) {
    if (blockIndex > totalBlocks) {
      console.log("\nFinal Blockchain Structure:");
      console.log(JSON.stringify(myBlockchain, null, 2));
      rl.close();
      return;
    }

    rl.question(`Enter data for Block ${blockIndex}: `, (blockData) => {
      const newBlock = new SimpleBlock(
        blockIndex,
        Date.now(),
        blockData,
        myBlockchain.getLatestBlock().blockHeader.hash
      );
      myBlockchain.addNewBlock(newBlock);
      addBlockRecursively(blockIndex + 1, totalBlocks);
    });
  }

  rl.question("How many blocks would you like to add? ", (answer) => {
    const totalBlocks = parseInt(answer);
    if (isNaN(totalBlocks) || totalBlocks <= 0) {
      console.log("Invalid input. Please enter a positive number.");
      rl.close();
      return;
    }
    addBlockRecursively(1, totalBlocks);
  });
}

// Run the interactive blockchain
interactiveBlockchain();

```

---

### **Step 3: Explanation of the Code**

1. **Genesis Block Initialization**:
    - As before, the genesis block is created automatically when the blockchain is instantiated. This ensures your chain always starts with a valid foundation.
2. **Readline Interface**:
    - The `readline` module sets up an interactive session where users can input data via the terminal.
3. **Recursive Block Creation**:
    - The `addBlockRecursively` function prompts the user for data, creates a new block with the input, and appends it to the blockchain.
    - This process repeats until the desired number of blocks have been added.
4. **Input Validation**:
    - The program ensures the user enters a valid number of blocks. If the input is invalid, it exits gracefully.
5. **Dynamic Blockchain Growth**:
    - With every user-provided input, the blockchain dynamically grows, linking new blocks to the chain.

---

### **Activity: Test Your Interactive Blockchain**

1. Run the program.
2. Enter the number of blocks you’d like to add.
3. Provide data for each block when prompted.
4. Observe the final blockchain structure printed to the console.

---

### **What’s Next? Visualizing the Blockchain**

Great work! You’ve now made your blockchain interactive and user-friendly. But let’s take it a step further—let’s make the blockchain **readable and visual**. In the next lesson, we’ll:

- Implement a `displayBlockchain` method to present your chain in a user-friendly format.
- Create a summary of the chain’s structure and contents.

Ready to make your blockchain shine? Let’s keep building in **Lesson 8**