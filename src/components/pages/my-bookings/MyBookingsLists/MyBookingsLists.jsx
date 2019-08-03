import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

import BookingsList from './BookingsList/BookingsList'
import NoItems from '../../../layout/NoItems/NoItems'
import RelativeFooterContainer from '../../../layout/RelativeFooter/RelativeFooterContainer'

const MyBookingsLists = ({ isEmpty, myBookings, soonBookings }) => (
  <Fragment>
    <div className={classnames("teaser-main page-content", { "teaser-no-teasers": isEmpty })}>
      {isEmpty && <NoItems sentence="Dès que vous aurez réservé une offre," />}

      {!isEmpty && soonBookings.length > 0 && (
        <section className="my-bookings-section">
          <header className="my-bookings-header">{'C’est bientôt !'}</header>
          <BookingsList bookings={soonBookings} />
        </section>
      )}

      {!isEmpty && myBookings.length > 0 && (
        <section className="my-bookings-section">
          <header className="my-bookings-header">{'Réservations'}</header>
          <BookingsList bookings={myBookings} />
        </section>
      )}
    </div>
    <RelativeFooterContainer
      className="dotted-top-white"
      theme="purple"
    />
  </Fragment>
)

MyBookingsLists.propTypes = {
  isEmpty: PropTypes.bool.isRequired,
  myBookings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  soonBookings: PropTypes.arrayOf(PropTypes.shape()).isRequired
}

export default MyBookingsLists
