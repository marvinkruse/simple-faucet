import './App.css'
import Faucet from './components/Faucet'
import Web3 from 'web3'
import faucetABI from './abi/SwanFaucet.json'
import tokenABI from './abi/USDC.json'

function App() {
  //////////////////////////////////////////////////////////////////////////////
  ////     INSERT YOUR NODE RPC URL, NETWORK ID AND GAS PRICE HERE        //////
  //////////////////////////////////////////////////////////////////////////////
  //var rpcURL = 'https://rpc-mumbai.maticvigil.com'
  //let networkID = 80001
  //var minGasPrice = 0
  //////////////////////////////////////////////////////////////////////////////
  ////     INSERT THE TOKEN AND FAUCET ADDRESS HERE                       //////
  //////////////////////////////////////////////////////////////////////////////
  var token_address = '0xe11A86849d99F524cAC3E7A0Ec1241828e332C62'
  var faucet_address = '0x099e67a3f29B16C6FFCC621f3c7Ddf64eAfBf632'
  //////////////////////////////////////////////////////////////////////////////

  //const [faucetBalance, setFaucetBalance] = useState(0)

  const web3 = new Web3('https://matic-mumbai.chainstacklabs.com')
  const faucetContract = new web3.eth.Contract(faucetABI, faucet_address)
  const tokenContract = new web3.eth.Contract(tokenABI, token_address)

  return (
    <div className="App">
      <h1>Swan Faucet</h1>

      <div id="description">
        <p id="intro">
          Get Mumbai USDC for an account on the Mumbai testnet. You can only use
          this faucet once a day.
        </p>
      </div>

      <Faucet
        web3={web3}
        faucetContract={faucetContract}
        tokenContract={tokenContract}
      />
    </div>
  )
}

export default App
