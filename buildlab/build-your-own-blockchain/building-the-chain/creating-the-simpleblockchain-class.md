## **Introduction: Building the Chain That Makes the Blockchain**

You’ve done an incredible job so far—creating blocks, generating unique fingerprints (hashes) for them, and securing them with Proof of Work. But let’s face it, a single block (or even two) isn’t a **blockchain**, is it?

A blockchain is more than just a collection of blocks—it’s a **linked chain** of blocks, each one securely connected to the one before it. This linkage ensures tamper-proof integrity and makes the blockchain truly powerful.

In this lesson, we’ll turn your blocks into a blockchain by introducing a new class, `SimpleBlockchain`, that will handle the chain of blocks. By the end of this lesson, you’ll have a fully functional blockchain that grows securely as you add blocks.

Here’s what we’ll do:

1. Create the **genesis block**, the cornerstone of any blockchain.
2. Add methods to securely link new blocks into the chain.
3. Test the blockchain by adding blocks and visualizing its structure.

---

## **Step 1: Setting Up the `SimpleBlockchain` Class**

The `SimpleBlockchain` class is where the magic of the blockchain comes to life. It’s responsible for:

1. Managing the **entire chain** of blocks.
2. Linking each block securely to the previous one.
3. Ensuring that the chain maintains its integrity as it grows.

> Important: Before we start, ensure you’ve added the `SimpleBlock` class to your file. The `SimpleBlockchain` class will build on top of it.
> 

---

### **Instruction: Add the `SimpleBlockchain` Class**

Below your `SimpleBlock` class, add a new class named `SimpleBlockchain`. This is how we’ll transition from managing single blocks to a full blockchain.

Let’s start by adding the **genesis block**.

---

## **Step 2: Creating the Genesis Block**

Every blockchain begins with a **genesis block**, the first block in the chain. This block is special because:

1. It has no predecessor, so its `previousHash` is set to `"0"`.
2. It acts as the foundation of the blockchain. Without it, there’s no chain.

---

### **Code: Adding the Genesis Block**

Here’s the code for the `SimpleBlockchain` class that uses the `SimpleBlock` object to create the genesis block:

```jsx

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

## **How the Genesis Block is Created Using `SimpleBlock`**

### **Step 1: The `SimpleBlock` Class**

Before we dive into the `SimpleBlockchain` class, let’s quickly recap the `SimpleBlock` class. Here’s what it does:

1. **Structure of a Block:**
    - The `SimpleBlock` class defines what a block looks like: its index, timestamp, data, the hash of the previous block, and its unique hash.
2. **Hashing and Mining:**
    - It uses a cryptographic hash function (`generateHash`) to create a unique fingerprint for the block.
    - The block can also be mined using the `mineBlock` method.

The `SimpleBlock` class is the blueprint for creating blocks.

### **Step 2: Using `SimpleBlock` in the Genesis Block**

In the `SimpleBlockchain` class, the `createGenesisBlock` method calls the `SimpleBlock` constructor to create a new block:

```jsx

return new SimpleBlock(0, Date.now(), "Genesis Block", "0");
```

Here’s what’s happening step by step:

1. **Calling the Constructor:**
    - The `SimpleBlock` constructor is called with these arguments:
        - `0`: The index of the block (the genesis block is always the first block, so its index is `0`).
        - `Date.now()`: The timestamp of when the block is created.
        - `"Genesis Block"`: The data stored in the genesis block.
        - `"0"`: The `previousHash` is set to `"0"` because the genesis block has no predecessor.
2. **Inside the `SimpleBlock` Constructor:**
    - The `blockHeader` object is created, containing the block’s metadata:
        - `index`: The block’s position in the chain.
        - `timestamp`: The exact time the block was created.
        - `previousHash`: The hash of the previous block, which is `"0"` for the genesis block.
        - `hash`: Initially empty but will be generated soon.
        - `nonce`: Set to `0` initially.
    - The `blockBody` object is created to store the data (`"Genesis Block"` in this case).
    - The `generateHash` method is called to calculate a unique hash for the block based on its metadata and data.
3. **Returning the Block:**
    - Once the genesis block is created, it’s returned to the `createGenesisBlock` method, which adds it to the blockchain.

---

### **Step 3: Storing the Genesis Block**

In the `SimpleBlockchain` class’s `constructor`, the `createGenesisBlock` method is called, and the resulting block is stored in the `chain` array:

```jsx

this.chain = [this.createGenesisBlock()];
```

This ensures that every blockchain starts with the genesis block as its foundation.

With the genesis block in place, let’s add the functionality to grow the blockchain by adding new blocks.

---

## **Step 3: Adding New Blocks**

For a blockchain to grow, it must:

1. **Link each new block** to the one before it using the `previousHash`.
2. **Mine the block** to meet the Proof of Work difficulty.
3. **Add the block to the chain** once it’s valid.

---

### **Code: Adding Blocks**

Expand your `SimpleBlockchain` class with the following methods:

```jsx

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

### **What’s Happening Here?**

1. **`getLatestBlock`:**
    - Fetches the last block in the chain.
    - Ensures that each new block links to the correct predecessor.
2. **`addNewBlock`:**
    - Links the `previousHash` of the new block to the `hash` of the latest block.
    - Mines the new block using the `mineBlock` method.
    - Adds the newly mined block to the chain.

> Why it’s important: These methods enable your blockchain to grow dynamically while maintaining its integrity.
> 

---

## **Step 4: Testing the Blockchain**

Now it’s time to test your blockchain! We’ll:

1. Create an instance of `SimpleBlockchain`.
2. Add a few blocks to the chain.
3. Log the entire blockchain to visualize its structure.

---

### **Code: Testing the Blockchain**

Modify the code at the end of the file (the one after the class definitions) with the following snippet :

```jsx

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

### **Instructions for Testing**

1. **Save Your File:**
    - Save your file as `blockchain.js`.
2. **Run the File:**
    - Open your terminal, navigate to the file’s location, and run:
        
        ```bash
        
        node blockchain.js
        ```
        
3. **Observe the Output:**
    - Check the terminal for the following:
        1. Genesis block creation.
        2. Mining of each new block, including its hash.
        3. Full blockchain structure in JSON format.

---

### **Expected Output**

Here’s an example of what you should see:

```
Creating the genesis block...
Mining a new block with difficulty 2...
Block mined with hash: 00c4d5...
Block successfully added to the blockchain!
Mining a new block with difficulty 2...
Block mined with hash: 0027ab...
Block successfully added to the blockchain!

--- Blockchain Structure ---
[
  {
    "blockHeader": {
      "index": 0,
      "timestamp": 1691234567890,
      "previousHash": "0",
      "hash": "4bf7816ee3...",
      "nonce": 0
    },
    "blockBody": {
      "data": "Genesis Block"
    }
  },
  {
    "blockHeader": {
      "index": 1,
      "timestamp": 1691234570000,
      "previousHash": "4bf7816ee3...",
      "hash": "00c4d5...",
      "nonce": 34567
    },
    "blockBody": {
      "data": "First block after genesis"
    }
  },
  {
    "blockHeader": {
      "index": 2,
      "timestamp": 1691234575000,
      "previousHash": "00c4d5...",
      "hash": "0027ab...",
      "nonce": 56012
    },
    "blockBody": {
      "data": "Second block after genesis"
    }
  }
]

```

> What to look for: Notice how each block carries the hash of the previous block, creating a chained list of blocks.
> 

---

<aside>
💡

Here is the reference code for this chapter : [Creating the SimpleBlockchain class](https://github.com/The-Web3-Compass/web3-compass-data-repository/blob/main/buildlab/build-your-own-blockchain/reference-code/building-the-chain/creating-simpleblockchain-class.js)

</aside>

---

## **What’s Next?**

You’ve built a blockchain capable of linking blocks securely. But how do we ensure the chain remains valid as it grows? In the next lesson, we’ll explore **chain validation** and what happens when someone tries to tamper with a block. Let’s keep building in **Lesson 6**!