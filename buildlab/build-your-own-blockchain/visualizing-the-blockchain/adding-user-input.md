# Adding user input

---

## **Introduction: Your Blockchain, Your Data**

You’ve built a blockchain that creates blocks, mines them with Proof of Work, links them securely, and even validates itself. Pretty cool, right? But let’s be honest—it’s still a little… robotic. Hardcoding data into blocks was great for learning, but blockchains in the real world thrive on **user interaction**.

Think about it—when you hear about blockchains like Bitcoin or Ethereum, what’s the first thing that comes to mind? Transactions! People add data, and the blockchain grows dynamically. Let’s give your blockchain a taste of that real-world vibe.

By the end of this lesson, your blockchain will:

1. Accept data directly from the user (yes, you get to be the blockchain miner!).
2. Dynamically create blocks based on the input.
3. Feel like a real system—alive, interactive, and ready to grow.

Let’s breathe some life into your blockchain!

---

## **Step 1: Why Make Your Blockchain Interactive?**

Blockchains thrive on user input. Every block you add represents a piece of information that someone cares about—whether it’s a transaction, a record, or just a fun message. By making your blockchain interactive, you’re not just building a program—you’re creating a system that grows and evolves with its users.

But how do we do this? Enter the `readline` module.

---

## **Step 2: Introducing the `readline` Module**

The `readline` module in Node.js is a built-in library that allows us to interact with users directly through the terminal. Think of it as your blockchain’s voice—it asks questions, listens to the user’s input, and uses it to build new blocks.

Here’s what the `readline` module lets us do:

1. **Prompt Users for Input:** It asks for data (e.g., “What would you like to store in this block?”).
2. **Use That Input:** The blockchain takes the input, mines a new block, and adds it to the chain.
3. **Repeat the Process:** Want to add more blocks? No problem—the program will keep asking until you’re done.

---

## **Step 3: Importing the `readline` Module**

Before we dive into the code, let’s start by importing the `readline` module. Since it’s a built-in library in Node.js, you don’t need to install anything extra—just include it at the top of your file:

```jsx
// Importing the readline module for user interaction
const readline = require("readline");
```

This line gives your program access to `readline`, enabling it to interact with the user via the terminal. It’s simple, powerful, and essential for making your blockchain dynamic.

---

## **Step 4: Setting Up User Interaction**

To make your blockchain interactive, you’ll:

1. Add the `readline` module to your program.
2. Use it to prompt the user for input.
3. Dynamically add blocks to the chain based on that input.

Here’s how to do it.

### **Code: Adding User Input to Your Blockchain**

Modify the code at the end of the file (after the class declarations) with the following code :

```jsx
// Setting up the Readline Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Interactive Blockchain Function
function interactiveBlockchain() {
  const myBlockchain = new SimpleBlockchain();

  // Recursive function to add blocks
  function addBlockRecursively(blockIndex, totalBlocks) {
    if (blockIndex > totalBlocks) {
      console.log("\nFinal Blockchain Structure:");
      console.log(JSON.stringify(myBlockchain, null, 2));
      rl.close();
      return;
    }

    // Prompt the user for block data
    rl.question(`Enter data for Block ${blockIndex}: `, (blockData) => {
      const newBlock = new SimpleBlock(
        blockIndex,
        Date.now(),
        blockData,
        myBlockchain.getLatestBlock().blockHeader.hash
      );
      myBlockchain.addNewBlock(newBlock);
      addBlockRecursively(blockIndex + 1, totalBlocks); // Recursively add the next block
    });
  }

  // Prompt the user for the number of blocks
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

### **Code Walkthrough**

1. **Setting up the `readline` Interface:**
    - The `readline.createInterface` method initializes the input/output streams, allowing the program to interact with the user.
2. **Recursive Functionality:**
    - The `addBlockRecursively` function prompts the user for data for each block.
    - It adds a new block to the blockchain and then calls itself to handle the next block, continuing until all blocks are added.
3. **Dynamic Input:**
    - The first `rl.question` asks the user how many blocks they want to add.
    - The second `rl.question` prompts for block-specific data.
4. **Validation and Termination:**
    - The program checks if the user input is valid (a positive number). If not, it gracefully exits.
    - Once all blocks are added, the blockchain is displayed, and the `readline` interface is closed.

---

## **Step 5: Testing Your Interactive Blockchain**

Now it’s time to test your blockchain and see it grow dynamically based on your input.

### **Instructions:**

1. **Run the Program:**
    - Save your file and run it using:

```bash
node blockchain.js
```

1. **Enter the Number of Blocks:**
    - The program will ask how many blocks you want to add. Enter a positive number.
2. **Add Data for Each Block:**
    - For each block, the program will prompt you to enter some data. Get creative—add a message, a record, or anything you like!
3. **View the Blockchain:**
    - After adding all the blocks, the program will display the entire blockchain structure in JSON format, showing how each block links to the previous one.

---

### **Example Output**

Here’s an example of what you might see in the terminal:

```
How many blocks would you like to add? 2
Enter data for Block 1: Hello, Blockchain!
Mining a new block with difficulty 2...
Block mined with hash: 00a7b...
Block successfully added to the blockchain!

Enter data for Block 2: Learning is fun!
Mining a new block with difficulty 2...
Block mined with hash: 0024e...
Block successfully added to the blockchain!

Final Blockchain Structure:
[
  {
    "blockHeader": { ... },
    "blockBody": { "data": "Genesis Block" }
  },
  {
    "blockHeader": { ... },
    "blockBody": { "data": "Hello, Blockchain!" }
  },
  {
    "blockHeader": { ... },
    "blockBody": { "data": "Learning is fun!" }
  }
]
```

> What to look for: Notice how the blockchain is formed based on our input
> 

---

***Here is the reference code for this lesson : [Adding user input](https://github.com/The-Web3-Compass/web3-compass-data-repository/blob/main/buildlab/build-your-own-blockchain/reference-code/visualising-the-blockchain/adding-user-input.js)***

---

## **What’s Next? Making It Even Better**

Your blockchain is now interactive and dynamic! But we’re not stopping here. In the next lesson, we’ll:

1. Add a method to display the blockchain in a cleaner, more readable format.
2. Summarize the chain’s structure to make it more user-friendly.

Get ready to give your blockchain a polished, professional look. Let’s keep building!