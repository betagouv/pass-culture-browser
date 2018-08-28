import PropTypes from 'prop-types'
import { Icon, requestData } from 'pass-culture-shared'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { compose, bindActionCreators } from 'redux'
import { Transition } from 'react-transition-group'
import { Scrollbars } from 'react-custom-scrollbars'

import { ROOT_PATH } from '../utils/config'
import { toggleMainMenu } from '../reducers/menu'

const delay = 250
const duration = 250

const defaultStyle = {
  top: '100vh',
  transition: `top ${duration}ms ease`,
}

const transitionStyles = {
  entered: { top: 0 },
  entering: { top: '100vh' },
}

const renderDisabledLink = (path, title, icon) => (
  <span className="navlink flex-columns is-disabled">
    <span className="has-text-centered menu-icon">
      <Icon svg={`ico-${icon}-w`} alt={title} />
    </span>
    <span>
      {title}
    </span>
  </span>
)

const renderContactUsLink = () => (
  <a className="navlink flex-columns" href="mailto:pass@culture.gouv.fr">
    <span className="has-text-centered menu-icon">
      <Icon svg="ico-mail-w" alt="Nous contacter" />
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
        <span className="has-text-centered menu-icon">
          <Icon svg="ico-deconnect-w" alt="Déconnexion" />
        </span>
        <span>
          {'Déconnexion'}
        </span>
      </button>
    )
  }

  renderNavLink(path, title, icon) {
    return (
      <NavLink
        to={`/${path}`}
        onClick={this.onNavLinkClick}
        className="navlink flex-columns"
      >
        <span className="has-text-centered menu-icon">
          <Icon svg={`ico-${icon}-w`} alt={title} />
        </span>
        <span>
          {title}
        </span>
      </NavLink>
    )
  }

  renderMenuHeader() {
    const { user, dispatch } = this.props
    return (
      <div className="header flex-columns is-relative p16">
        <button
          type="button"
          className="close-button is-overlay"
          onClick={() => dispatch(toggleMainMenu())}
        >
          <Icon svg="ico-close" alt="Fermer" />
        </button>
        <div className="profile has-text-centered">
          <p className="avatar">
            <img
              alt="Avatar"
              src={`${ROOT_PATH}/icons/avatar-default-w-XL.svg`}
            />
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
              {'—— €'}
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
                <Scrollbars>
                  <nav className="navigation flex-rows mt16 pb0">
                    {this.renderNavLink('decouverte', 'Les offres', 'offres')}
                    {this.renderNavLink(
                      'reservations',
                      'Mes réservations',
                      'calendar'
                    )}
                    {this.renderNavLink('favoris', 'Mes préférés', 'like')}
                    {renderDisabledLink('reglages', 'Réglages', 'settings')}
                    {renderDisabledLink('profil', 'Mon profil', 'user')}
                    {this.renderNavLink(
                      'mentions-legales',
                      'Mentions légales',
                      'txt'
                    )}
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
