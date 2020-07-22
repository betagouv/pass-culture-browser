import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Draggable from 'react-draggable'

import getIsTransitionDetailsUrl from '../../../../utils/getIsTransitionDetailsUrl'
import getUrlWithoutDetailsPart from '../../../../utils/getUrlWithoutDetailsPart'
import isDetailsView from '../../../../utils/isDetailsView'
import CloseLink from '../../../layout/Header/CloseLink/CloseLink'
import CardContainer from './Card/CardContainer'
import NavigationContainer from './Navigation/NavigationContainer'

class Deck extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      versoPositionBeforeScroll: undefined,
      refreshKey: 0,
    }
  }

  componentDidMount() {
    const { currentRecommendation, recommendations } = this.props
    const isStateWithoutRecommendationsOrCurrentRecommendation =
      !recommendations || recommendations.length === 0 || !currentRecommendation

    if (!isStateWithoutRecommendationsOrCurrentRecommendation) {
      return
    }
    this.handleRefreshedDraggableKey()
  }

  componentDidUpdate() {
    const { history, location, match } = this.props
    const isTransitionDetailsUrl = getIsTransitionDetailsUrl(match)

    if (isTransitionDetailsUrl) {
      const { pathname, search } = location
      const nextUrl = `${pathname.split('/transition')[0]}${search}`
      history.replace(nextUrl)
    }
  }

  componentWillUnmount() {
    const { readTimeout, noDataTimeout } = this.props

    if (readTimeout) clearTimeout(readTimeout)
    if (noDataTimeout) clearTimeout(noDataTimeout)
  }

  handleOnStart = () => {
    const versoPositionBeforeScroll = document
      .getElementsByClassName('verso-header')[0]
      .getBoundingClientRect()
    this.setState({ versoPositionBeforeScroll })
  }

  handleOnStop = (event, data) => {
    const {
      currentRecommendation,
      height,
      horizontalSlideRatio,
      verticalSlideRatio,
      width,
    } = this.props
    const { versoPositionBeforeScroll } = this.state

    const index = (currentRecommendation && currentRecommendation.index) || 0
    const offset = (data.x + width * index) / width

    const isSwipingDownWhileAlreadyOnTop = versoPositionBeforeScroll.top >= -30 && data.y > 0
    if (isSwipingDownWhileAlreadyOnTop) {
      this.onHandleCloseCardDetails()
    } else if (data.y < -height * verticalSlideRatio) {
      this.handleShowCardDetails()
    } else if (offset > horizontalSlideRatio) {
      this.handleGoPrevious()
    } else if (-offset > horizontalSlideRatio) {
      this.handleGoNext()
    }
  }

  handleGoNext = () => {
    const { history, match, nextRecommendation } = this.props
    if (!nextRecommendation || isDetailsView(match)) {
      return
    }

    const { offerId, mediationId } = nextRecommendation
    const nextUrl = `/decouverte/${offerId}/${mediationId}`
    history.push(nextUrl)
    this.handleRefreshNext()
  }

  handleGoPrevious = () => {
    const { history, match, previousRecommendation } = this.props
    if (!previousRecommendation || isDetailsView(match)) {
      return
    }

    const { offerId, mediationId } = previousRecommendation
    const previousUrl = `/decouverte/${offerId}/${mediationId}`
    history.push(previousUrl)
  }

  handleRefreshNext = () => {
    const { currentRecommendation, handleRequestPutRecommendations, nextLimit } = this.props
    const hasReachedLimitBeforeFetchingRecommendations =
      nextLimit && currentRecommendation.index === nextLimit

    if (hasReachedLimitBeforeFetchingRecommendations) {
      handleRequestPutRecommendations()
    }
  }

  handleRefreshedDraggableKey = () => {
    this.setState(previousState => ({
      refreshKey: previousState.refreshKey + 1,
    }))
  }

  handleShowCardDetails = () => {
    const { history, location, match } = this.props
    const { pathname, search } = location
    if (isDetailsView(match)) {
      return
    }
    history.push(`${pathname}/details${search}`)
  }

  onHandleCloseCardDetails = () => {
    const { history, location, match } = this.props
    const removedDetailsUrl = getUrlWithoutDetailsPart(location, match)

    if (removedDetailsUrl) {
      history.push(removedDetailsUrl)
    }
    this.setState({ versoPositionBeforeScroll: undefined })
  }

  buildCloseToUrl = () => {
    const { location, match } = this.props
    return getUrlWithoutDetailsPart(location, match) + '/transition'
  }

  renderDraggableCards() {
    const {
      currentRecommendation,
      match,
      nextRecommendation,
      previousRecommendation,
      width,
    } = this.props
    const { index } = currentRecommendation || {}
    const { refreshKey } = this.state
    const position = {
      x: -1 * width * index,
      y: 0,
    }
    const draggableBounds = (isDetailsView(match) && {}) || {
      bottom: 0,
      left: position.x - width,
      right: position.x + width,
      top: -100,
    }

    return (
      <Draggable
        axis={isDetailsView(match) ? 'none' : 'both'}
        bounds={draggableBounds}
        enableUserSelectHack={false}
        key={refreshKey}
        onStart={this.handleOnStart}
        onStop={this.handleOnStop}
        position={position}
      >
        <div className="is-overlay">
          <div className="inner is-relative">
            {previousRecommendation && <CardContainer position="previous" />}
            <CardContainer position="current" />
            {nextRecommendation && <CardContainer position="next" />}
          </div>
        </div>
      </Draggable>
    )
  }

  scrollToTheTop = () => {
    document.getElementsByClassName('verso-wrapper')[0].scrollTop = 0
  }

  render() {
    const {
      currentRecommendation,
      height,
      match,
      nextRecommendation,
      previousRecommendation,
      recommendations,
    } = this.props
    const detailView = isDetailsView(match)
    const showNavigation = !detailView
    const nbRecommendations = recommendations.length

    return (
      <div
        className="is-clipped is-relative"
        data-nb-recos={nbRecommendations}
        id="deck"
      >
        {detailView && (
          <CloseLink
            actionOnClick={this.scrollToTheTop}
            closeTitle="Fermer"
            closeTo={this.buildCloseToUrl()}
          />
        )}

        {this.renderDraggableCards()}

        {showNavigation && currentRecommendation && (
          <NavigationContainer
            flipHandler={this.handleShowCardDetails || null}
            handleGoNext={(nextRecommendation && this.handleGoNext) || null}
            handleGoPrevious={(previousRecommendation && this.handleGoPrevious) || null}
            height={height}
            offerId={currentRecommendation.offerId}
          />
        )}
      </div>
    )
  }
}

Deck.defaultProps = {
  currentRecommendation: null,
  horizontalSlideRatio: 0.2,
  nextRecommendation: null,
  noDataTimeout: 20000,
  previousRecommendation: null,
  readTimeout: 2000,
  verticalSlideRatio: 0.1,
}

Deck.propTypes = {
  currentRecommendation: PropTypes.shape(),
  handleRequestPutRecommendations: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  horizontalSlideRatio: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      details: PropTypes.string,
    }).isRequired,
  }).isRequired,
  nextLimit: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  nextRecommendation: PropTypes.shape(),
  noDataTimeout: PropTypes.number,
  previousRecommendation: PropTypes.shape(),
  readTimeout: PropTypes.number,
  recommendations: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  verticalSlideRatio: PropTypes.number,
  width: PropTypes.number.isRequired,
}

export default Deck
