import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import Footer from '../layout/Footer'
import VersoOfferInfos from './offer-infos'
import VersoWrapper from './VersoWrapper'
import currentRecommendationSelector from '../../selectors/currentRecommendation'
import VersoStaticCard from './VersoStaticCard'

const Verso = ({
  areDetailsVisible,
  currentRecommendation,
  extraClassName,
  forceDetailsVisible,
}) => {
  const { mediation } = currentRecommendation || {}
  const { tutoIndex } = mediation || {}
  const isTuto = typeof tutoIndex === 'number' && mediation

  const flipped = forceDetailsVisible || areDetailsVisible

  return (
    <div
      className={classnames('verso', extraClassName, {
        flipped,
      })}
    >
      <VersoWrapper className="with-padding-top">
        {!isTuto && <VersoOfferInfos />}
        {isTuto && <VersoStaticCard mediationId={mediation.id} />}
      </VersoWrapper>
      <Footer
        id="verso-footer"
        borderTop
        colored={typeof tutoIndex !== 'number'}
      />
    </div>
  )
}

Verso.defaultProps = {
  currentRecommendation: null,
  extraClassName: null,
  forceDetailsVisible: false,
}

Verso.propTypes = {
  areDetailsVisible: PropTypes.bool.isRequired,
  currentRecommendation: PropTypes.object,
  extraClassName: PropTypes.string,
  forceDetailsVisible: PropTypes.bool,
}

function mapStateToProps(state, ownProps) {
  const { match } = ownProps
  const {
    params: { mediationId, offerId },
  } = match

  return {
    areDetailsVisible: state.card.areDetailsVisible,
    currentRecommendation: currentRecommendationSelector(
      state,
      offerId,
      mediationId
    ),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(Verso)
