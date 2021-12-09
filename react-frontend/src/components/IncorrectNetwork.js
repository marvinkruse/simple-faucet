import React from 'react'

const IncorrectNetwork = (props) => {
  return (
    <div id="wrong_network">
      <p>
        It seems that you are <strong>not connected to the testnet</strong>.
        Please switch to it via Metamask. If you haven't added the testnet
        already, follow these simple steps:
      </p>
      <ol>
        <li>Open and unlock your Metamask</li>
        <li>Click on the network selector at the top</li>
        <li>Select "Custom RPC"</li>
        <li>
          Scroll down to "New Network" and enter the following (enable the
          advanced options):
        </li>
        <ul>
          <li>
            New RPC URL: <strong>{props.rpcURL}</strong>
            <span id="rpc_url" className="metamask_info"></span>
          </li>
          <li>
            ChainID: <strong>{props.networkId}</strong>
            <span id="network_id" className="metamask_info"></span>
          </li>
          <li>
            Nickname:{' '}
            <span className="metamask_info">
              <strong>Mumbai</strong>
            </span>
          </li>
        </ul>
        <li>Click on save and you're done!</li>
      </ol>
    </div>
  )
}

export default IncorrectNetwork
