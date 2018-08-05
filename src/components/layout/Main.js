import classnames from 'classnames'
import get from 'lodash.get'
import {
  closeNotification,
  Modal,
  requestData,
  resetForm,
  showNotification,
  withLogin,
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import BackButton from './BackButton'
import Footer from './Footer'

class Main extends Component {
  static defaultProps = {
    Tag: 'main',
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  handleDataFail = (state, action) => {
    this.setState({
      loading: false,
    })
    this.props.showNotification({
      type: 'danger',
      text: get(action, 'errors.0.global') || 'Erreur de chargement',
    })
  }

  handleDataRequest = () => {
    if (this.props.handleDataRequest) {
      // possibility of the handleDataRequest to return
      // false in order to not trigger the loading
      this.setState({
        loading: true,
      })
      this.props.handleDataRequest(this.handleDataSuccess, this.handleDataFail)
    }
  }

  handleDataSuccess = (state, action) => {
    this.setState({
      loading: false,
    })
  }

  handleHistoryBlock = () => {
    const { blockers, history } = this.props
    this.unblock && this.unblock()
    this.unblock = history.block(() => {
      if (!blockers) {
        return
      }
      // test all the blockers
      for (const blocker of blockers) {
        const { block } = blocker || {}
        const shouldBlock = block && block(this.props)
        if (shouldBlock) {
          return false
        }
      }
      // return true by default, which means that we don't block
      // the change of pathname
      return true
    })
  }

  componentDidMount() {
    this.handleHistoryBlock()
    this.props.user && this.handleDataRequest()
  }

  componentDidUpdate(prevProps) {
    const blockersChanged = prevProps.blockers !== this.props.blockers
    const userChanged = !prevProps.user && this.props.user // User just loaded
    const searchChanged =
      this.props.location.search !== prevProps.location.search

    if (blockersChanged) {
      this.handleHistoryBlock()
    }
    if (userChanged || searchChanged) {
      this.handleDataRequest()
    }
  }

  componentWillUnmount() {
    this.unblock && this.unblock()
    this.props.resetForm()
  }

  render() {
    const {
      backButton,
      children,
      footer: footerProps,
      name,
      noPadding,
      redBg,
      Tag,
    } = this.props
    const header = [].concat(children).find(e => e.type === 'header')
    const footer = [].concat(children).find(e => e.type === 'footer')
    const content = []
      .concat(children)
      .filter(e => e.type !== 'header' && e.type !== 'footer')

    return [
      <Tag
        className={classnames({
          page: true,
          [`${name}-page`]: true,
          'with-header': Boolean(header),
          'with-footer': Boolean(footer) || Boolean(footerProps),
          'red-bg': redBg,
          'no-padding': noPadding,
        })}
        key="main"
      >
        {header}
        {backButton && <BackButton {...backButton} />}
        <div className="page-content">
          {content}
        </div>
        {footer || (footerProps && <Footer {...footerProps} />)}
      </Tag>,
      <Modal key="modal" />,
    ]
  }
}

Main.defaultProps = {
  Tag: 'main',
}

export default compose(
  withRouter,
  withLogin({
    failRedirect: '/connexion',
  }),
  connect(
    state => ({
      blockers: state.blockers,
      notification: state.notification,
      user: state.user,
    }),
    {
      closeNotification,
      requestData,
      resetForm,
      showNotification,
    }
  )
)(Main)
