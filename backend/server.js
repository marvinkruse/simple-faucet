const express = require('express')
const parser = require('body-parser')
const cors = require('cors')
const Web3 = require('web3')
require('dotenv').config()

const web3 = new Web3(
  process.env.RPC_URL || 'https://matic-mumbai.chainstacklabs.com',
)

// ENVIRONMENT VARIABLES
const port = process.env.PORT || 5000
const walletAddress = process.env.WALLET_ADDRESS
const privateKey = process.env.PRIVATE_KEY
const faucetAddress = process.env.FAUCET_ADDRESS

web3.eth.accounts.wallet.add(privateKey) // adds account using private key

console.log(process.env)

const faucetInterface = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_tokenAddresses',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_tokenAmounts',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
    ],
    name: 'sendMultiTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
const faucetContract = new web3.eth.Contract(faucetInterface, faucetAddress, {
  from: walletAddress,
})

let app = express()
app.use(parser.json())
app.use(cors())

app.post('/', async (req, res) => {
  const toAddress = req.body.account
  const checkSumAddress = await web3.utils.toChecksumAddress(toAddress)
  const tokenAmounts = req.body.amounts
  const tokenAddresses = await Promise.all(
    req.body.tokens.map(
      async (tokenAddress) => await web3.utils.toChecksumAddress(tokenAddress),
    ),
  )

  try {
    const transaction = await faucetContract.methods
      .sendMultiTokens(tokenAddresses, tokenAmounts, checkSumAddress)
      .send({ gas: 9999999 })

    console.log(transaction.transactionHash)

    res.json({ message: 'success', tx_hash: transaction.transactionHash })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

app.listen(port, () => {
  console.log(`Faucet server listening at http://localhost:${port}`)
})
