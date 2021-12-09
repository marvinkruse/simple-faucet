import { React, useState, useEffect } from 'react'

const CorrectNetwork = (props) => {
  const web3 = props.web3
  const [account, setAccount] = useState('')
  const [accountBalance, setAccountBalance] = useState(0)

  // whenever the textfield changes, check if it is valid address, then get MATIC balance of address
  const handleChange = async (e) => {
    const address = e.target.value
    setAccount(address)
    if (web3.utils.isAddress(address)) {
      const balance = await web3.eth.getBalance(address)
      setAccountBalance(web3.utils.fromWei(balance, 'ether'))
    } else {
      setAccountBalance(0)
    }
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
        <div id="balanceETH">{accountBalance}</div>

        <h2>Your Token Balance:</h2>
        <div id="balanceToken">0</div>

        <button id="faucet-btn">Request 100 Tokens</button>
      </div>
    </div>
  )
}

export default CorrectNetwork
