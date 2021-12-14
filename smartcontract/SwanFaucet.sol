// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface ERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);

    function balanceOf(address _address) external view returns (uint256);
}

contract SwanFaucet is OwnableUpgradeable {
    uint256 constant public tokenAmount = 10000000000; //100 token x 10^8
    uint256 constant public waitTime = 24 hours;

    ERC20 public tokenInstance;
    
    mapping(address => uint256) nextAccessTime;

    mapping(address => bool) isAdmin;

    function initialize(address _tokenInstance) public initializer {
        require(_tokenInstance != address(0));
        tokenInstance = ERC20(_tokenInstance);
    }

    function requestTokens() public {
        require(allowedToWithdraw(msg.sender), "please wait 24 hours");
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

    function sendTokensTo(address _address) public {
        require(allowedToWithdraw(msg.sender), "please wait 24 hours");
        nextAccessTime[_address] = block.timestamp + waitTime;

        // transfer after setting internal state
        tokenInstance.transfer(_address, tokenAmount);
    }

    modifier onlyAdmin {
        require(isAdmin[msg.sender], "this sender is not an admin");
        _;
    }

    function setAdmin(address _address) public onlyOwner {
        isAdmin[_address] = true;
    }

    function removeAdmin(address _address) public onlyOwner {
        isAdmin[_address] = false;
    }

    // pass in array of token addresses and the amount array to send, with a receiving address
    function sendMultiToken(address[] memory _tokenAddresses, uint[] memory tokenAmounts, address _address) public onlyAdmin {
        require(allowedToWithdraw(msg.sender), "please wait 24 hours");
        
        nextAccessTime[_address] = block.timestamp + waitTime;

        for(uint i=0; i<_tokenAddresses.length; i++) {
            require(tokenAmounts[i] <= ERC20(_tokenAddresses[i]).balanceOf(address(this)));
            ERC20(_tokenAddresses[i]).transfer(_address, tokenAmounts[i]);
        }
    }

}
