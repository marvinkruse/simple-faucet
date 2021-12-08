// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract SwanFaucet {
    uint256 constant public tokenAmount = 100000000000000000000; //100 token
    uint256 constant public waitTime = 24 hours;

    ERC20 public tokenInstance;
    
    mapping(address => uint256) nextAccessTime;

    constructor(address _tokenInstance)  {
        require(_tokenInstance != address(0));
        tokenInstance = ERC20(_tokenInstance);
    }

    function requestTokens() public {
        require(allowedToWithdraw(msg.sender));
        nextAccessTime[msg.sender] = block.timestamp + waitTime;

        // transfer after setting internal state
        tokenInstance.transfer(msg.sender, tokenAmount);
    }

    function allowedToWithdraw(address _address) public view returns (bool) {
        if(nextAccessTime[_address] == 0) {
            return true;
        } else if(block.timestamp >= nextAccessTime[_address]) {
            return true;
        }
        return false;
    }
}
