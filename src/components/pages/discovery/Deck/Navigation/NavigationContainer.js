import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import getPriceRangeFromStocks from '../../../../../helpers/getPriceRangeFromStocks'
import { selectOfferById } from '../../../../../selectors/data/offersSelectors'
import { selectDistanceByOfferId } from '../../../../../selectors/geolocationSelectors'
import { selectStocksByOfferId } from '../../../../../selectors/data/stocksSelectors'
import withTracking from '../../../../hocs/withTracking'
import Navigation from './Navigation'

export const mapStateToProps = (state, ownProps) => {
  const { match: { params: { offerId } = {} } = {} } = ownProps
  const offer = selectOfferById(state, offerId)
  const { venue } = offer || {}
  const stocks = selectStocksByOfferId(state, offerId)
  const { isVirtual } = venue || {}

  const headerColor = 'black'
  const backgroundGradient = `linear-gradient(to bottom, rgba(0,0,0,0) 0%,${headerColor} 30%,${headerColor} 100%)`
  const distanceClue =
    venue && isVirtual ? 'offre numérique' : selectDistanceByOfferId(state, offerId)
  const priceRange = getPriceRangeFromStocks(stocks)
  const separator = offer ? '\u00B7' : ' '
  return {
    backgroundGradient,
    distanceClue,
    priceRange,
    separator,
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { match: { params: { offerId } = {} } = {} } = ownProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    trackConsultOffer: () => {
      ownProps.tracking.trackEvent({ action: 'consultOffer', name: offerId })
    },
  }
}

export default compose(
  withRouter,
  withTracking('Offer'),
  connect(
    mapStateToProps,
    {},
    mergeProps
  )
)(Navigation)
