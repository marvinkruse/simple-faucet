const express = require('express')
const parser = require('body-parser')
const cors = require('cors')
const Web3 = require('web3')
const tokenConfig = require('./tokenConfig')
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
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
    ],
    name: 'allowedToWithdraw',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
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
  const {
    faucetStatus,
    eligibleTokens,
    eligibleAmounts,
  } = await checkFaucetStatus(tokenAddresses, tokenAmounts, checkSumAddress)

  if (eligibleTokens.length > 0) {
    try {
      const transaction = await faucetContract.methods
        .sendMultiTokens(eligibleTokens, eligibleAmounts, checkSumAddress)
        .send({ gas: 9999999 })

      console.log(transaction.transactionHash)

      res.json([...faucetStatus, { tx_hash: transaction.transactionHash }])
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  } else res.json(faucetStatus)
})

app.listen(port, () => {
  console.log(`Faucet server listening at http://localhost:${port}`)
})

// return array of status objects for each token address and filter arrays for available tokens only
const checkFaucetStatus = async (tokenAddresses, tokenAmounts, address) => {
  let faucetStatus = []
  let eligibleTokens = []
  let eligibleAmounts = []

  const allowedToWithdraw = await faucetContract.methods
    .allowedToWithdraw(address)
    .call()

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

    // get token max amount
    const tokenObject = tokenConfig.filter((tokenObject) => {
      return tokenObject.tokenAddress == tokenAddresses[i]
    })[0]

    // if there is an err (tokenAmount too large, not enough token balance) set err message
    if (
      web3.utils.toBN(faucetBalance) < web3.utils.toBN(tokenAmounts[i]) ||
      web3.utils.toBN(tokenAmounts[i]) >
        web3.utils.toBN(tokenObject.maxAmount) ||
      !allowedToWithdraw
    ) {
      // change the token status
      addressStatus.result = -1
      addressStatus.err = `running out of ${tokenObject.name} tokens`

      // change err message if token amount is too large
      if (
        web3.utils.toBN(tokenAmounts[i]) >
        web3.utils.toBN(tokenObject.maxAmount)
      )
        addressStatus.err = 'exceeding maximum amount'

      if (!allowedToWithdraw) addressStatus.err = 'please wait 24 hours'
    } else {
      eligibleTokens.push(tokenAddresses[i])
      eligibleAmounts.push(tokenAmounts[i])
    }

    faucetStatus.push(addressStatus)
  }

  return { faucetStatus, eligibleTokens, eligibleAmounts }
}
