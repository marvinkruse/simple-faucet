import { React } from 'react'
import './Header.css'

const Header = () => {
  return (
    <div id="header">
      <img id="header-logo" src="Filswan-logo.png" alt="Filswan Logo" />
      <div className="divider">|</div>
      <span id="faucet-text">FAUCET</span>
    </div>
  )
}

export default Header
