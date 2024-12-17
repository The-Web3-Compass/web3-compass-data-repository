# Setting Up The Enviornment

## **The Journey Begins Here**

Alright, so you’re pumped up to build your very own blockchain. But before we dive into the nitty-gritty of creating blocks and linking them like digital wizards, we need to gear up. Think of this as packing your toolkit before heading out on a treasure hunt. No one goes hunting for treasure without a map, compass, and maybe a snack or two.

In this lesson, we’re going to:

1. Set up the tools you’ll need to build and run your blockchain.
2. Create a home (project folder) for your blockchain baby.
3. Write the very first lines of code to prepare for the magic ahead.

Let’s get started!

## **Step 1: Install Node.js**

First up, you need **Node.js**. Why? Because Node.js lets you run JavaScript outside the browser, which means we can use it to write and execute our blockchain code.

### **Installing Node.js**:

1. Go to the [official Node.js website](https://nodejs.org/).
2. Download the **LTS version** (long-term support—it’s stable and beginner-friendly).
3. Follow the installation steps for your operating system.

### **Verify the Installation**:

After installing, open your terminal (Command Prompt, PowerShell, or Terminal on Mac/Linux) and type:

```bash
node -v
```

You should see a version number like `v18.16.0` (or newer). If you see this, you’re all set! 🎉

---

## **Step 2: Set Up Your Project Folder**

Think of your project folder as the home base for all your blockchain files. Here’s how to set it up:

1. Create a new folder called `my-blockchain`. You can do this anywhere on your computer.
2. Open your terminal and navigate to the folder:(Replace `path/to` with the actual path to your folder.)

```bash
cd path/to/my-blockchain
```

---

## **Step 3: Initialize the Project**

Every Node.js project needs a `package.json` file to keep track of dependencies (libraries) and project metadata. Let’s create one.

1. In your terminal, run:

```bash
npm init -y
```

This command initializes the project and automatically creates a `package.json` file with default settings.

1. You should now see a new file in your folder called `package.json`. This file will grow as we add libraries later.

---

## **Step 4: Create Your First File**

Let’s create the file where all the blockchain magic will happen.

1. Inside the `my-blockchain` folder, create a new file called `blockchain.js`.
2. Open it in your favorite code editor (e.g., Visual Studio Code, Sublime Text, or any editor you like).

This file will eventually hold all the code for your blockchain, from creating blocks to mining them. For now, let’s just write a simple “Hello, Blockchain!” program to test everything is working.

---

## **Step 5: Write Your First Code**

Open `blockchain.js` and add this code:

```jsx
console.log("Hello, Blockchain!");
```

Save the file. Simple, right? This line is just to make sure your setup is working. Now, let’s test it.

## **Step 6: Run Your First Code**

In your terminal, make sure you’re still inside the `my-blockchain` folder. Then run:

```bash
node blockchain.js
```

If everything is set up correctly, you should see this in your terminal:

```
Hello, Blockchain!
```

🎉 Congratulations! You’ve just run your first piece of code in the blockchain project. It’s a small step, but every great journey begins with one.

---

## **What’s Next?**

Now that your environment is ready and your tools are in place, we’re going to start building the foundation of your blockchain. In the next lesson, we’ll create our first block—a container for storing data—and calculate its unique fingerprint (hash). This is where things get really exciting!