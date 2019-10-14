import React from 'react'
import PropTypes from 'prop-types'

const Wallet = ({ value }) => (
  <div id="verso-wallet">
    <small
      className="is-block"
      id="verso-wallet-label"
    >
      {'Mon pass'}
    </small>
    <span
      className="is-block"
      id="verso-wallet-value"
    >
      {`${value}\u00a0€`}
    </span>
  </div>
)

Wallet.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}

export default Wallet
