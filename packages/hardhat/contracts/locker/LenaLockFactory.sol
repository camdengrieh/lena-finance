// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract LenaLockFactory {
    event Deploy(address addr);

    function deploy(bytes memory bytecode, uint256 salt) external returns (address addr) {
        // Deploy contract using CREATE2
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        emit Deploy(addr);
    }

    // Function to compute the address where the contract will be deployed...
    function computeAddress(bytes32 salt, bytes32 bytecodeHash) public view returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                bytecodeHash
            )
        );
        return address(uint160(uint256(hash)));
    }
} 