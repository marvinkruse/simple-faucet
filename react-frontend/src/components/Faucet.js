import { React, useState } from 'react'
import axios from 'axios'

const Faucet = (props) => {
  const web3 = props.web3
  const faucet = props.faucetContract // faucet contract
  const token = props.tokenContract // token contract
  const server = props.server
  const [account, setAccount] = useState('')
  const [maticBalance, setMaticBalance] = useState(0)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState('')

  // whenever the textfield changes, check if it is valid address, then get MATIC and token balance of address
  const handleChange = async (e) => {
    const address = e.target.value
    setAccount(address)
    if (web3.utils.isAddress(address)) {
      const matic = await web3.eth.getBalance(address)
      setMaticBalance(web3.utils.fromWei(matic, 'ether'))

      const tokens = await token.methods.balanceOf(address).call()
      setTokenBalance(web3.utils.fromWei(tokens, 'ether'))
    } else {
      setMaticBalance(0)
      setTokenBalance(0)
    }
  }

  const buttonClicked = async (address) => {
    setIsLoading(true)

    // first check if the address is valid
    if (await web3.utils.isAddress(address)) {
      // check if they are allowed to withdraw (24 hours)
      const allowedToWithdraw = await faucet.methods
        .allowedToWithdraw(address)
        .call()

      if (allowedToWithdraw) {
        try {
          // send request for tokens
          const response = await sendRequest({ account: address })
          //console.log(response)

          // if success, update balance and display tx_hash
          if (response.message === 'success') {
            await timeout(3000)
            setTokenBalance(parseInt(tokenBalance) + 100)
            setTxHash(response.tx_hash)
          }
        } catch (err) {
          alert('An error occured, please try again later.')
        }
      } else {
        alert('You have already used this faucet, please try again later.')
      }
    }
    setIsLoading(false)
  }

  // send post request to server to send contract method
  const sendRequest = async (jsonObject) => {
    try {
      const response = await axios.post(server, jsonObject, {
        headers: { 'Content-Type': 'application/json' },
      })
      return response.data
    } catch (err) {
      // Handle Error Here
      console.error(err)
    }
  }

  const timeout = (delay) => {
    return new Promise((res) => setTimeout(res, delay))
  }

  return (
    <div id="faucet">
      <h2>Your Address:</h2>
      <input
        className="address-text"
        type="text"
        value={account}
        onChange={handleChange}
      />

      <h2>Your MATIC Balance:</h2>
      <div id="balanceETH">{maticBalance}</div>

      <h2>Your Token Balance:</h2>
      <div id="balanceToken">{tokenBalance}</div>

      <button
        id="faucet-btn"
        disabled={isLoading}
        onClick={() => buttonClicked(account)}
      >
        Request 100 Tokens
      </button>

      {isLoading ? <h3>Sending Tokens...</h3> : <></>}
      {txHash ? (
        <div>
          <h3>Transaction Hash:</h3>
          <a
            href={`https://mumbai.polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            {txHash}
          </a>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Faucet
