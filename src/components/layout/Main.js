import PropTypes from 'prop-types'
import classnames from 'classnames'
import get from 'lodash.get'
import { Modal, resetForm, showNotification } from 'pass-culture-shared'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose, bindActionCreators } from 'redux'

import BackButton from './BackButton'

class Main extends React.PureComponent {
  constructor(props) {
    super(props)
    const { dispatch } = props
    const actions = { resetForm, showNotification }
    this.actions = bindActionCreators(actions, dispatch)
  }

  componentDidMount() {
    const { user } = this.props
    // si un utilisateur est connecte ?
    // FIXME -> cela doit etre gere par un composant private
    // heritage de ReactRouter
    // NOTE -> https://reacttraining.com/react-router/web/example/auth-workflow
    if (!user) return
    this.dataRequestHandler()
  }

  componentDidUpdate(prevProps) {
    const { user, location } = this.props
    const userChanged = !prevProps.user && user // User just loaded
    const searchChanged = location.search !== prevProps.location.search

    if (userChanged || searchChanged) {
      this.dataRequestHandler()
    }
  }

  componentWillUnmount() {
    this.actions.resetForm()
  }

  handleDataFail = (state, action) => {
    const error = get(action, 'errors.global', []).join('\n')
    this.actions.showNotification({
      text: error || 'Erreur de chargement',
      type: 'danger',
    })
  }

  dataRequestHandler = () => {
    const { handleDataRequest } = this.props
    // la definition d'une propriete `handleDataRequest`
    // dans un composant lance une requete
    if (!handleDataRequest) return
    // possibility of the handleDataRequest to return
    // false in order to not trigger the loading
    handleDataRequest(this.handleDataSuccess, this.handleDataFail)
  }

  render() {
    const {
      backButton,
      children,
      name,
      noPadding,
      redBg,
      footer,
      header,
    } = this.props
    // FIXME [PERFS] -> ne pas faire une itération
    // utiliser plutot une propriete avec un composant
    // const footer = [].concat(children).find(e => e.type === 'footer')
    // const content = [].concat(children).filter(e => e.type !== 'footer')

    return (
      <React.Fragment>
        <main
          role="main"
          className={classnames({
            [`${name}-page`]: true,
            'no-padding': noPadding,
            page: true,
            'red-bg': redBg,
            'with-footer': footer !== null,
            // Boolean(footer) || Boolean(footerProps),
            'with-header': header !== null,
          })}
        >
          {header && header()}
          {backButton && <BackButton {...backButton} />}
          <div className="page-content is-relative">
            {children}
          </div>
          {footer && footer()}
          {/* || (footerProps && <Footer {...footerProps} />)} */}
        </main>
        <Modal />
      </React.Fragment>
    )
  }
}

Main.defaultProps = {
  backButton: false,
  footer: null,
  handleDataRequest: null,
  header: null,
  noPadding: false,
  redBg: false,
  user: null,
}

Main.propTypes = {
  backButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
  footer: PropTypes.func,
  handleDataRequest: PropTypes.func,
  header: PropTypes.func,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  noPadding: PropTypes.bool,
  redBg: PropTypes.bool,
  user: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
}

const mapStateToProps = state => ({
  notification: state.notification,
  user: state.user,
})

export default compose(
  withRouter,
  connect(mapStateToProps)
)(Main)
