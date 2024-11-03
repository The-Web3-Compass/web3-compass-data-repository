#### First Steps in Solidity

---

Welcome to the exciting world of Solidity, the language of smart contracts! 🎉 Think of Solidity as a mix between JavaScript and Python, designed specifically to work with the Ethereum blockchain. This lesson will cover the essentials of Solidity syntax and help you set up the basic structure of a smart contract.

1.  **Starting with `pragma`**\
    Every Solidity file begins with a **pragma directive**. It tells the compiler which version of Solidity to use. By defining a version, we avoid compatibility issues:

    `pragma solidity ^0.8.0;`

    Here, `^0.8.0` means the contract will work with version `0.8.0` or any newer compatible versions.

2.  **Defining the Contract**\
     Next, let's define our contract. A contract is like a class in other programming languages -- it's the main structure where we define all the logic:

        `contract MyFirstContract {
        // Your code goes here

    }`

3.  **Comments in Solidity**\
    Just like other languages, you can add comments to explain your code. Solidity supports both single-line `//` and multi-line comments `/* */`.

**Practice Task**

- In Remix, create a new file called `Basics.sol`.
- Write the `pragma` line and create a contract called `MyFirstContract`.
- Add a few comments explaining each line.

This sets up our Solidity playground! Next, we'll add some variables to this contract.
