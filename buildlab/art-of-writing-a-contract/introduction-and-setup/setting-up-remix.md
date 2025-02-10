# **Setting up your first contract**

## Mix it up!

Alright, now that you know what we’re building, it’s time to roll up our sleeves and write some actual Solidity code.

But before we start coding, we need a place to do it. Enter **Remix**, your new best friend for writing and testing Solidity smart contracts. If you've never heard of it before, don’t worry—I’ll walk you through everything step by step.

By the end of this lesson, you’ll:

- Know what **Remix IDE** is and why we’re using it.
- Set up **Vote.sol**, our Solidity file where we’ll build the contract.
- Understand two key Solidity elements: **SPDX license identifier** and **pragma solidity**.
- Deploy a **basic contract** on Remix to see how it all works.

Sound good? Let’s dive in.

---

## **What is Remix IDE?**

Imagine you want to bake a cake. You need a **kitchen** with an oven, utensils, and ingredients to make it happen.

Writing smart contracts is similar—you need a **coding environment** where you can write, compile, and test your contracts. That’s what **Remix IDE** is:

✅ A free, web-based Solidity editor—no downloads, no setup hassle.

✅ It comes with **everything you need** to write, test, and deploy contracts.

✅ Works right in your browser—just open it and start coding.

Basically, Remix is the fastest and easiest way to start writing Solidity.

To get started, open Remix IDE in your browser:https://remix.ethereum.org/. 

It should look something like this:

<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/buildlab/art-of-writing-a-contract/images/lesson-2/remix-Intro.gif" alt="Node" width="600" height="350" />
</p>


> ⚠️ Heads up! Remix works best in Chrome or Brave. If you’re using Safari or Edge, things might get a little weird.
> 

Now, let’s create our first Solidity file.

## **Creating a New Solidity File (`Vote.sol`)**

Now that Remix is open, let's create the file where all the magic will happen. Follow these simple steps:

1. Look at the **left sidebar** in Remix—this is where your files and folders are managed. Click on the **file explorer** icon (it looks like a little document).
2. Click the **+ (New File)** button to create a fresh Solidity file.
3. Name it **Vote.sol**—the `.sol` extension is what tells Remix (and the Solidity compiler) that this is a Solidity file.

<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/buildlab/art-of-writing-a-contract/images/lesson-2/new-sol-file.gif" alt="Node" width="600" height="350" />
</p>

That’s it! You should now have a blank screen and a new solidity file where we can start writing our contract.

---

## **Understanding the First Lines of Solidity Code**

Before we jump into building the voting system, we need to add **two important lines** at the top of our Solidity file.

These lines might seem unnecessary at first, but they **serve an important purpose**.

---

### **1️⃣ SPDX License Identifier – Why Do We Need This?**

At the very top of `Vote.sol`, write this:

```solidity

// SPDX-License-Identifier: MIT

```

If you’re wondering, *“What’s this SPDX thing? And why do I need it?”*—great question.

### **Solidity is Open Source**

Solidity is **open source**, meaning **anyone** can contribute to it. There are different versions, different improvements, and a whole community working on making it better.

When writing smart contracts, **most of the time, we are sharing our code publicly**. Whether it's deployed on Ethereum or shared in repositories, it's good practice to specify **what license** our code is under.

SPDX (Software Package Data Exchange) is a **standard way to declare software licenses**. It tells others how they can use your code.

- **MIT License** (which we’re using) is one of the most permissive open-source licenses. It basically says:*"Feel free to use, modify, and distribute this code, just don’t sue me if something goes wrong."*
- If we don’t include this, Remix will **throw a warning**—not an error, but a friendly nudge to remind us that specifying a license is a good practice.

Think of it like this: **If your code was a song, the SPDX license is you saying whether others can remix it or not.**

If you were building a private smart contract just for yourself, you *could* leave this out, but it's **always better to follow best practices**.

---

### **2️⃣ Specifying the Solidity Version – Why Does This Matter?**

Right below the SPDX license, add this:

```solidity
pragma solidity ^0.8.0;
```

This line might look small, but it’s **critical**.

### **Why do we need to specify a Solidity version?**

Remember how Solidity is **open source**? That means it’s **constantly being updated**.

- New features are added.
- Bugs are fixed.
- Old features are sometimes **removed or changed**.

By specifying a version, we make sure our code **only runs on compatible versions of Solidity**.

### **Breaking Down the Version Syntax**

- `^0.8.0` means:
    - Use **version 0.8.0 or any minor update** (like 0.8.1, 0.8.2, etc.).
    - Do **not** use older versions (like 0.7.0).

Think of Solidity like a video game. Some older game versions might not support the latest features, and some future versions might introduce changes that break your code. **By locking in a version, we make sure our contract behaves as expected.**

Now, your file should look like this:

```solidity

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0
```

Alright, now let’s write our first **actual** Solidity contract.

---

## **Declaring Our First Contract**

A Solidity **contract** is the core building block of any smart contract application. Think of it as a **blueprint**—it defines the rules, data, and behaviors that determine how the contract interacts with the blockchain.

If you’ve ever worked with **classes in JavaScript, Python, or Java**, a Solidity contract works similarly: it groups related code and data together into a single, self-contained unit. Once deployed, this contract **lives on the blockchain** and can be interacted with by users and other smart contracts.

### **Writing Our First Contract**

Let’s start by declaring a simple contract called `VotingContract`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
}

```

Right now, our contract is completely **empty**—it doesn’t store any data, run any functions, or interact with the blockchain. But that’s fine! **This is like setting up an empty stage before the actors arrive**—we're laying the foundation for everything else we’ll build in the coming lessons.

### **Breaking It Down**

Let’s break down what’s happening in our code:

1. **`contract VotingContract { }`**
    - This line defines our contract and gives it a name.
    - In Solidity, **every smart contract must have a unique name** (just like a class in other programming languages).
    - The contract's **body** (inside `{ }`) is where we will later define **state variables, functions, and events** that will bring our contract to life.
2. **Why PascalCase for Contract Names?**
    - Solidity follows a common convention where **contract names use PascalCase**.
    - PascalCase means that each word in the name starts with an **uppercase letter** (e.g., `VotingContract`, `MySmartContract`).
    - This makes it easy to distinguish contracts from variables and functions, which usually follow **camelCase** (e.g., `myVariable`).
3. **Can a Smart Contract Exist Without Any Code?**
    - Yes! The contract we wrote is **technically deployable**, even though it doesn’t do anything yet. Let’s just go ahead and try it out!

---

## **Deploying the Contract in Remix**

Now, let’s **deploy** this contract to see how it all works.

### **1️⃣ Compiling the Contract**

Before deploying our smart contract, we need to **check for errors and convert our Solidity code into a format the Ethereum Virtual Machine (EVM) can understand**. This process is called **compiling**.

### **What is Compiling?**

Solidity is a **high-level programming language**, meaning it’s written in a way that’s easy for humans to read and understand. However, **Ethereum nodes and the blockchain don’t understand Solidity directly**—they only understand **bytecode** (a low-level machine code).

The Solidity **compiler** (Solc) translates our human-readable Solidity code into **bytecode and ABI (Application Binary Interface)** so that it can be executed on the blockchain.

- **Bytecode** – The actual machine code that will run on the Ethereum Virtual Machine (EVM).
- **ABI (Application Binary Interface)** – A definition of all the contract’s functions and how external applications (like a frontend) can interact with it.

Without compiling, our contract **can’t be deployed or executed**. That’s why this step is **crucial** before moving forward.

### **How to Compile Your Contract in Remix**

Follow these steps to compile `VotingContract.sol`:

1. Click the **Solidity Compiler** tab (hammer icon 🛠) on the left panel in Remix.
2. Make sure the **compiler version** is set to **0.8.0 or higher** (this should match the version we specified in `pragma solidity`).
3. Click the **Compile VotingContract.sol** button.

If there are **no errors**, Remix will show a **green checkmark**, meaning the contract has compiled successfully and is ready to be deployed. 🎉


<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/buildlab/art-of-writing-a-contract/images/lesson-2/compile-contract.gif" alt="Node" width="600" height="350" />
</p>

> 🔍 Pro Tip: If you see warnings in Remix but not errors, your contract can still compile, but you should pay attention to those warnings—some might indicate potential issues or inefficiencies in your code.
> 

Now that we’ve successfully compiled our contract, let’s move on to **deploying it** on a test blockchain! 🚀

---

### **2️⃣ Deploying the Contract**

Now, let’s **deploy it to a test blockchain**.

1. Click the **Deploy & Run Transactions** tab (Ethereum logo).
2. Under **Environment**, select `"Remix VM (Cancun)"`.
    - This is a **fake blockchain** running inside your browser—perfect for testing.
3. Click **Deploy**.

<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/buildlab/art-of-writing-a-contract/images/lesson-2/deploy-contract.gif" alt="Node" width="600" height="350" />
</p>

Boom! Your contract is now **live** on Remix’s virtual blockchain.(Not a real blockchain)

In the **Deployed Contracts** section, you’ll see your contract listed. Click on it, and Remix will show you an interface where you can **interact with it**.

Right now, it doesn’t have any functions to interact with—but we’ll fix that soon.

---

## **Wrapping Up**

In this lesson, you:

✅ Learned what **Remix IDE** is and why we use it.

✅ Created a Solidity file, **Vote.sol**.

✅ Understood why **SPDX licenses and Solidity versions** matter.

✅ Declared a basic contract.

✅ Compiled and deployed it in Remix.

Now, our **VotingContract** exists, but it doesn’t do anything—**yet**.

In the next lesson, we’ll start **adding functionality** by introducing **state variables** and storing data inside our contract.

Ready to make this contract actually do something? Let’s move forward.