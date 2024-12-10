// Importing the crypto module for hashing
const crypto = require("crypto");

class SimpleBlock {
  constructor(blockIndex, timestamp, blockData, previousBlockHash = "") {
    this.blockHeader = {
      index: blockIndex, // Position of the block in the chain
      timestamp, // When the block was created
      previousHash: previousBlockHash, // Links to the previous block
      hash: "", // This block's unique fingerprint
      nonce: 0, // Random number for mining (to be used later)
    };

    this.blockBody = {
      data: blockData, // The information stored in the block
    };

    // Generate the hash for this block
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
}

// Creating the first block (Genesis Block)
const firstBlock = new SimpleBlock(0, Date.now(), "Genesis Block", "0");

// Displaying the first block with its hash
console.log("Here is your first block with a hash:", firstBlock)