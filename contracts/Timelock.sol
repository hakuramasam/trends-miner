// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrendsMinerTimelock is TimelockController, Ownable {
    uint256 public constant MIN_DELAY = 1 days;
    uint256 public constant MAX_DELAY = 7 days;
    address public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    address public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    address public constant CANCELLER_ROLE = keccak256("CANCELLER_ROLE");

    constructor(
        address _governor,
        uint256 _minDelay,
        uint256 _maxDelay
    ) TimelockController(_minDelay, [], []) {
        grantRole(PROPOSER_ROLE, _governor);
        grantRole(EXECUTOR_ROLE, address(this));
        grantRole(CANCELLER_ROLE, _governor);
    }

    constructor(address _governor) 
        TimelockController(MIN_DELAY, [], []) 
    {
        grantRole(PROPOSER_ROLE, _governor);
        grantRole(EXECUTOR_ROLE, address(this));
        grantRole(CANCELLER_ROLE, _governor);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) external override {
        require(
            hasRole(PROPOSER_ROLE, msg.sender),
            "TrendsMinerTimelock: only proposer can propose"
        );
        super.propose(targets, values, calldatas, descriptionHash);
    }

    function execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) external override {
        require(
            hasRole(EXECUTOR_ROLE, msg.sender),
            "TrendsMinerTimelock: only executor can execute"
        );
        super.execute(targets, values, calldatas, descriptionHash);
    }

    function cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) external override {
        require(
            hasRole(CANCELLER_ROLE, msg.sender),
            "TrendsMinerTimelock: only canceller can cancel"
        );
        super.cancel(targets, values, calldatas, descriptionHash);
    }

    function getMinDelay() external view returns (uint256) {
        return MIN_DELAY;
    }

    function getMaxDelay() external view returns (uint256) {
        return MAX_DELAY;
    }
}