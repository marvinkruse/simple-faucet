import { React, useState } from 'react'
import axios from 'axios'
import './Faucet.css'

const Faucet = (props) => {
  const web3 = props.web3
  const faucet = props.faucetContract // faucet contract
  const token = props.tokenContract // token contract
  const server = props.server
  const [account, setAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [isValidAddress, setIsValidAddress] = useState(false)

  // whenever the textfield changes, check if it is valid address, then get MATIC and token balance of address
  const handleChange = async (e) => {
    const address = e.target.value
    setAccount(address)
    setIsValidAddress(await web3.utils.isAddress(address))
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
            //setTokenBalance(parseFloat(tokenBalance) + 100)
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
    <form id="faucet">
      <div className="faucet-inputs">
        <div className="faucet-network">
          <div className="network-label">Network</div>
          <select className="network" name="network">
            <option value="mumbai">Polygon Mumbai</option>
          </select>
        </div>

        <div className="faucet-address">
          <div className="address-label">Testnet account address</div>
          <input
            className="address-text"
            type="text"
            value={account}
            onChange={handleChange}
            placeholder="Ex: 0xA878795d2C93985444f1e2A077FA324d59C759b0"
          />
          {!isValidAddress && account != '' ? (
            <div className="error-div">
              <img className="error-icon" src="error-icon.svg" alt="error! " />
              <div className="error-text">
                Please enter a vaid ethereum address.
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <button
        id="faucet-btn"
        disabled={isLoading}
        onClick={() => buttonClicked(account)}
      >
        Request 100 USDC
      </button>

      <div className="help-div">
        <img className="help-icon" src="question.svg" alt="need help?" />
        <div className="help-text">
          Need more testnet MATIC? Get MATIC from{' '}
          <a
            className="mumbai-faucet-link"
            href="https://faucet.polygon.technology"
            target="_blank"
            rel="noreferrer noopener"
          >
            Polygon Mumbai Faucet
          </a>
        </div>
      </div>
      {/*
      <h2>Your Address:</h2>
      <input
        className="address-text"
        type="text"
        value={account}
        onChange={handleChange}
      />

      <h2>Your MATIC Balance:</h2>
      <div id="balanceETH">{maticBalance}</div>

      <h2>Your USDC Balance:</h2>
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
      */}
    </form>
  )
}

export default Faucet
