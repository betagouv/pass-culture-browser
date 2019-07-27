import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Recto from '../../../../recto/Recto'
import Verso from '../../../../verso/Verso'
import getAreDetailsVisible from '../../../../../helpers/getAreDetailsVisible'
import { getHeaderColor } from '../../../../../utils/colors'

export class Card extends PureComponent {
  componentDidMount() {
    const { handleReadRecommendation, position, recommendation } = this.props

    const isFirstHasJustBeenRead = position === 'previous'
    if (isFirstHasJustBeenRead) {
      handleReadRecommendation(recommendation)
    }
  }

  componentDidUpdate(prevProps) {
    const {
      handleClickRecommendation,
      handleReadRecommendation,
      match,
      recommendation,
      position,
    } = this.props
    const areDetailsNowVisible = getAreDetailsVisible(match) &&
      !getAreDetailsVisible(prevProps.match)

    const isCurrent = recommendation && position === 'current'

    const hasJustBeenRead =
      position === 'previous' &&
      (recommendation && recommendation.id) !==
        (prevProps.recommendation && prevProps.recommendation.id)
    if (hasJustBeenRead) {
      handleReadRecommendation(recommendation)
    }

    if (!isCurrent) return

    const shouldRequest = areDetailsNowVisible && !recommendation.isClicked
    if (!shouldRequest) return

    handleClickRecommendation(recommendation)
  }

  render() {
    const {
      firstMatchingBooking,
      match,
      position,
      recommendation,
      width
    } = this.props
    const { firstThumbDominantColor, index } = recommendation || {}
    const areDetailsVisible = getAreDetailsVisible(match)
    const headerColor = getHeaderColor(firstThumbDominantColor)
    const isCurrent = position === 'current'
    const translateTo = index * width
    return (
      <div
        className={`card ${isCurrent ? 'current' : ''}`}
        style={{
          backgroundColor: headerColor || '#000',
          transform: `translate(${translateTo}px, 0)`,
        }}
      >
        {recommendation && isCurrent && (
          <Verso
            areDetailsVisible={areDetailsVisible}
            booking={firstMatchingBooking}
            recommendation={recommendation}
          />)}
        {recommendation && (
          <Recto
            areDetailsVisible={areDetailsVisible}
            position={firstMatchingBooking}
            recommendation={recommendation}
          />)}
      </div>
    )
  }
}

Card.defaultProps = {
  firstMatchingBooking: null,
  recommendation: null,
}

Card.propTypes = {
  firstMatchingBooking: PropTypes.shape(),
  handleClickRecommendation: PropTypes.func.isRequired,
  handleReadRecommendation: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      detais: PropTypes.string
    }).isRequired
  }).isRequired,
  position: PropTypes.string.isRequired,
  recommendation: PropTypes.shape(),
  width: PropTypes.number.isRequired,
}

export default Card
