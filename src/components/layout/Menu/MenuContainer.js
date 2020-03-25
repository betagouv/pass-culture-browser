import { connect } from 'react-redux'
import { selectCurrentUser } from '../../../selectors/data/usersSelectors'

import Menu from './Menu'
import { toggleOverlay } from '../../../reducers/overlay'

export const mapStateToProps = state => ({
  currentUser: selectCurrentUser(state),
  readRecommendations: state.data.readRecommendations,
})

export const mapDispatchToProps = dispatch => ({
  toggleOverlay: () => dispatch(toggleOverlay()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)
