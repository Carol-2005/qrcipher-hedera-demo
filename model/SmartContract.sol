// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ProductStorage {
    address private owner;
    mapping (string => bool) private ipfsCidList;

    event ProductAdded(string ipfsCid, uint timestamp);

    modifier OnlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    //@notice this function is to store the batches of product cids to be sent to the network
    //currently the limit is 10
    function addProduct(string[] calldata _ipfsCids) external OnlyOwner {
        for (uint i = 0; i < _ipfsCids.length; i++) { 
            ipfsCidList[_ipfsCids[i]] = true;
            emit ProductAdded(_ipfsCids[i], block.timestamp);
        }
    }

    //@notice this function is to check if the product cid is present in the network
    function checkProduct(string calldata _cid) public view returns (bool) {
        return ipfsCidList[_cid];
    }
}