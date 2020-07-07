import { connect } from 'react-redux'
import { compose } from 'redux'
import { requestData } from 'redux-thunk-data'

import MyBookings from './MyBookings'
import { selectBookings } from '../../../redux/selectors/data/bookingsSelectors'
import withRequiredLogin from '../../hocs/with-login/withRequiredLogin'
import { myBookingsNormalizer } from '../../../utils/normalizers'
import selectIsFeatureDisabled from '../../router/selectors/selectIsFeatureDisabled'
import withPageTracking from '../../../tracking/withPageTracking'

export const mapStateToProps = state => {
  const isQrCodeFeatureDisabled = selectIsFeatureDisabled(state, 'QR_CODE')
  return {
    bookings: selectBookings(state),
    isQrCodeFeatureDisabled,
  }
}

export const mapDispatchToProps = dispatch => ({
  requestGetBookings: (handleFail, handleSuccess) => {
    dispatch(
      requestData({
        apiPath: '/bookings',
        handleFail,
        handleSuccess,
        normalizer: myBookingsNormalizer,
      })
    )
  },
})

export default compose(
  withRequiredLogin,
  withPageTracking,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MyBookings)
