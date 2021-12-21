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

//const faucetAddress = '0x099e67a3f29B16C6FFCC621f3c7Ddf64eAfBf632' // old faucet
const faucetAddress = process.env.FAUCET_ADDRESS
//const faucetAddress = '0x03ab3412db32c99c21f3499c3fca497948756c70' //test faucet
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
const tokenInterface = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
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

  // get faucet balance status, also remove addressese from array
  const faucetStatus = await checkFaucetBalance(tokenAddresses, tokenAmounts)

  try {
    const transaction = await faucetContract.methods
      .sendMultiTokens(tokenAddresses, tokenAmounts, checkSumAddress)
      .send({ gas: 9999999 })

    console.log(transaction.transactionHash)

    res.json([...faucetStatus, { tx_hash: transaction.transactionHash }])
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

app.listen(port, () => {
  console.log(`Faucet server listening at http://localhost:${port}`)
})

// return array of status objects for each token address and filter arrays for available tokens only
const checkFaucetBalance = async (tokenAddresses, tokenAmounts) => {
  let status = []

  for (let i = 0; i < tokenAddresses.length; i++) {
    let faucetBalance = 0
    let addressStatus = { address: tokenAddresses[i], result: 0 }

    // get faucet balance
    if (tokenAddresses[i] == '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
      faucetBalance = await web3.eth.getBalance(faucetAddress) // get MATIC balance
    } else {
      let tokenContract = new web3.eth.Contract(
        tokenInterface,
        tokenAddresses[i],
      )
      faucetBalance = await tokenContract.methods
        .balanceOf(faucetAddress)
        .call()
    }

    // if there is not enough tokens in faucet
    if (parseFloat(faucetBalance) < parseFloat(tokenAmounts[i])) {
      // change the token status
      addressStatus.result = -1
      addressStatus.err = 'running out of tokens'

      // remove from array
      tokenAddresses.splice(i, 1)
      tokenAmounts.splice(i, 1)
      i--
    }

    status.push(addressStatus)
  }

  return status
}
