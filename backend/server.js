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

web3.eth.accounts.wallet.add(privateKey) // adds account using private key

const faucetAddress = '0x099e67a3f29B16C6FFCC621f3c7Ddf64eAfBf632'
const faucetInterface = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
    ],
    name: 'sendTokensTo',
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

  try {
    const transaction = await faucetContract.methods
      .sendTokensTo(checkSumAddress)
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
