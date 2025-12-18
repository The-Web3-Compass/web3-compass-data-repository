# Contract Walkthrough - Part 2: Status Checking

It's useful to be able to check the status of a swap after initiating it.

---

## Adding Status Checker Functions

```solidity
function getSwapStatus(bytes32 requestId) 
    external 
    view 
    returns (IRouter.SwapRequestParametersWithHooks memory params) 
{
    params = router.getSwapRequestParameters(requestId);
    return params;
}

function isSwapExecuted(bytes32 requestId) external view returns (bool executed) {
    IRouter.SwapRequestParametersWithHooks memory params = router.getSwapRequestParameters(requestId);
    return params.executed;
}
```

These view functions let you query swap status without sending transactions. You can call them from scripts, frontend code, or other contracts.

---

## The Complete Contract

Here's your full `CrossChainSwapper.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IRouter} from "onlyswaps-solidity/src/interfaces/IRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CrossChainSwapper
 * @notice A simple contract that demonstrates cross-chain token swaps using only swaps
 * @dev This is an educational example - add proper access controls for production use
 */
contract CrossChainSwapper {
    IRouter public immutable router;
    
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
    
    constructor(address _routerAddress) {
        require(_routerAddress != address(0), "Invalid router address");
        router = IRouter(_routerAddress);
    }
    
    function initiateSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 solverFee,
        uint256 destinationChainId,
        address recipient
    ) external returns (bytes32 requestId) {
        require(amountIn > 0, "Amount must be greater than zero");
        require(solverFee > 0, "Solver fee must be greater than zero");
        require(recipient != address(0), "Invalid recipient address");
        require(destinationChainId != block.chainid, "Cannot swap to same chain");
        
        uint256 totalAmount = amountIn + solverFee;
        
        require(
            IERC20(tokenIn).transferFrom(msg.sender, address(this), totalAmount),
            "Transfer failed - check allowance"
        );
        
        require(
            IERC20(tokenIn).approve(address(router), totalAmount),
            "Approval failed"
        );
        
        requestId = router.requestCrossChainSwap(
            tokenIn,
            tokenOut,
            amountIn,
            amountOut,
            solverFee,
            destinationChainId,
            recipient
        );
        
        emit SwapInitiated(
            requestId,
            msg.sender,
            tokenIn,
            tokenOut,
            amountIn,
            amountOut,
            solverFee,
            destinationChainId,
            recipient
        );
        
        return requestId;
    }
    
    function getSwapStatus(bytes32 requestId) 
        external 
        view 
        returns (IRouter.SwapRequestParametersWithHooks memory params) 
    {
        params = router.getSwapRequestParameters(requestId);
        return params;
    }
    
    function isSwapExecuted(bytes32 requestId) external view returns (bool executed) {
        IRouter.SwapRequestParametersWithHooks memory params = router.getSwapRequestParameters(requestId);
        return params.executed;
    }
}
```

Compile it:

```bash
npx hardhat compile
```

If it compiles successfully, you're ready to deploy.
