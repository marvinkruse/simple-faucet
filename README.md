# Swan Faucet

Swan Faucet is minimalistic faucet for ERC20 tokens. It's based on a faucet smart contract that will allow you to withdraw some tokens every 24 hours. The amount of tokens and the waiting period can be defined upon deployment of the smart contract.

## Frontend

The front end was built using `npx create-react-app`. It is a simple page with no routes. Inside `App.js`, the faucet owner can set the address of the faucet contract, and the address of the token contract. The ABI of the contracts should also be in `./react-frontend/src/abi`. Finally the owner should set the endpoint of the server that will make the token transfer.

## How it works

This faucet is deployed on the Polygon Mumbai network. When an address is in the text field, web3 will call `getBalance()` to display the MATIC balance of the address. The ERC-20 token contract will also call `balanceOf()` to display the token balance.

When the button is clicked, a post request is sent to the backend to transfer 100 tokens to the address. Displaying the transaction hash below.

## Backend

The backend is a simple express `server.js` file with one post route to send Tokens to a provided address. The owner will need to set the `walletAddress` and `privateKey` in this file. This address will be the signer of the send token transaction.
The request body will have one key: `{"account": <address>}` to transfer the tokens to this address.
