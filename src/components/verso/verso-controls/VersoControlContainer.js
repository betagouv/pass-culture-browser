/* eslint
  react/jsx-one-expression-per-line: 0 */
import get from 'lodash.get'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import VersoControl from './VersoControl'

import { isRecommendationOfferFinished } from '../../../helpers'

import { selectBookings } from '../../../selectors/selectBookings'
import currentRecommendation from '../../../selectors/currentRecommendation'

export const getOnlineOfferUrl = (bookings, recommendation) => {
  const stocks = get(recommendation, 'offer.stocks')
  const stockIds = (stocks || []).map(o => o.id)
  const booking = bookings.find(b => stockIds.includes(b.stockId))
  const result = get(booking, 'completedUrl')
  return result
}

const mapStateToProps = (state, { match }) => {
  const { mediationId, offerId } = match.params
  const recommendation = currentRecommendation(state, offerId, mediationId)
  const stocks = get(recommendation, 'offer.stocks')
  const stockIds = (stocks || []).map(o => o.id)
  const bookings = selectBookings(state)
  const booking = bookings.find(b => stockIds.includes(b.stockId))
  const isFinished =
    isRecommendationOfferFinished(recommendation, offerId) ||
    get(booking, 'isUsed')
  return {
    isFinished,
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(VersoControl)
