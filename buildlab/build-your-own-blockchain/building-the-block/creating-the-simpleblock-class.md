## **Introduction: Birth of the Block**

Congratulations! You’re about to take the first step in building your blockchain by creating its core unit—the **block**. This is where all the magic begins. Every blockchain is made up of these blocks, each one holding precious data and linking securely to the next like the links of a chain.

Before we jump into the code, let’s take a moment to understand what a block really is. A **block** is essentially a digital container that holds:

1. **Data**: The valuable information you want to store (e.g., transactions, agreements, or records).
2. **Metadata (Block Header)**: Information about the block itself, such as:
    - When it was created.
    - Its position in the chain.
    - How it’s connected to the previous block.
    - A unique fingerprint called a **hash**, which ensures its integrity.

Think of a block as a **digital vault**:

- It securely stores your data.
- It links itself to other blocks using hashes.
- Together, these blocks form an unbreakable chain.

Ready to see how it all comes together? Let’s dive in!

---

## **Step 1: Importing the Hashing Library**

Every block in a blockchain needs a **hash** to ensure its integrity. A hash is like a fingerprint—unique to the block and impossible to replicate without knowing the exact contents of the block. Even a tiny change to the block’s data results in a completely different hash, making tampering obvious.

To generate hashes, we’ll use Node.js’s built-in `crypto` module. It’s like our block’s fingerprint machine.

### **Code Snippet: Importing the Crypto Module**

Open your `blockchain.js` file and add this line at the top:

```jsx

// Importing the crypto module for hashing
const crypto = require("crypto");

```

> Why this is important: The crypto module provides cryptographic functions, including the SHA-256 algorithm we’ll use to generate hashes. It’s built into Node.js, so there’s no need to install anything.
> 

---

## **Step 2: Defining the `SimpleBlock` Class**

Now let’s create the blueprint for our block. Every block has two main parts:

1. **Header**: This contains metadata about the block, such as its position (`index`), timestamp (`timestamp`), hash of the previous block (`previousHash`), and its unique fingerprint (`hash`).
2. **Body**: This is where the block stores the actual data you want to protect.

Let’s define our block structure in code.

### **Code Snippet: Creating the `SimpleBlock` Class**

Add this class definition to your `blockchain.js` file:

```jsx

class SimpleBlock {
  constructor(blockIndex, timestamp, blockData, previousBlockHash = "") {
    // The metadata (header) of the block
    this.blockHeader = {
      index: blockIndex, // The block's position in the blockchain
      timestamp, // When the block was created
      previousHash: previousBlockHash, // Hash of the previous block in the chain
      hash: "", // This block's unique fingerprint (to be generated later)
      nonce: 0, // A random number used during mining
    };

    // The data (body) stored in the block
    this.blockBody = {
      data: blockData, // The actual information stored in the block
    };
  }
}

```

> What’s happening here?
> 
- We’re defining a class called `SimpleBlock` that serves as a template for all blocks in our blockchain.
- The constructor accepts four parameters:
    - `blockIndex`: The position of the block in the chain.
    - `timestamp`: The time the block is created.
    - `blockData`: The actual information stored in the block.
    - `previousBlockHash`: The hash of the previous block (defaulted to an empty string for the first block).
- The block has two main sections:
    - `blockHeader`: Contains metadata.
    - `blockBody`: Stores the actual data.

---

## **Step 3: Adding a Hashing Mechanism**

Now that we have a structure for our block, let’s add a way to calculate its hash. A **hash** is a fixed-length string that represents the contents of the block. Even the smallest change in the block will result in a completely different hash.

We’ll use the SHA-256 algorithm from the `crypto` module to create our hash.

### **Code Snippet: Adding the `generateHash` Method**

Update your `SimpleBlock` class with the following method:

```jsx
// Generates a unique hash for the block
generateHash() {
  // Extract key information from the block header
  const { index, timestamp, previousHash, nonce } = this.blockHeader;

  // Convert the block's data to a string
  const dataString = JSON.stringify(this.blockBody.data);

  // Generate a SHA-256 hash from the block's key details
  return crypto
    .createHash("sha256")
    .update(index + timestamp + previousHash + dataString + nonce)
    .digest("hex");
}

```

> What’s happening here?
> 
- The `generateHash` method takes the block’s metadata (`index`, `timestamp`, `previousHash`, `nonce`) and data.
- It converts the data into a string format using `JSON.stringify` (to handle complex data structures).
- It then uses `crypto.createHash` with the SHA-256 algorithm to generate a unique hash for the block.
- The result is a secure, fixed-length hexadecimal string.

---

## **Step 4: Automatically Generating the Hash**

To ensure every block has a hash when it’s created, we’ll call the `generateHash` method in the block’s constructor.

### **Code Snippet: Generating the Hash in the Constructor**

Update the constructor in your `SimpleBlock` class to include this line:

```jsx

this.blockHeader.hash = this.generateHash();

```

> What this does: Every time a new block is created, its hash is automatically calculated and stored in the blockHeader.
> 

---

## **Step 5: Testing Your First Block**

Let’s create our first block, often called the **Genesis Block**, and print its details to see how everything fits together.

### **Code Snippet: Creating and Printing the Genesis Block**

Add this code to the bottom of your file, after the `SimpleBlock` class definition:

```jsx

// Creating the first block (Genesis Block)
const firstBlock = new SimpleBlock(0, Date.now(), "Genesis Block", "0");

// Displaying the first block with its hash
console.log(`
  Block Details:
  Index: ${firstBlock.blockHeader.index}
  Timestamp: ${new Date(firstBlock.blockHeader.timestamp)}
  Hash: ${firstBlock.blockHeader.hash}
`);

```

> What this does:
> 
- We create a new instance of `SimpleBlock` with:
    - Index `0` (it’s the first block).
    - The current timestamp (`Date.now()`).
    - The data `"Genesis Block"`.
    - A previous hash of `"0"` (since there’s no previous block).
- We print the block’s details, including its calculated hash, to the console.

---

## **Run the Code**

Run your program by typing this in your terminal:

```bash

node blockchain.js
```

You should see the block details printed to your console, something like this:

```
Block Details:
Index: 0
Timestamp: [Current Date]
Hash: c2b7c9fae53c15790db7c64f0a9a21dcd80ebc241c03b02b42b2e01eb97e5a16
```

> What to look for: Notice how the hash is a long string of random-looking characters. This is your block’s unique fingerprint!
> 

<aside>
💡

Here is the reference code for this lesson : [Creating SimpleBlock Class](https://github.com/The-Web3-Compass/web3-compass-data-repository/blob/main/buildlab/build-your-own-blockchain/reference-code/building-the-block/creating-simpleblock-class.js)

</aside>

---

## **What’s Next?**

Amazing work! You’ve successfully created your first block and generated a secure hash for it. In the next lesson, we’ll secure your blockchain further by implementing **Proof of Work (PoW)**. This will involve “mining” blocks to make them more secure and resistant to tampering. Get ready—it’s going to be fun!