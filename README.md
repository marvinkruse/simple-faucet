# Swan Faucet

Swan Faucet is a pretty minimalistic faucet for Ethereum-based ERC20 tokens. It's based on a simple smart contract
that will allow you to withdraw some tokens every couple of minutes. The amount of tokens and the waiting period can be
defined upon deployment of the smart contract. 

**Technology Stack:** node + react.js + web3

## Container Installation

Running Swan Faucet as a container is the recommended way of using it.

### Prerequisites

#### Install Docker Compose

https://docs.docker.com/compose/install/

### Environment

Before deploying, you need to set environment variables in a `.env` file inside the `backend` directory, an
example `.env.example` file is provided

- `WALLET_ADDRESS` the address of signer that will be calling the function on the server-side
- `PRIVATE_KEY` the private key of this wallet address
- `RPC_URL` the url of the RPC server/node (defaults to `https://matic-mumbai.chainstacklabs.com`)
- `PORT` the localhost port the server is running on (defaults to 5000)

For the frontend, you need to set environment variables inside the `vue-frontend/config` directory

- `NODE_ENV` production or development,
- `BASE_API` the base API for the UI
- `BASE_NETWORK` the base RPC network
- `TOKEN_ADDRESS` the token address
- `FAUCET_ADDRESS` the address of the faucet contract
- `MATIC_TOKEN_ADDRESS` native token address
- `GOOGLE_KEY` key for google recaptcha service

### Stable

Run the following command to run the latest stable image of Swan Faucet

```bash
docker-compose up
```

You can check the service at:

http://127.0.0.1:8080

http://172.21.0.2:8080

http://localhost:8080

## Install from Source

### Prerequisites

[Install `npm`](https://nodejs.org/en/download/). (Version v14.18.1 of Node was used for this project) Both the front
and backend use `npm` as the package manager.

### Install Dependencies

#### Backend

- `cd backend`
- `npm install`
- `cd ..`

#### Frontend

- `cd vue-frontend`
- `npm install`
- `cd ..`

### Build Frontend

`npm run build` should build the project. The build artifacts will be stored in the `build/` directory

## Reference Documents

- [node.js](https://nodejs.org/en/docs/)
- [react.js](https://reactjs.org/)
- [web3.js](https://web3js.readthedocs.io/en/v1.5.2/)
