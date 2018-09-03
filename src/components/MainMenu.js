import PropTypes from 'prop-types'
import { Icon, requestData } from 'pass-culture-shared'
import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { Transition } from 'react-transition-group'
import { Scrollbars } from 'react-custom-scrollbars'
import { withRouter, NavLink } from 'react-router-dom'

import { ROOT_PATH } from '../utils/config'
import { toggleMainMenu } from '../reducers/menu'

// FIXME -> hardcoded, peut etre defini de routes.js
const navigations = [
  // [route-path, link-label, link-icon, is-disabled]
  ['decouverte', 'Les offres', 'offres'],
  ['reservations', 'Mes réservations', 'calendar'],
  ['favoris', 'Mes préférés', 'like'],
  ['reglages', 'Réglages', 'settings', true],
  ['profil', 'Mon profil', 'user'],
  ['mentions-legales', 'Mentions légales', 'txt'],
]

const delay = 250
const duration = 250

const defaultStyle = {
  opacity: '0',
  top: '100vh',
  transitionDuration: `${duration}ms`,
  transitionProperty: 'opacity, top',
  transitionTimingFunction: 'ease',
}

const transitionStyles = {
  entered: { opacity: 1, top: 0 },
  entering: { opacity: 0, top: '100vh' },
}

const renderContactUsLink = () => (
  <a className="navlink flex-columns" href="mailto:pass@culture.gouv.fr">
    <span className="text-center menu-icon">
      <Icon svg="ico-mail-w" alt="" />
    </span>
    <span>
      {'Nous contacter'}
    </span>
  </a>
)

class MainMenu extends React.PureComponent {
  constructor(props) {
    super(props)
    const { dispatch } = props
    this.actions = bindActionCreators({ requestData }, dispatch)
  }

  onNavLinkClick = () => {
    const { dispatch } = this.props
    dispatch(toggleMainMenu())
  }

  onSignOutClick = () => {
    const { dispatch, history } = this.props
    this.actions.requestData('GET', 'users/signout', {
      handleSuccess: () => {
        history.push('/connexion')
        dispatch(toggleMainMenu())
      },
    })
  }

  renderSignOutLink() {
    return (
      <button
        type="button"
        className="navlink flex-columns"
        onClick={this.onSignOutClick}
      >
        <span className="text-center menu-icon">
          <Icon svg="ico-deconnect-w" alt="" />
        </span>
        <span>
          {'Déconnexion'}
        </span>
      </button>
    )
  }

  renderNavLink(path, title, icon, disabled) {
    const { location } = this.props
    // regle stricte
    // si on est sur la page verso d'une offre
    // aucun menu n'est actif
    // const cssclass = (disabled && 'is-disabled') || ''
    const isverso =
      location.search && location.search.indexOf('?to=verso') !== -1
    const activeClass = isverso ? null : 'active'
    return (
      <NavLink
        key={path}
        to={`/${path}`}
        disabled={disabled}
        onClick={this.onNavLinkClick}
        activeClassName={activeClass}
        className="navlink flex-columns"
      >
        <span className="text-center menu-icon">
          <Icon svg={`ico-${icon}-w`} alt="" />
        </span>
        <span>
          {title}
        </span>
      </NavLink>
    )
  }

  renderMenuHeader() {
    const { user, dispatch } = this.props
    const wallet = user ? user.wallet_balance : '--'
    return (
      <div className="header flex-columns is-relative p16">
        <button
          type="button"
          className="close-button is-overlay"
          onClick={() => dispatch(toggleMainMenu())}
        >
          <Icon svg="ico-close" alt="Fermer" />
        </button>
        <div className="profile text-center">
          <p className="avatar">
            <img alt="" src={`${ROOT_PATH}/icons/avatar-default-w-XL.svg`} />
          </p>
          <p className="username is-clipped">
            <span>
              {user && user.publicName}
            </span>
          </p>
        </div>
        <div className="account items-center flex-center flex-rows">
          <p>
            <span>
              {'Mon Pass'}
            </span>
          </p>
          <p>
            <strong>
              {`${wallet}€`}
            </strong>
          </p>
        </div>
      </div>
    )
  }

  render() {
    const { isVisible } = this.props
    return (
      <Transition in={isVisible} timeout={delay}>
        {state => (
          <div
            id="main-menu"
            className="is-overlay is-clipped flex-columns items-end p12"
            style={{ ...defaultStyle, ...transitionStyles[state] }}
          >
            <div className="inner is-relative is-clipped flex-rows">
              {this.renderMenuHeader()}
              <div className="scroll-container is-clipped">
                <Scrollbars autoHide>
                  <nav className="navigation flex-rows mt16 pb0">
                    {navigations.map(o => this.renderNavLink(...o))}
                    {renderContactUsLink()}
                    {this.renderSignOutLink()}
                  </nav>
                </Scrollbars>
              </div>
            </div>
          </div>
        )}
      </Transition>
    )
  }
}

MainMenu.defaultProps = {
  user: null,
}

MainMenu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isVisible: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
}

const mapStateToProps = state => ({
  isVisible: state.menu,
  user: state.user,
})

export default compose(
  withRouter,
  connect(mapStateToProps)
)(MainMenu)
