// Importing the crypto module for hashing
// The crypto module is used to generate cryptographic hashes for blocks.
const crypto = require("crypto");

// Importing the readline module for user interaction
// The readline module allows interaction with users via the terminal.
const readline = require("readline");

// Class representing an individual block in the blockchain
class SimpleBlock {
  /**
   * Constructor to initialize a new block.
   * @param {number} blockIndex - The index of the block in the chain.
   * @param {number} timestamp - The timestamp when the block is created.
   * @param {string} blockData - The data to be stored in the block.
   * @param {string} previousBlockHash - The hash of the previous block in the chain.
   */
  constructor(blockIndex, timestamp, blockData, previousBlockHash = "") {
    // Metadata for the block (header)
    this.blockHeader = {
      index: blockIndex, // Position of the block in the blockchain
      timestamp, // When the block was created
      previousHash: previousBlockHash, // Link to the previous block's hash
      hash: "", // Unique fingerprint of the block (to be generated)
      nonce: 0, // A number used during mining to satisfy the difficulty
    };

    // Data stored in the block (body)
    this.blockBody = {
      data: blockData, // User-defined information stored in the block
    };

    // Generate the block's hash upon creation
    this.blockHeader.hash = this.generateHash();
  }

  /**
   * Generates a SHA-256 hash for the block using its metadata and data.
   * @returns {string} - The generated hash as a hexadecimal string.
   */
  generateHash() {
    const { index, timestamp, previousHash, nonce } = this.blockHeader;
    const dataString = JSON.stringify(this.blockBody.data); // Convert data to a string
    return crypto
      .createHash("sha256") // Use SHA-256 hash algorithm
      .update(index + timestamp + previousHash + dataString + nonce) // Combine block details
      .digest("hex"); // Produce a hexadecimal hash
  }

  /**
   * Mines the block by finding a hash that starts with a certain number of zeros.
   * @param {number} difficultyLevel - The number of leading zeros required in the hash.
   */
  mineBlock(difficultyLevel) {
    // Loop until the hash meets the difficulty criteria
    while (
      this.blockHeader.hash.substring(0, difficultyLevel) !==
      Array(difficultyLevel + 1).join("0") // Generate a string of zeros matching the difficulty
    ) {
      this.blockHeader.nonce++; // Increment the nonce for a new hash attempt
      this.blockHeader.hash = this.generateHash(); // Recalculate the hash
    }

    console.log(`Block mined with hash: ${this.blockHeader.hash}`); // Log the mined block's hash
  }
}

// Class representing the blockchain
class SimpleBlockchain {
  /**
   * Constructor to initialize the blockchain.
   * The blockchain starts with a genesis block.
   */
  constructor() {
    this.chain = [this.createGenesisBlock()]; // Initialize the chain with the genesis block
  }

  /**
   * Creates the genesis block, which is the first block in the chain.
   * @returns {SimpleBlock} - The genesis block.
   */
  createGenesisBlock() {
    console.log("Creating the genesis block...");
    return new SimpleBlock(0, Date.now(), "Genesis Block", "0"); // No previous block, so previousHash is "0"
  }

  /**
   * Retrieves the latest block in the blockchain.
   * @returns {SimpleBlock} - The most recent block in the chain.
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1]; // Return the last block in the chain
  }

  /**
   * Adds a new block to the blockchain after mining it.
   * @param {SimpleBlock} newBlock - The block to be added.
   */
  addNewBlock(newBlock) {
    // Link the new block to the latest block by setting its previousHash
    newBlock.blockHeader.previousHash = this.getLatestBlock().blockHeader.hash;

    // Mine the new block to satisfy the Proof of Work requirement
    console.log(`Mining a new block with difficulty 2...`);
    newBlock.mineBlock(2); // Adjust the difficulty level as needed

    // Add the mined block to the chain
    this.chain.push(newBlock);
    console.log("Block successfully added to the blockchain!");
  }
}

// Setting up the Readline Interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Interactive Blockchain Function
/**
 * Function to create an interactive blockchain that takes user input.
 * Allows the user to specify the number of blocks and provide data for each block.
 */
function interactiveBlockchain() {
  const myBlockchain = new SimpleBlockchain(); // Create a new blockchain

  /**
   * Recursive function to prompt the user for block data and add blocks to the chain.
   * @param {number} blockIndex - The current block index.
   * @param {number} totalBlocks - The total number of blocks to add.
   */
  function addBlockRecursively(blockIndex, totalBlocks) {
    // Base case: Stop recursion when all blocks are added
    if (blockIndex > totalBlocks) {
      console.log("\nFinal Blockchain Structure:");
      console.log(JSON.stringify(myBlockchain, null, 2)); // Display the complete blockchain
      rl.close(); // Close the readline interface
      return;
    }

    // Prompt the user for data for the current block
    rl.question(`Enter data for Block ${blockIndex}: `, (blockData) => {
      const newBlock = new SimpleBlock(
        blockIndex, // Index of the new block
        Date.now(), // Timestamp of creation
        blockData, // User-provided data
        myBlockchain.getLatestBlock().blockHeader.hash // Link to the latest block
      );
      myBlockchain.addNewBlock(newBlock); // Add the new block to the chain
      addBlockRecursively(blockIndex + 1, totalBlocks); // Recurse for the next block
    });
  }

  // Prompt the user to specify the number of blocks to add
  rl.question("How many blocks would you like to add? ", (answer) => {
    const totalBlocks = parseInt(answer);
    if (isNaN(totalBlocks) || totalBlocks <= 0) {
      console.log("Invalid input. Please enter a positive number."); // Validate input
      rl.close(); // Close the readline interface
      return;
    }
    addBlockRecursively(1, totalBlocks); // Start adding blocks
  });
}

// Run the interactive blockchain
interactiveBlockchain(); // Start the program
