## The Complete Smart Contract

Here’s the full contract. We’ll dissect every function after:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IRouter} from "only swaps-solidity/src/interfaces/IRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrossChainPaymentGateway {
    IRouter public immutable router;
    uint256 public immutable settlementChainId;
    address public immutable settlementToken;

    enum PaymentStatus { Pending, Settled, Completed, Refunded }

    struct Payment {
        bytes32 orderId;
        address payer;
        address merchant;
        address sourceToken;
        uint256 sourceChainId;
        uint256 amountPaid;
        uint256 amountSettled;
        uint256 timestamp;
        PaymentStatus status;
        bytes32 swapRequestId;
    }

    struct Merchant {
        bool isRegistered;
        address settlementAddress;
        uint256 totalReceived;
        uint256 pendingBalance;
    }

    mapping(bytes32 => Payment) public payments;
    mapping(address => Merchant) public merchants;
    mapping(address => bytes32[]) public merchantPayments;
    mapping(bytes32 => bytes32) public swapToPayment;

    uint256 private paymentCounter;

    event PaymentInitiated(
        bytes32 indexed paymentId,
        bytes32 indexed orderId,
        address indexed merchant,
        address payer,
        uint256 sourceChainId,
        address sourceToken,
        uint256 amountPaid,
        uint256 expectedSettlement,
        bytes32 swapRequestId
    );

    event PaymentSettled(
        bytes32 indexed paymentId,
        bytes32 indexed orderId,
        address indexed merchant,
        uint256 amountSettled
    );

    event MerchantRegistered(address indexed merchant, address settlementAddress);
    event MerchantWithdrawal(address indexed merchant, uint256 amount);

    constructor(
        address _routerAddress,
        uint256 _settlementChainId,
        address _settlementToken
    ) {
        require(_routerAddress != address(0), "Invalid router");
        require(_settlementToken != address(0), "Invalid token");

        router = IRouter(_routerAddress);
        settlementChainId = _settlementChainId;
        settlementToken = _settlementToken;
    }

    function registerMerchant(address _settlementAddress) external {
        require(_settlementAddress != address(0), "Invalid address");
        require(!merchants[msg.sender].isRegistered, "Already registered");

        merchants[msg.sender] = Merchant({
            isRegistered: true,
            settlementAddress: _settlementAddress,
            totalReceived: 0,
            pendingBalance: 0
        });

        emit MerchantRegistered(msg.sender, _settlementAddress);
    }

    function updateSettlementAddress(address _newAddress) external {
        require(merchants[msg.sender].isRegistered, "Not registered");
        require(_newAddress != address(0), "Invalid address");
        merchants[msg.sender].settlementAddress = _newAddress;
    }

    function makePayment(
        address merchant,
        bytes32 orderId,
        address tokenIn,
        uint256 amountIn,
        uint256 expectedSettlement,
        uint256 solverFee
    ) external returns (bytes32 paymentId) {
        require(merchants[merchant].isRegistered, "Merchant not registered");
        require(amountIn > 0, "Amount must be > 0");
        require(solverFee > 0, "Solver fee required");
        require(block.chainid != settlementChainId, "Cannot pay on settlement chain");

        paymentId = keccak256(abi.encodePacked(
            block.chainid, msg.sender, merchant, orderId, paymentCounter++
        ));

        uint256 totalAmount = amountIn + solverFee;

        require(
            IERC20(tokenIn).transferFrom(msg.sender, address(this), totalAmount),
            "Transfer failed"
        );
        require(IERC20(tokenIn).approve(address(router), totalAmount), "Approval failed");

        address settlementAddress = merchants[merchant].settlementAddress;

        bytes32 swapRequestId = router.requestCrossChainSwap(
            tokenIn,
            settlementToken,
            amountIn,
            expectedSettlement,
            solverFee,
            settlementChainId,
            settlementAddress
        );

        payments[paymentId] = Payment({
            orderId: orderId,
            payer: msg.sender,
            merchant: merchant,
            sourceToken: tokenIn,
            sourceChainId: block.chainid,
            amountPaid: amountIn,
            amountSettled: expectedSettlement,
            timestamp: block.timestamp,
            status: PaymentStatus.Pending,
            swapRequestId: swapRequestId
        });

        swapToPayment[swapRequestId] = paymentId;
        merchantPayments[merchant].push(paymentId);

        emit PaymentInitiated(
            paymentId, orderId, merchant, msg.sender,
            block.chainid, tokenIn, amountIn, expectedSettlement, swapRequestId
        );

        return paymentId;
    }

    function getPayment(bytes32 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }

    function isPaymentSettled(bytes32 paymentId) external view returns (bool) {
        Payment memory payment = payments[paymentId];
        if (payment.timestamp == 0) return false;

        IRouter.SwapRequestParametersWithHooks memory params =
            router.getSwapRequestParameters(payment.swapRequestId);
        return params.executed;
    }

    function getMerchantPayments(address merchant) external view returns (bytes32[] memory) {
        return merchantPayments[merchant];
    }

    function getMerchantInfo(address merchant) external view returns (Merchant memory) {
        return merchants[merchant];
    }

    function getSwapStatus(bytes32 paymentId)
        external view returns (IRouter.SwapRequestParametersWithHooks memory)
    {
        Payment memory payment = payments[paymentId];
        require(payment.timestamp > 0, "Payment not found");
        return router.getSwapRequestParameters(payment.swapRequestId);
    }
}
```

Around 180 lines. Every line exists to solve one problem: coordinate cross-chain value transfer without you manually handling bridges.

Let’s break it down.

---
