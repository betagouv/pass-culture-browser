import get from 'lodash.get'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import withSizes from 'react-sizes'
import { compose } from 'redux'
import { NB_CARDS_REMAINING_THAT_TRIGGERS_LOAD } from '../../../../helpers/isRecommendationOfferFinished'
import selectCurrentRecommendation from '../selectors/selectCurrentRecommendation'
import selectNextRecommendation from '../selectors/selectNextRecommendation'
import selectPreviousRecommendation from '../selectors/selectPreviousRecommendation'
import selectRecommendations from '../selectors/selectRecommendations'
import Deck from './Deck'

export const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps
  const { params } = match
  const { mediationId, offerId } = params
  const currentRecommendation = selectCurrentRecommendation(state, offerId, mediationId)
  const { mediation } = currentRecommendation || {}
  const { thumbCount, tutoIndex } = mediation || {}

  const recommendations = selectRecommendations(state)
  const nbRecos = recommendations ? recommendations.length : 0

  const isFlipDisabled =
    !currentRecommendation || (typeof tutoIndex === 'number' && thumbCount <= 1)

  const nextLimit =
    nbRecos > 0 &&
    (NB_CARDS_REMAINING_THAT_TRIGGERS_LOAD >= nbRecos - 1
      ? nbRecos - 1
      : nbRecos - 1 - NB_CARDS_REMAINING_THAT_TRIGGERS_LOAD)

  const previousLimit =
    nbRecos > 0 &&
    (NB_CARDS_REMAINING_THAT_TRIGGERS_LOAD < nbRecos - 1
      ? NB_CARDS_REMAINING_THAT_TRIGGERS_LOAD + 1
      : 0)

  return {
    currentRecommendation,
    isEmpty: get(state, 'loading.config.isEmpty'),
    isFlipDisabled,
    nextLimit,
    nextRecommendation: selectNextRecommendation(state, offerId, mediationId),
    previousLimit,
    previousRecommendation: selectPreviousRecommendation(state, offerId, mediationId),
    recommendations,
  }
}

export const mapSizeToProps = ({ width, height }) => ({
  height,
  width: Math.min(width, 500),
})

export default compose(
  withRouter,
  withSizes(mapSizeToProps),
  connect(mapStateToProps)
)(Deck)
