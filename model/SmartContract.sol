// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ProductManager {
    address owner;
    constructor () {
        owner = msg.sender;
    }

    struct AssociatedAccountT {
        address accountAddress;
        uint256 timestamp;
    }

    struct ProductData {
        AssociatedAccountT[] associatedAccounts;
    }

    mapping (string => ProductData) private productHashTable;

    function storeProduct(
        string[] calldata _ipfsCids,
        address _address
    ) external {
        require(owner == msg.sender, "Only the contract owner can call this function");
        
        for (uint i = 0; i < _ipfsCids.length; i++) {
            ProductData storage unit = productHashTable[_ipfsCids[i]];
            unit.associatedAccounts.push(
                AssociatedAccountT({
                    accountAddress: _address,
                    timestamp: block.timestamp
                })
            );
        }
    }

    function addAssociateAccount(string calldata _ipfsCid, address _address) external returns (bool) {
        require(owner == msg.sender, "Only the contract owner can call this function");
        require(productHashTable[_ipfsCid].associatedAccounts.length > 0, "Product not found");

        ProductData storage unit = productHashTable[_ipfsCid];
        unit.associatedAccounts.push(
            AssociatedAccountT({
                accountAddress: _address,
                timestamp: block.timestamp
            })
        );

        return true;
    }

    function getAssociatedAccounts(string calldata _ipfsCid) external view returns (AssociatedAccountT[] memory) {
        return productHashTable[_ipfsCid].associatedAccounts;
    }

    function verifyCID(string calldata _ipfsCid) external view returns (bool) {
        return productHashTable[_ipfsCid].associatedAccounts.length > 0;
    }
}
