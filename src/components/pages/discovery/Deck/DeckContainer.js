import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import withSizes from 'react-sizes'
import { compose } from 'redux'

import Deck from './Deck'
import selectCurrentRecommendation from '../selectors/selectCurrentRecommendation'
import selectNextRecommendation from '../selectors/selectNextRecommendation'
import selectPreviousRecommendation from '../selectors/selectPreviousRecommendation'
import selectIndexifiedRecommendations from '../selectors/selectIndexifiedRecommendations'
import { getNextLimit } from './utils/limits'
import withPageTracking from '../../../../tracking/withPageTracking'

export const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps
  const { params } = match
  const { mediationId, offerId } = params

  const currentRecommendation = selectCurrentRecommendation(state, offerId, mediationId)
  const recommendations = selectIndexifiedRecommendations(state)
  const nextRecommendation = selectNextRecommendation(state, offerId, mediationId)
  const previousRecommendation = selectPreviousRecommendation(state, offerId, mediationId)

  const nbRecommendations = recommendations ? recommendations.length : 0
  const nextLimit = getNextLimit(nbRecommendations)

  return {
    currentRecommendation,
    nextLimit,
    nextRecommendation,
    previousRecommendation,
    recommendations,
  }
}

export const mapSizeToProps = ({ width, height }) => ({
  height,
  width: Math.min(width, 500),
})

export default compose(
  withPageTracking,
  withRouter,
  withSizes(mapSizeToProps),
  connect(mapStateToProps)
)(Deck)
