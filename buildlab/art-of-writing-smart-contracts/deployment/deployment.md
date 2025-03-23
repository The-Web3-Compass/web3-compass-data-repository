# **Deploying & Interacting with Our Contract**

## **Introduction**

Now that we have fully implemented our **voting smart contract**, the next step is to **deploy it onto a public Ethereum testnet**. So far, we have been testing the contract in **Remix**, which operates in a simulated local environment. However, deploying on a **testnet** will allow us to **simulate a real-world blockchain environment** before launching on Ethereum Mainnet.

### **Why Deploy to a Testnet?**

Deploying a smart contract on a **testnet** provides several advantages:

- **Testing in a real blockchain setting** without the need to spend real Ether.
- **Interacting with the contract via a wallet like MetaMask**, just like users would in a real-world application.
- **Ensuring the contract behaves as expected** before deploying to the Ethereum mainnet.

By the end of this lesson, you will:

- Understand **Ethereum testnets** and why they are useful.
- Learn how to **install and configure MetaMask** for testnet deployment.
- Obtain **test Ether** from a **faucet** to pay for transactions.
- Deploy the contract to **Sepolia or Holesky testnet** using Remix.
- Interact with the deployed contract **through MetaMask and Remix**.

---

## **Understanding Ethereum Testnets**

Ethereum **testnets** are alternative networks that replicate the Ethereum main blockchain but use **test Ether** instead of real Ether. These networks allow developers to **test and debug smart contracts** in a live blockchain environment **without financial risk**.

### **Supported Ethereum Testnets**

Currently, the two **officially supported Ethereum testnets** are:

1. **Sepolia Testnet**
    - The most commonly used testnet for smart contract development.
    - Supports **fast transactions** and **low gas fees**.
    - Uses **Sepolia ETH**, which can be obtained for free from a **faucet**.
2. **Holesky Testnet**
    - Primarily designed for **testing Ethereum's staking and validator setups**.
    - Supports a **larger number of validators** than Sepolia.
    - Uses **Holesky ETH**, which can also be obtained for free from a faucet.
    - Less commonly used for **smart contract deployment** compared to Sepolia.

For this lesson, we will focus on deploying to the **Sepolia testnet**, as it is **optimized for smart contract development** and has better developer support.

---

## **Step 1: Installing MetaMask**

To interact with the blockchain, you need a **wallet** that can store and manage your test Ether. The most popular Ethereum wallet for developers is **MetaMask**.

### **How to Install MetaMask**

1. **Go to the MetaMask official website**:
    - Visit [MetaMask](https://metamask.io/) and click on **"Download"**.
2. **Select your browser or mobile device**:
    - MetaMask is available for **Chrome, Firefox, Edge, and Brave**.
    - It is also available for **iOS and Android**.
3. **Install the extension**:
    - Click on **"Add to Chrome"** (or the relevant browser).
    - Confirm the installation when prompted.
4. **Create a new wallet**:
    - Follow the setup process to create a **new Ethereum wallet**.
    - **Save your secret recovery phrase** securely; this will be required to restore your wallet if needed.

Once installed, MetaMask will appear as an **extension in your browser**, allowing you to **send transactions, interact with smart contracts, and switch between networks**.

---

## **Step 2: Configuring MetaMask for Sepolia or Holesky**

By default, MetaMask is connected to **Ethereum Mainnet**, but since we are working with **testnets**, we need to configure it to use **Sepolia or Holesky**.

### **Adding Sepolia to MetaMask**

1. **Open MetaMask** and click on the **network dropdown** at the top.
2. Click **"Add Network"**.
3. If **"Sepolia"** is available, select it.
4. If not, click **"Add Network Manually"** and enter the following details:
    - **Network Name**: Sepolia
    - **RPC URL**: `https://ethereum-sepolia-rpc.publicnode.com`
    - **Chain ID**: `11155111`
    - **Currency Symbol**: ETH
    - **Block Explorer URL**: `https://sepolia.etherscan.io/`
5. Click **Save**, and MetaMask will now be connected to the **Sepolia Testnet**.

### **Adding Holesky to MetaMask (Optional)**

If you prefer to test on Holesky, follow the same steps as above but use these details:

- **Network Name**: Holesky
- **RPC URL**: `https://ethereum-holesky-rpc.publicnode.com`
- **Chain ID**: `17000`
- **Currency Symbol**: ETH
- **Block Explorer URL**: `https://holesky.etherscan.io/`

For most smart contract deployments, **Sepolia is the recommended testnet**.

---

## **Step 3: Getting Test Ether (ETH)**

On testnets, transactions require **test Ether (ETH)** to pay for gas fees. Since testnet ETH is **not real money**, it can be obtained for free from a **faucet**.

### **Getting Sepolia ETH from a Faucet**

1. **Visit the official Sepolia faucet**:
    - Open [Sepolia Faucet](https://faucets.chain.link/sepolia).
2. **Connect your MetaMask wallet**:
    - Ensure that **MetaMask is on the Sepolia network**.
3. **Enter your wallet address**:
    - Copy your address from MetaMask and paste it into the faucet.
4. **Request test ETH**:
    - Click **"Request"**, and within a few minutes, **Sepolia ETH** will be sent to your wallet.

Once you receive the ETH, you can check your balance in **MetaMask** or on Sepolia Etherscan.

---

## **Step 4: Deploying the Contract Using Remix**

Now that we have **MetaMask configured** and **test ETH available**, we can deploy our **voting contract** to Sepolia.

### **1. Open Remix and Load Your Contract**

1. Open **Remix** in your browser.
2. Click on **File Explorer** and create a new file called **`VotingContract.sol`**.
3. Copy and paste your **voting smart contract code** into the file.

### **2. Compile the Contract**

1. Navigate to the **Solidity Compiler tab** in Remix.
2. Select **Solidity version** 
3. Click **Compile VotingContract.sol**.
4. Ensure there are **no compilation errors**.

### **3. Deploy to Sepolia**

1. Go to the **Deploy & Run Transactions tab** in Remix.
2. Change the **Environment** to **Injected Provider - MetaMask**.
3. MetaMask will prompt you to **connect to Remix**—select **Sepolia network** and confirm.

<p align="center">
        <img src="https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/buildlab/art-of-writing-smart-contracts/images/lesson-12/injected-provider.gif" alt="Node" width="600" height="350" />
</p>

1. Under **Contract**, select `VotingContract`.
2. Click **Deploy**.
3. MetaMask will prompt you to **approve the transaction**—click **Confirm**.

Once deployed, the **contract address** will appear in Remix under "Deployed Contracts". You can also view it on **Sepolia Etherscan** by searching the contract address.

---

## **Step 5: Interacting with the Deployed Contract**

After deploying the contract, you can **test its functionality** in Remix.

### **Testing Contract Functions**

1. **Add Candidates**
    - Call `addCandidate("Alice")` and `addCandidate("Bob")`.
    - Check `candidatesCount` to verify that candidates were added.
2. **Register Voters**
    - Call `registerVoter(0xYourEthereumAddress, 25)`.
    - Check `voters(0xYourEthereumAddress)` to confirm registration.
3. **Start and End Voting**
    - Call `startVoting()`, then `endVoting()` when voting is complete.
4. **Cast Votes and Get Election Results**
    - Call `vote(1)` to vote for **Alice**.
    - Call `getWinner()` to check the election results.

---

## **Conclusion – You Did It! 🎉**

Take a deep breath, step back, and give yourself a **well-deserved pat on the back**—because **you just built and deployed a fully functional voting smart contract** on the blockchain!

You didn’t just write some Solidity code—you brought **a decentralized election system to life**, deployed it to a testnet, and made it **publicly accessible on Ethereum**. That’s a big deal. Seriously.

Let’s recap your **epic journey**:

- You **designed and built** a voting contract from scratch.
- You **set up MetaMask**, connected to testnets, and grabbed some **free** (but very important) test ETH.
- You **deployed your contract** on **Sepolia**, making it a real blockchain application.
- You **interacted with your contract**—adding candidates, registering voters, casting votes, and even **retrieving the winner**!

And now? **You’ve officially joined the ranks of Solidity developers who can write, deploy, and test smart contracts in a real blockchain environment.**

So, what’s next? That’s **entirely up to you**. With this foundation, you can expand on this contract, build **new blockchain applications**, or even deploy to **Ethereum mainnet** if you’re feeling bold.

This is **your moment**—you’ve built something **real**, something **on-chain**, and that’s just the beginning. Now go forth, keep experimenting, and start building the **next big thing in Web3!** 🚀