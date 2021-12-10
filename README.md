# Swan Faucet

**Technology Stack:** node + react.js + web3

## Prerequisites

[Install `npm`](https://nodejs.org/en/download/). (Version v14.18.1 of Node was used for this project) Both the front and backend use `npm` as the package manager.

## Install Dependancies

### Backend

- `cd backend`
- `npm install`
- `cd ..`

### Frontend

- `cd react-frontend`
- `npm install`
- `cd ..`

## Deployment Server

### Backend

Before deploying, you need to set environment variables in a `.env` file inside the `backend` directory, an example `.env.example` file is provided

- `WALLET_ADDRESS` the address of signer that will be calling the function on the server-side
- `PRIVATE_KEY` the private key of this wallet address
- `PORT` the localhost port the server is running on (defaults to 5000)

Once these variables are set in the `.env` file, we can start up the server

- `cd backend`
- `node server`

### Frontend

Before deploying, you need to set environment variables in a `.env` file inside the `react-frontend` directory, an example `.env.example` file is provided

- `REACT_APP_SERVER_URL` the endpoint for the server

Once these variables are set in the `.env` file, we can start up the webpage on `localhost:3000`

- `cd react-frontend`
- `npm start`

## Build Frontend

`npm run build` should build the project. The build artifacts will be stored in the `build/` directory

## Reference Documents

- [node.js](https://nodejs.org/en/docs/)
- [react.js](https://reactjs.org/)
- [web3.js](https://web3js.readthedocs.io/en/v1.5.2/)
