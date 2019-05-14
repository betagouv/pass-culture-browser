import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Component } from 'react'

export class Matomo extends Component {
  render() {
    const { children, location } = this.props

    // eslint-disable-next-line
    const matomoTracker = window._paq || []

    matomoTracker.push(['setCustomUrl', location.pathname])
    matomoTracker.push(['setDocumentTitle', document.title])
    matomoTracker.push(['trackPageView'])

    return children
  }
}

Matomo.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.shape().isRequired,
}

export default withRouter(Matomo)
