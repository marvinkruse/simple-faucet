import './Modal.css'

const Modal = ({ handleClose, show, inProgress, hash, isError }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none'

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {inProgress ? (
          <div className="modal-inprogress">
            <h1>Transaction initiated</h1>
            <div className="modal-text">
              Sending 100 testnet USDC to your account, please wait a moment.
            </div>
          </div>
        ) : isError ? (
          <div className="modal-error">
            <h1>Transaction Error</h1>
            <div className="modal-text">
              You have already used this faucet, please try again after 24
              hours.
            </div>
          </div>
        ) : (
          <div className="modal-finished">
            <h1>Request completed</h1>
            <div className="modal-text">
              Congratulations, 100 testnet USDC was sent to your account.
            </div>
            <div className="tx-div">
              <div className="tx-info">
                <div>
                  <div className="request-type">Request type</div>
                  <div className="request">100 test USDC</div>
                </div>
                <div>
                  <div className="tx-hash">Transaction hash</div>
                  <div className="hash">
                    <a
                      href={`https://mumbai.polygonscan.com/tx/${hash}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {hash}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <button id="close-btn" disabled={inProgress} onClick={handleClose}>
          Close
        </button>
      </section>
    </div>
  )
}

export default Modal
