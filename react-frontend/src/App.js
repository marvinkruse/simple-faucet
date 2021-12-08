import './App.css'
import { useState, useEffect } from 'react'
import CorrectNetwork from './components/CorrectNetwork'
import IncorrectNetwork from './components/IncorrectNetwork'
import Web3 from 'web3'

function App() {
  //////////////////////////////////////////////////////////////////////////////
  ////     INSERT YOUR NODE RPC URL, NETWORK ID AND GAS PRICE HERE        //////
  //////////////////////////////////////////////////////////////////////////////
  var rpcURL = 'https://rpc-mumbai.maticvigil.com'
  let networkID = 80001
  var minGasPrice = 0
  //////////////////////////////////////////////////////////////////////////////
  ////     INSERT THE TOKEN AND FAUCET ADDRESS HERE                       //////
  //////////////////////////////////////////////////////////////////////////////
  var token_address = '0xe11A86849d99F524cAC3E7A0Ec1241828e332C62'
  var faucet_address = '0x188b2685030137b9105d302E30F0D280F7Fa814A'
  //////////////////////////////////////////////////////////////////////////////

  const web3 = new Web3('https://matic-mumbai.chainstacklabs.com')
  const [currentNetwork, setCurrentNetwork] = useState(
    web3.givenProvider.networkVersion,
  )
  // boolean to check if user is on the correct network
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(
    parseInt(currentNetwork) === parseInt(networkID),
  )

  // checks for metamask, adds event listener
  useEffect(() => {
    if (window.ethereum) {
      // detect Network account change
      window.ethereum.on('chainChanged', (networkId) => {
        console.log('chainChanged', networkId)
        setCurrentNetwork(networkId)
      })
    } else {
      alert('Please install Metamask to use this faucet')
    }
  }, [])

  // checks if correct network when user switches networks
  useEffect(() => {
    console.log('checking network...')
    setIsCorrectNetwork(parseInt(currentNetwork) === parseInt(networkID))
  }, [currentNetwork])

  return (
    <div className="App">
      <h1>Swan Faucet</h1>

      <div id="description">
        <p id="intro">
          Welcome to the Swan Faucet, a minimalistic ERC20-token faucet for
          Ethereum. Developing dApps or smart contracts requires you to test
          what you have built. Since begging for tokens face-to-face is
          outdated, this faucet offers a very easy smart contract based
          solution. Just click the button below and you will receive some test
          tokens. The only thing that you need is Metamask..
        </p>
      </div>

      {isCorrectNetwork ? <CorrectNetwork /> : <IncorrectNetwork />}
    </div>
  )
}

export default App
