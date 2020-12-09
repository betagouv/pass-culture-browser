import PropTypes from 'prop-types'
import { parse } from 'query-string'
import React, { Component, createRef, Fragment, useEffect } from 'react'
import { Link, Route } from 'react-router-dom'

import { formatToFrenchDecimal } from '../../../../utils/getDisplayPrice'
import { fetchHomepage } from '../../../../vendor/contentful/contentful'
import AnyError from '../../../layout/ErrorBoundaries/ErrorsPage/AnyError/AnyError'
import CloseLink from '../../../layout/Header/CloseLink/CloseLink'
import BusinessModule from './BusinessModule/BusinessModule'
import { formatPublicName } from './domain/formatPublicName'
import ExclusivityPane from './domain/ValueObjects/ExclusivityPane'
import Offers from './domain/ValueObjects/Offers'
import OffersWithCover from './domain/ValueObjects/OffersWithCover'
import ExclusivityModule from './ExclusivityModule/ExclusivityModule'
import Module from './Module/Module'
import OfferDetailsContainer from './OfferDetails/OfferDetailsContainer'
import Icon from '../../../layout/Icon/Icon'
import Profile from '../Profile/Profile'
import User from '../Profile/ValueObjects/User'
import { setCustomUserId } from '../../../../notifications/setUpBatchSDK'
import BusinessPane from './domain/ValueObjects/BusinessPane'

export default class MainView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modules: [],
      fetchingError: false,
      areAllModulesRendered: false,
      haveSeenAllModules: false,
    }
    this.modulesListRef = createRef()
    this.onModulesRender = this.onModulesRender.bind(this)
  }

  componentDidMount() {
    const { history, updateCurrentUser, user } = this.props
    const queryParams = parse(history.location.search)

    setCustomUserId(user.id)

    updateCurrentUser({
      lastConnectionDate: new Date(),
    })
    fetchHomepage({ entryId: queryParams['entryId'] })
      .then(modules => {
        this.setState({
          modules: modules,
        })
      })
      .catch(() => {
        this.setState({
          fetchingError: true,
        })
      })
  }

  componentDidUpdate(prevProps, prevState) {
    const { trackAllModulesSeen } = this.props
    const { haveSeenAllModules, modules } = this.state
    if (prevState.modules.length !== modules.length) {
      this.checkIfAllModulesHaveBeenSeen()
    }
    if (prevState.haveSeenAllModules !== haveSeenAllModules) {
      trackAllModulesSeen(modules.length)
    }
  }

  checkIfAllModulesHaveBeenSeen = () => {
    if (!this.state.areAllModulesRendered) {
      return
    }
    const navbarHeight = 60
    const modulePaddingBottom = 24
    const hasReachedEndOfPage =
      this.modulesListRef.current.getBoundingClientRect().bottom +
        navbarHeight -
        modulePaddingBottom -
        document.documentElement.clientHeight <=
      0
    if (hasReachedEndOfPage) {
      this.setState({ haveSeenAllModules: true })
    }
  }

  onModulesRender() {
    this.setState({ areAllModulesRendered: true })
  }

  render() {
    const { fetchingError } = this.state
    const { history, match, user } = this.props
    const { publicName, wallet_balance } = user
    const formattedPublicName = formatPublicName(publicName)
    const formattedWalletBalance = formatToFrenchDecimal(wallet_balance)

    return fetchingError ? (
      <AnyError />
    ) : (
      <Fragment>
        <Route path={`${match.path}/profil`}>
          <Profile
            history={history}
            match={match}
            user={user}
          />
        </Route>
        <div
          className="home-wrapper"
          onScroll={this.checkIfAllModulesHaveBeenSeen}
        >
          <section className="hw-header">
            <div className="hw-account">
              <Link to="/accueil/profil">
                <Icon
                  className="hw-account-image"
                  svg="ico-informations-white"
                />
              </Link>
            </div>
            <div className="hw-pseudo">
              {`Bonjour ${formattedPublicName}`}
            </div>
            <div className="hw-wallet">
              {`Tu as ${formattedWalletBalance} € sur ton pass`}
            </div>
          </section>
          <div
            className="hw-modules"
            ref={this.modulesListRef}
          >
            {this.state.modules && this.state.modules.length > 0 && (
              <Modules
                geolocation={this.props.geolocation}
                history={this.props.history}
                modules={this.state.modules}
                onRender={this.onModulesRender}
                trackAllTilesSeen={this.props.trackAllTilesSeen}
              />
            )}
          </div>
        </div>
        <Route
          exact
          path={`${match.path}/:details(details|transition)/:offerId([A-Z0-9]+)/:booking(reservation)?/:bookingId([A-Z0-9]+)?/:cancellation(annulation)?/:confirmation(confirmation)?`}
          sensitive
        >
          <div className="home-details-wrapper">
            <CloseLink closeTo="/accueil" />
            <OfferDetailsContainer
              match={match}
              withHeader={false}
            />
          </div>
        </Route>
      </Fragment>
    )
  }
}

MainView.propTypes = {
  geolocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  trackAllModulesSeen: PropTypes.func.isRequired,
  trackAllTilesSeen: PropTypes.func.isRequired,
  updateCurrentUser: PropTypes.func.isRequired,
  user: PropTypes.shape(User).isRequired,
}

const Modules = props => {
  const { onRender } = props
  useEffect(() => {
    onRender()
  }, [onRender])

  return props.modules.map((module, row) => {
    if (module instanceof Offers || module instanceof OffersWithCover) {
      return (
        <Module
          geolocation={props.geolocation}
          historyPush={props.history.push}
          key={`${row}-module`} // eslint-disable-line react/no-array-index-key
          module={module}
          row={row}
          trackAllTilesSeen={props.trackAllTilesSeen}
        />
      )
    } else {
      if (module instanceof ExclusivityPane) {
        return (
          <ExclusivityModule
            key={`${row}-exclusivity-module`} // eslint-disable-line react/no-array-index-key
            module={module}
          />
        )
      }
      return (
        <BusinessModule
          key={`${row}-business-module`} // eslint-disable-line react/no-array-index-key
          module={module}
        />
      )
    }
  })
}

Modules.propTypes = {
  geolocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  history: PropTypes.shape().isRequired,
  modules: PropTypes.arrayOf(Offers | OffersWithCover | ExclusivityPane | BusinessPane),
  onRender: PropTypes.func.isRequired,
  trackAllTilesSeen: PropTypes.func.isRequired,
}
