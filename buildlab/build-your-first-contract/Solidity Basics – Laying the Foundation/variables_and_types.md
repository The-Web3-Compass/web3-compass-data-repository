#### Understanding Variables and Types

---

Now, let's dive into one of the most fundamental aspects of programming: **variables**. Variables allow us to store data that our contract can use and manipulate.

1.  **Basic Data Types**\
    Solidity has several basic types, each serving a unique purpose:

    - **`uint`**: Unsigned integer, which means it can only hold non-negative numbers (like `0`, `1`, `100`).

      `uint public myNumber = 42;`

    - **`string`**: Text data. In Solidity, strings are surrounded by double quotes.

      `string public myText = "Hello, World!";`

    - **`bool`**: Represents `true` or `false`.

      `bool public isActive = true;`

    - **`address`**: Holds Ethereum addresses, useful when you want to identify accounts.

      `address public myAddress = 0x123456789abcdef0;`

2.  **State Variables vs. Local Variables**

    - **State Variables**: Declared outside functions and stored on the blockchain (persistent).
    - **Local Variables**: Declared inside functions and only accessible within them (temporary).

3.  **Visibility**\
    Solidity allows us to define the visibility of variables with keywords like `public`, `private`, etc. Here's what they mean:

    - **`public`**: Accessible by anyone, including other contracts.
    - **`private`**: Only accessible within the contract itself.

**Practice Task**

- In your `Basics.sol` contract, add a few state variables: a `uint`, `string`, `bool`, and `address`, each with `public` visibility.
- Try running the code to see how they appear in Remix when you deploy the contract.

Understanding data types is essential for managing information in your smart contract. Now that we know how to define variables, let's apply this knowledge to build a functional CRUD system in the next lesson.

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
