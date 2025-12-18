# Writing the Smart Contract

Time to write some actual code. We're building a contract that can initiate cross-chain swaps. This is going to be your template for integrating only swaps into any smart contract project.

---

## The Contract Structure

Create a new file: `contracts/CrossChainSwapper.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IRouter} from "onlyswaps-solidity/src/interfaces/IRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrossChainSwapper {
    // The only swaps Router - this is the main contract we interact with
    IRouter public immutable router;
    
    // Events for tracking swaps
    event SwapInitiated(
        bytes32 indexed requestId,
        address indexed initiator,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 solverFee,
        uint256 destinationChainId,
        address recipient
    );
    
    event SwapParametersQueried(
        bytes32 indexed requestId,
        bool executed,
        uint256 requestedAt
    );
    

    constructor(address _routerAddress) {
        require(_routerAddress != address(0), "Invalid router address");
        router = IRouter(_routerAddress);
    }
    
    // We'll add functions here next
}
```

---

## Breaking Down What We Have So Far

**The imports**: We're bringing in the IRouter interface from only swaps and the standard IERC20 interface from OpenZeppelin. That's all we need.

**The router variable**: We store the Router address as an immutable variable. Immutable means it's set once in the constructor and can never change—this saves gas on every read.

**Events**: We emit events so we can track what's happening. Events are your friend when debugging cross-chain operations. You'll be checking block explorers often, and events make your life easier.

---

## Compile It

```bash
npx hardhat compile
```

If it compiles successfully, you're ready to add the main functionality.
