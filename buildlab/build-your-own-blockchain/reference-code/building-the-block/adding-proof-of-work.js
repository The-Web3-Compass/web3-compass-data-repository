// Importing the crypto module for hashing
const crypto = require("crypto");

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

    // Generate the hash for this block
    this.blockHeader.hash = this.generateHash();
  }

  // Generates a unique hash for the block
  generateHash() {
    const { index, timestamp, previousHash, nonce } = this.blockHeader;
    const dataString = JSON.stringify(this.blockBody.data);
    return crypto
      .createHash("sha256")
      .update(index + timestamp + previousHash + dataString + nonce)
      .digest("hex");
  }

  // Mines the block by finding a hash that satisfies the difficulty level
  mineBlock(difficultyLevel) {
    while (
      this.blockHeader.hash.substring(0, difficultyLevel) !==
      Array(difficultyLevel + 1).join("0")
    ) {
      this.blockHeader.nonce++; // Increment the nonce to try a new hash
      this.blockHeader.hash = this.generateHash(); // Recalculate the hash with the updated nonce
    }

    console.log(`Block mined with hash: ${this.blockHeader.hash}`);
  }
}

// Creating the first block (Genesis Block)
const firstBlock = new SimpleBlock(0, Date.now(), "Genesis Block", "0");
console.log("Here is your first block with a hash:", firstBlock);

// Creating and mining a new block
const newBlock = new SimpleBlock(1, Date.now(), "This is a mined block", firstBlock.blockHeader.hash);
console.log("Mining the new block...");
newBlock.mineBlock(2); // Difficulty level of 2

// Displaying the mined block
console.log("Here is your mined block:", newBlock);
