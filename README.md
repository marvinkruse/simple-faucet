# Simple Faucet
Simple Faucet is a pretty minimalistic faucet for Ethereum-based ERC20 tokens. It's based on a simple smart contract that will allow you to withdraw some tokens every couple of minutes. The amount of tokens and the waiting period can be defined upon deployment of the smart contract. It works with Metamask in your browser, so it's very easy to use.

## How to use it
In order to use and deploy this simple faucet, you need to deploy the smart contract and the frontend. To do this follow the tutorial below.

### Smart Contract
Simply deploy the smart contract onto your chain. You need to specify the erc20 tokens' address in the constructor when deploying. By default the contract allows 100 tokens to be withdrawn every 30 minutes - feel free to change this in the `faucet.sol` smart contract (*line 9+10*).

### Frontend
You can simply put the contents of the `frontend` folder onto your preferred webserver (*it's just html and javascript*). In the `faucet.js` file you need to specify the RPC url, the network ID and the minimum gas price as well as the tokens' and the faucets address. Nothing else needs to be changed.

## Feedback, Problems, Suggestions?
Simple open up an issue in this repositoriy and I'll get back to you as soon as possible. I'm always open to your feedback and ideas on how to improve this faucet.