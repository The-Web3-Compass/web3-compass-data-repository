# Contract Walkthrough - Part 1: The Main Swap Function

Now we add the heart of the contract—the function that initiates swaps.

---

## The initiateSwap Function

```solidity
function initiateSwap(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 amountOut,
    uint256 solverFee,
    uint256 destinationChainId,
    address recipient
) external returns (bytes32 requestId) {
    // Validation
    require(amountIn > 0, "Amount must be greater than zero");
    require(solverFee > 0, "Solver fee must be greater than zero");
    require(recipient != address(0), "Invalid recipient address");
    require(destinationChainId != block.chainid, "Cannot swap to same chain");
    
    // Calculate total amount needed: swap amount + solver fee
    uint256 totalAmount = amountIn + solverFee;
    
    // Transfer tokens from the caller to this contract
    // The caller must have approved this contract first
    require(
        IERC20(tokenIn).transferFrom(msg.sender, address(this), totalAmount),
        "Transfer failed - check allowance"
    );
    
    // Approve the Router to spend our tokens
    require(
        IERC20(tokenIn).approve(address(router), totalAmount),
        "Approval failed"
    );
    
    // Call the Router to request the cross-chain swap
    requestId = router.requestCrossChainSwap(
        tokenIn,
        tokenOut,
        amountIn,
        amountOut,
        solverFee,
        destinationChainId,
        recipient
    );
    
    // Emit event for tracking
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
```

---

## Understanding the Function Flow

**1. Validation**: We check all the inputs. Are amounts positive? Is the recipient valid? Are we actually trying to swap to a different chain? Never trust user input.

**2. Calculate Total Amount**: Remember the fee structure? You need to lock both the swap amount AND the solver fee on the source chain. The solver gets reimbursed with both after verification.

**3. Transfer Tokens In**: We pull the tokens from the caller (using `transferFrom`). This means the caller needs to have approved this contract first. This is standard ERC-20 flow.

**4. Approve the Router**: Now we approve the Router to spend the tokens we just received. The Router will lock these when we call `requestCrossChainSwap`.

**5. Request the Swap**: This is where the magic happens. We call the Router's `requestCrossChainSwap` function with all our parameters. The Router:

- Locks the tokens
- Creates a swap request
- Generates a unique request ID
- Emits events that Solvers watch

**6. Emit Event**: We emit our own event for tracking. This makes it easy to find your swap requests on block explorers.

**7. Return Request ID**: The caller gets back a unique identifier they can use to track this swap's status.
