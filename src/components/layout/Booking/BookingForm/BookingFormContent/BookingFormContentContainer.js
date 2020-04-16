import { connect } from 'react-redux'

import BookingFormContent from './BookingFormContent'
import { selectIsStockDuo } from '../../../../../redux/selectors/data/stocksSelectors'

export const mapStateToProps = (state, ownProps) => {
  const { offerId, values } = ownProps
  const { stockId } = values
  const isStockDuo = selectIsStockDuo(state, stockId, offerId)

  return {
    isStockDuo,
  }
}

export default connect(mapStateToProps)(BookingFormContent)
