import classnames from 'classnames'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import RectoDebug from './RectoDebug'
import withSelectors from '../hocs/withSelectors'
import { getOffer } from '../selectors/offer'
import { getMediation } from '../selectors/mediation'
import selectOffer from '../selectors/offer'
import { getSource } from '../selectors/source'
import { getThumbUrl } from '../selectors/thumbUrl'
import selectUserMediation from '../selectors/userMediation'
import { IS_DEV } from '../utils/config'

import Icon from './Icon'

const Recto = ({ mediation,
  thumbUrl,
  isFlipped
}) => {
  const backgroundStyle = { backgroundImage: `url('${thumbUrl}')` };
  const thumbStyle = Object.assign({}, backgroundStyle);
  if (mediation) {
    thumbStyle.backgroundSize='cover';
  }
  return (
    <div className='recto'>
      <div className='background' style={backgroundStyle} />
      {
        thumbUrl && (
          <div style={thumbStyle} className={classnames('thumb', {
            translated: isFlipped
          })} />
        )
      }
      {IS_DEV && <RectoDebug {...this.props} />}
   </div>
  )
}

export default compose(
  connect(
    (state, ownProps) => ({
      currentOffer: selectOffer(state),
      currentUserMediation: selectUserMediation(state),
      isFlipped: state.verso.isFlipped,
      userMediations: state.data.userMediations
    })),
  withSelectors({
    userMediation: [
      ownProps => ownProps.id,
      ownProps => ownProps.userMediations,
      (id, userMediations) => id && userMediations &&
        userMediations.find(um => um.id === id)
    ],
    mediation: [
      (ownProps, nextState) => nextState.userMediation,
      userMediation => getMediation(userMediation)
    ],
    offer: [
      ownProps => ownProps.currentUserMediation,
      ownProps => ownProps.currentOffer,
      (ownProps, nextState) => nextState.userMediation,
      (currentUserMediation, currentOffer, userMediation) => {
        if (!currentUserMediation
            || !userMediation
            || !userMediation.userMediationOffers
            || userMediation.userMediationOffers.length === 0) {
          return
        }
        if (currentUserMediation.id === userMediation.id) {
          return currentOffer
        }
        const userMediationOffers = userMediation.userMediationOffers
        const offerId = userMediationOffers[
          Math.floor(Math.random() * userMediationOffers.length)].id
        return getOffer(userMediation, offerId)
      }
    ],
    thumbUrl: [
      (ownProps, nextState) => nextState.mediation,
      (ownProps, nextState) => nextState.offer,
      (mediation, offer) => {
        const source = getSource(mediation, offer)
        return getThumbUrl(mediation, source, offer)
      }
    ]
  })
)(Recto)
