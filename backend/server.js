const express = require('express')
const parser = require('body-parser')
const cors = require('cors')
const Web3 = require('web3')
const svgCaptcha = require('svg-captcha')
const session = require('express-session')
const tokenConfig = require('./tokenConfig')
const rateLimit = require('express-rate-limit')
const redis = require('./redis')

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

// add 24 hour rate limit
const limiter = rateLimit({
  windowMs: 60 * 1000, // 24h minutes
  max: 1, // Limit each IP to 1 requests per `window` (here 24h window),
  handler: (req, res) => res.status(429).json('rate limit exceeded'),
  skipFailedRequests: true,
})

let app = express()
app.use(
  session({
    secret: 'nbfs-swan',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 300 * 1000,
    },
  }),
  parser.json(),
)
app.use(
  cors({
    origin: '*',
  }),
)

app.set('trust proxies')

app.get('/ip', limiter, async (req, res) => res.status(200).send(req.ip))

app.get('/route', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const requests = await redis.incr(ip)
  if (requests === 1) {
    await redis.expire(ip, 60)
  }
  if (requests > 1) {
    res.status(429).send('rate limit exceeded')
  } else res.json('You have successfully hit route')
})

var HashMap = require('hashmap')
var codeMap = new HashMap()

app.get('/code', function (req, res) {
  var codeConfig = {
    size: 5,
    noise: 3,
    fontSize: 42,
    color: true,
    background: '#f5f7fa',
    width: 150,
    height: 38,
  }
  var captcha = svgCaptcha.create(codeConfig)
  var verification_code = captcha.text.toLowerCase()
  codeMap.set(verification_code, verification_code)
  var codeData = {
    img: captcha.data,
  }
  res.type('svg')
  res.status(200).send(captcha.data)
})

app.post('/', limiter, async (req, res) => {
  const verification_code = req.body.verification_code.toLowerCase()

  if (verification_code != codeMap.get(verification_code)) {
    res.status(505).json('verification code failed')
    return
  }
  codeMap.delete(verification_code)

  res.status(200).send('success')
})

app.listen(port, () => {
  console.log(`Faucet server listening at http://localhost:${port}`)
})
