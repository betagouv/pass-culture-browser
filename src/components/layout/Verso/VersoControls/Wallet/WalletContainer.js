import { connect } from 'react-redux'
import { selectCurrentUser } from '../../../../hocs/with-login/with-login'

import Wallet from './Wallet'
import formatDecimals from '../../../../../utils/numbers/formatDecimals'

export const mapStateToProps = state => {
  const currentUser = selectCurrentUser(state)
  const { wallet_balance: walletBalance } = currentUser
  const value = formatDecimals(walletBalance)

  return { value }
}

export default connect(mapStateToProps)(Wallet)
