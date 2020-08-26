import PropTypes from 'prop-types'
import React, { Fragment, PureComponent } from 'react'
import { Route } from 'react-router-dom'

import BookingContainer from '../../layout/Booking/BookingContainer'
import BookingCancellationContainer from '../../layout/BookingCancellation/BookingCancellationContainer'
import isDetailsView from '../../../utils/isDetailsView'

import RectoContainer from '../Recto/RectoContainer'
import VersoContainer from '../Verso/VersoContainer'

class Details extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      isDetailsView: false,
    }
  }

  componentDidMount() {
    this.handleSetIsDetailsView()
    const { getOfferById, match } = this.props
    const { params } = match
    const { offerId } = params
    if (offerId) getOfferById(offerId)
  }

  componentDidUpdate() {
    this.handleSetIsDetailsView()
  }

  handleSetIsDetailsView = () => {
    const { match } = this.props
    this.setState({
      isDetailsView: isDetailsView(match),
    })
  }

  renderBookingOrCancellation = route => {
    const { cancelView } = this.props

    return cancelView ? this.renderBookingCancellation(route) : this.renderBooking(route)
  }

  renderBookingCancellation = route => {
    return (<BookingCancellationContainer
      extraClassName="with-header"
      {...route}
            />)
  }

  renderBooking = route => (<BookingContainer
    extraClassName="with-header"
    {...route}
                            />)

  render() {
    const { bookingPath } = this.props
    const { isDetailsView } = this.state

    return (
      <Fragment>
        <Route
          path={bookingPath}
          render={this.renderBookingOrCancellation}
          sensitive
        />
        <VersoContainer
          areDetailsVisible={isDetailsView}
          extraClassName="with-header"
        />
        {isDetailsView && <RectoContainer areDetailsVisible />}
      </Fragment>
    )
  }
}

Details.defaultProps = {
  bookingPath: '',
  cancelView: false,
}

Details.propTypes = {
  bookingPath: PropTypes.string,
  cancelView: PropTypes.bool,
  getOfferById: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      details: PropTypes.string,
      offerId: PropTypes.string,
    }),
  }).isRequired,
}

export default Details
