import { compose } from 'redux'
import { connect } from 'react-redux'
import { selectCurrentUser } from '../hocs/with-login/with-login'
import { withRouter } from 'react-router'

import Matomo from './Matomo'

export const mapStateToProps = state => {
  const user = selectCurrentUser(state)
  let userId = user ? user.id : 'ANONYMOUS'

  return {
    userId,
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(Matomo)
