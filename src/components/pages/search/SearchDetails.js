import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Route, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { requestData } from 'redux-saga-data'

import Booking from '../../booking'
import Recto from '../../Recto'
import Verso from '../../verso'
import currentRecommendationSelector from '../../../selectors/currentRecommendation'
import { recommendationNormalizer } from '../../../utils/normalizers'

const toRectoDraggableBounds = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
}

class SearchDetails extends Component {
  constructor() {
    super()
    this.state = { forceDetailsVisible: false }
  }

  componentDidMount() {
    const { currentRecommendation } = this.props
    if (currentRecommendation) {
      // We need to wait to go out the mount lifecycle
      // in order to force the dom to render
      // twice
      setTimeout(this.handleForceDetailsVisible)
      return
    }
    this.handleRequestData()
  }

  handleRequestSuccess = () => {
    this.handleForceDetailsVisible()
  }

  handleRequestData = () => {
    const { dispatch, match } = this.props
    const {
      params: { mediationIdOrView, offerId },
    } = match

    const mediationId =
      mediationIdOrView === 'booking' ? null : mediationIdOrView

    let apiPath = `/recommendations/offers/${offerId}`
    if (mediationId) {
      apiPath = `${apiPath}?mediationId=${mediationId}`
    }

    dispatch(
      requestData({
        apiPath,
        handleSuccess: this.handleRequestSuccess,
        normalizer: recommendationNormalizer,
      })
    )
  }

  handleForceDetailsVisible = () => {
    this.setState({ forceDetailsVisible: true })
  }

  render() {
    const { forceDetailsVisible } = this.state
    return (
      <Fragment>
        {forceDetailsVisible && (
          <Route
            path="/recherche/resultats/:option?/item/:offerId([A-Z0-9]+)/:mediationId([A-Z0-9]+)?/(booking|cancelled)/:bookingId?"
            render={route => (
              <Booking extraClassName="with-header" {...route} />
            )}
          />
        )}

        <Verso
          extraClassName="with-header"
          forceDetailsVisible={forceDetailsVisible}
        />
        <Recto
          areDetailsVisible={forceDetailsVisible}
          extraClassName="with-header"
          position="current"
        />
      </Fragment>
    )
  }
}

SearchDetails.defaultProps = {
  verticalSlideRatio: 0.3
}

SearchDetails.propTypes = {
  currentRecommendation: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  verticalSlideRatio: PropTypes.number
}

function mapStateToProps(state, ownProps) {
  const { match } = ownProps
  const {
    params: { mediationId, offerId },
  } = match

  return {
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
)(SearchDetails)
