# Adding Proof of Work

## **Introduction: Let’s Mine Some Blocks**

Alright! So, you’ve already built the basic structure of your blockchain’s blocks, complete with a unique fingerprint (hash) for each one. That’s a great start! But right now, it’s way too easy to create blocks. Imagine if anyone could generate blocks instantly—your blockchain would be vulnerable to tampering, spam, or even outright chaos.

This is where **Proof of Work (PoW)** comes in.

Think of PoW as a challenge or puzzle that every miner (block creator) has to solve before a block can be added to the blockchain. It’s not just about creating a block—it’s about proving that some effort (or work) has gone into the process. This effort ensures that the blockchain remains secure and tamper-proof.

---

## **Why Are We Demonstrating Proof of Work?**

There are many ways to secure a blockchain. These are called **consensus mechanisms**, and they ensure that all participants in the network agree on the state of the blockchain. Some examples include:

- **Proof of Stake (PoS)**: Used by Ethereum 2.0, which requires participants to “stake” cryptocurrency instead of solving puzzles.
- **Delegated Proof of Stake (DPoS)**: Used by platforms like EOS, where participants elect validators.

However, we’re sticking with a basic implementation of **Proof of Work (PoW)** because:

1. It’s one of the simplest consensus mechanisms to understand.
2. It’s incredibly popular, famously used by Bitcoin.
3. It demonstrates the concept of computational effort and tamper resistance effectively.

By implementing PoW, you’ll learn how blockchains like Bitcoin secure their network and ensure trust without needing a central authority.

---

## **Step 1: What is Proof of Work?**

Proof of Work is like solving a riddle. Here’s how it works:

1. **The Puzzle**: Miners (block creators) must find a number (called a `nonce`) that, when combined with the block’s data and hashed, produces a hash that meets specific criteria. For example, the hash might need to start with a certain number of zeros.
2. **The Effort**: Finding the right `nonce` takes time because miners have to try different values until they find one that works.
3. **The Reward**: Once a miner solves the puzzle, they get to add the block to the blockchain. and earn rewards for it !

Without PoW, anyone could create blocks instantly, making the blockchain easy to tamper with. PoW ensures:

- **Security**: Tampering with a block requires re-mining all subsequent blocks, which is computationally expensive.
- **Fairness**: Everyone has to put in effort to add a block.
- **Spam Resistance**: PoW makes block creation resource-intensive, preventing spamming or flooding of the network.

---

## **Step 2: Adding Proof of Work to the Code**

To simulate Proof of Work, we’ll add a `mineBlock` method to our `SimpleBlock` class. This method will:

1. Increment the `nonce` (a random number) until the block’s hash meets the required difficulty level.
2. Recalculate the hash each time the `nonce` changes.

Let’s dive into the code.

### **Code Snippet: The `mineBlock` Method**

Add the following method to your `SimpleBlock` class:

```jsx
mineBlock(difficultyLevel) {
  // The mining process involves finding a hash that starts with a certain number of zeros
  while (
    this.blockHeader.hash.substring(0, difficultyLevel) !==
    Array(difficultyLevel + 1).join("0")
  ) {
    this.blockHeader.nonce++; // Increment the nonce to try a new hash
    this.blockHeader.hash = this.generateHash(); // Recalculate the hash with the updated nonce
  }

  console.log(`Block mined with hash: ${this.blockHeader.hash}`);
}
```

### **Explanation of the Code**

**#1 - What is `difficultyLevel`?**

- This parameter determines how hard the puzzle is. For example:
    - A `difficultyLevel` of 2 means the hash must start with `00`.
    - A `difficultyLevel` of 3 means the hash must start with `000`.
- Higher difficulty levels require more computational effort because there are fewer hashes that satisfy the condition

**#2 - The `while` Loop:**

- This loop keeps running until the block’s hash meets the difficulty criteria.
- The condition:

```jsx
this.blockHeader.hash.substring(0, difficultyLevel) !==
Array(difficultyLevel + 1).join("0")
```

- Checks if the hash starts with enough zeros.
- `Array(difficultyLevel + 1).join("0")` generates a string of zeros equal to the difficulty level.

**#3 - Incrementing the `nonce`:**

- Each time the loop runs, the `nonce` is incremented:

```jsx
this.blockHeader.nonce++;
```

- The `nonce` is added to the block’s data, so every time it changes, the block’s hash changes.

**#4 - Recalculating the Hash:**

- The hash is recalculated with the updated `nonce`:

```jsx
this.blockHeader.hash = this.generateHash();
```

**#5 - Logging the Result:**

- Once a valid hash is found, the loop exits, and the hash is logged:

```jsx
console.log(`Block mined with hash: ${this.blockHeader.hash}`);
```

---

## **Step 3: Mining a Block**

Now, let’s put this method to work by creating and mining a block.

### **Code Snippet: Mining a Block**

Replace the code at the end of the file (the one after the class definition) with the following snippet to test the `mineBlock` method:

```jsx
// Creating a new block
const newBlock = new SimpleBlock(1, Date.now(), "This is a mined block", firstBlock.blockHeader.hash);

// Mining the new block
console.log("Mining the new block...");
newBlock.mineBlock(2); // Difficulty level of 2

// Displaying the mined block
console.log("Here is your mined block:", newBlock);
```

---

## **Run the Code**

Run your program by typing this in your terminal:

```bash
node blockchain.js
```

When you run the program, you’ll see output similar to this:

```
Mining the new block...
Block mined with hash: 00e93f2c49c1d0ed91ab3e5e0fd59a6b2c38cbeea1d29f8d
Here is your mined block: {
  blockHeader: {
    index: 1,
    timestamp: 1691234567890,
    previousHash: '4bf7816ee3...',
    hash: '00e93f2c49c1d0...',
    nonce: 37456
  },
  blockBody: {
    data: 'This is a mined block'
  }
}
```

> What to look for: Notice how the hash has a couple of zeros at the front. you can tweak it by increasing the difficulty level.
> 

---

***Here is the reference code for this lesson : [Adding proof of work](https://github.com/The-Web3-Compass/web3-compass-data-repository/blob/main/buildlab/build-your-own-blockchain/reference-code/building-the-block/adding-proof-of-work.js)***

---

## **Mining in Real-World Blockchains**

Mining in this example is simplified to help you understand the process, but in real-world blockchains like Bitcoin, mining is a **complex and resource-intensive** process. Here are some key differences:

1. **Difficulty Adjustment**: In networks like Bitcoin, the difficulty level automatically adjusts based on how fast blocks are being mined. If miners solve puzzles too quickly, the network makes the puzzles harder.
2. **Computational Effort**: Mining real blocks requires massive computational power, involving specialized hardware called ASICs (Application-Specific Integrated Circuits).
3. **Energy Consumption**: The energy required to mine blocks in networks like Bitcoin is enormous, which is why some consider PoW energy-intensive.
4. **Decentralized Competition**: Miners worldwide compete to solve the puzzle. Only the first miner to solve it gets to add the block to the chain and claim the reward.

In this lesson, we’ve simplified the process to focus on understanding the concept. Our `mineBlock` method is a basic implementation of Proof of Work that mimics how the algorithm works on a smaller scale.

---

## **What’s Next?**

You’ve implemented Proof of Work and mined your first block. But a blockchain isn’t just a collection of blocks—it’s a **chain** of blocks, each linked to the one before it. In the next lesson, we’ll:

1. **Link Blocks Together**: Learn how the `previousHash` connects blocks into a chain.
2. **Validate the Blockchain**: Ensure that the chain is secure and hasn’t been tampered with.
3. **Explore Real-World Applications**: See how these concepts apply to real blockchains like Bitcoin.

Ready to link your blocks into a tamper-proof chain? Let’s dive into **Lesson 5**!