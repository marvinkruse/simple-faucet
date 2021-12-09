import { React, useState, useEffect } from 'react'

const CorrectNetwork = (props) => {
  const web3 = props.web3
  const faucet = props.faucetContract // faucet contract
  const token = props.tokenContract // token contract
  const [account, setAccount] = useState('')
  const [maticBalance, setMaticBalance] = useState(0)
  const [tokenBalance, setTokenBalance] = useState(0)

  // whenever the textfield changes, check if it is valid address, then get MATIC and token balance of address
  const handleChange = async (e) => {
    const address = e.target.value
    setAccount(address)
    if (web3.utils.isAddress(address)) {
      const matic = await web3.eth.getBalance(address)
      setMaticBalance(web3.utils.fromWei(matic, 'ether'))

      const tokens = await token.methods.balanceOf(address).call()
      setTokenBalance(tokens.toString())
    } else {
      setMaticBalance(0)
      setTokenBalance(0)
    }
  }

  const sendRequest = async (address) => {
    const transaction = await faucet.methods
      .requestTokens()
      .send({ from: address })

    console.log(transaction)
  }

  return (
    <div>
      <div>Correct Network!</div>
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

        <button id="faucet-btn" onClick={() => sendRequest(account)}>
          Request 100 Tokens
        </button>
      </div>
    </div>
  )
}

export default CorrectNetwork
