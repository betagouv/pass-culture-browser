import classnames from 'classnames'
import get from 'lodash.get'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Fragment, PureComponent } from 'react'
import { Transition } from 'react-transition-group'
import { requestData } from 'redux-saga-data'

import { externalSubmitForm } from '../forms/utils'
import BookingCancel from './sub-items/BookingCancel'
import BookingForm from './sub-items/BookingForm'
import BookingError from './sub-items/BookingError'
import BookingLoader from './sub-items/BookingLoader'
import BookingHeader from './sub-items/BookingHeader'
import BookingSuccess from './sub-items/BookingSuccess'
import { getIsBooking, getIsConfirmingCancelling } from './helpers'
import { priceIsDefined } from '../../helpers/getDisplayPrice'
import { ROOT_PATH } from '../../utils/config'
import { bookingNormalizer } from '../../utils/normalizers'

const BOOKING_FORM_ID = 'form-create-booking'

const duration = 250
const backgroundImage = `url('${ROOT_PATH}/mosaic-k.png')`

const defaultStyle = {
  top: '100%',
  transition: `top ${duration}ms ease-in-out`,
}

const transitionStyles = {
  entered: { top: 0 },
  entering: { top: '100%' },
  exited: { display: 'none', visibility: 'none' },
}

class Booking extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      bookedPayload: false,
      canSubmitForm: false,
      errors: null,
      isErrored: false,
      isSubmitting: false,
      mounted: false,
    }
  }

  componentDidMount() {
    this.handleSetMounted(true)
  }

  componentWillUnmount() {
    this.handleSetMounted(false)
  }

  handleSetMounted = mounted => {
    this.setState({ mounted })
  }

  handleOnFormMutation = ({ invalid, values }) => {
    const nextCanSubmitForm = Boolean(!invalid && values.stockId && values.price >= 0)
    this.setState({ canSubmitForm: nextCanSubmitForm })
  }

  handleOnFormSubmit = formValues => {
    const { dispatch } = this.props
    const onSubmittingStateChanged = () => {
      dispatch(
        requestData({
          apiPath: '/bookings',
          // NOTE -> pas de gestion de stock
          // valeur des quantites a 1 par defaut pour les besoins API
          body: { ...formValues, quantity: 1 },
          handleFail: this.handleRequestFail,
          handleSuccess: this.handleRequestSuccess,
          method: 'POST',
          name: 'booking',
          normalizer: bookingNormalizer,
        })
      )
    }
    // appel au service apres le changement du state
    this.setState({ isSubmitting: true }, onSubmittingStateChanged)
  }

  handleRequestSuccess = (state, action) => {
    const { payload } = action
    const { datum } = payload
    const nextState = {
      bookedPayload: datum,
      isErrored: false,
      isSubmitting: false,
    }
    this.setState(nextState)
  }

  handleRequestFail = (state, action) => {
    const {
      payload: { errors },
    } = action
    const isErrored = errors && Object.keys(errors).length > 0
    const nextState = {
      bookedPayload: false,
      errors,
      isErrored,
      isSubmitting: false,
    }
    this.setState(nextState)
  }

  handleReturnToDetails = () => {
    const { match, history } = this.props
    const { url } = match
    const detailsUrl = url.split('/reservations')[0]
    history.replace(detailsUrl)
  }

  renderFormControls = () => {
    const { match } = this.props
    const { bookedPayload, canSubmitForm, isSubmitting } = this.state
    const isConfirmingCancelling = getIsConfirmingCancelling(match)
    const showCancelButton = !isSubmitting && !bookedPayload && !isConfirmingCancelling
    const showSubmitButton = showCancelButton && canSubmitForm
    return (
      <Fragment>
        {showCancelButton && (
          <button
            className="text-center my5"
            id="booking-close-button"
            onClick={this.handleReturnToDetails}
            type="reset"
          >
            <span>{'Annuler'}</span>
          </button>
        )}

        {showSubmitButton && (
          <button
            className="has-text-centered my5"
            id="booking-validation-button"
            onClick={externalSubmitForm(BOOKING_FORM_ID)}
            type="submit"
          >
            <b>{'Valider'}</b>
          </button>
        )}

        {bookedPayload && (
          <button
            className="text-center my5"
            id="booking-success-ok-button"
            onClick={this.handleReturnToDetails}
            type="button"
          >
            <b>{'OK'}</b>
          </button>
        )}

        {isConfirmingCancelling && (
          <button
            className="text-center my5"
            id="booking-cancellation-confirmation-button"
            onClick={this.handleReturnToDetails}
            type="button"
          >
            <b>{'OK'}</b>
          </button>
        )}
      </Fragment>
    )
  }

  render() {
    const userConnected = false
    const { bookables, booking, extraClassName, match, recommendation } = this.props
    const { bookedPayload, errors, isErrored, isSubmitting, mounted } = this.state
    const { id: recommendationId, offer } = recommendation || {}
    const { isEvent } = offer || {}
    const isConfirmingCancelling = getIsConfirmingCancelling(match)
    const isBooking = getIsBooking(match)
    const showForm = !isSubmitting && !bookedPayload && !isErrored && !isConfirmingCancelling
    const defaultBookable = !isEvent && get(bookables, '[0]')
    const isReadOnly = isEvent && bookables.length === 1
    let initialDate = null
    if (isReadOnly) {
      initialDate = get(bookables, '0.beginningDatetime')
      initialDate = moment(initialDate)
    }

    if (!isBooking) {
      return null
    }

    const formInitialValues = {
      bookables,
      date: (initialDate && { date: initialDate }) || null,
      price:
        defaultBookable && priceIsDefined(defaultBookable.price) ? defaultBookable.price : null,
      recommendationId,
      stockId: (defaultBookable && defaultBookable.id) || null,
    }

    return (
      <Transition
        in={mounted}
        timeout={0}
      >
        {state => (
          <div
            className={classnames('is-overlay is-clipped flex-rows', extraClassName)}
            id="booking-card"
            style={{ ...defaultStyle, ...transitionStyles[state] }}
          >
            <div className="main flex-rows flex-1 scroll-y">
              <BookingHeader recommendation={recommendation} />
              <div
                className={`content flex-1 flex-center ${
                  isConfirmingCancelling ? '' : 'items-center'
                }`}
                style={{ backgroundImage }}
              >
                <div className={`${isConfirmingCancelling ? '' : 'py36 px12'} flex-rows`}>
                  {isSubmitting && <BookingLoader />}

                  {bookedPayload && <BookingSuccess
                    data={bookedPayload}
                    isEvent={isEvent}
                                    />}

                  {isConfirmingCancelling && <BookingCancel
                    data={booking}
                    isEvent={isEvent}
                                             />}

                  {isErrored && <BookingError errors={errors} />}

                  {showForm && (
                    <BookingForm
                      className="flex-1 flex-rows flex-center items-center"
                      disabled={userConnected}
                      formId={BOOKING_FORM_ID}
                      initialValues={formInitialValues}
                      isEvent={isEvent}
                      isReadOnly={isReadOnly}
                      onMutation={this.handleOnFormMutation}
                      onSubmit={this.handleOnFormSubmit}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="form-footer flex-columns flex-0 flex-center">
              {this.renderFormControls()}
            </div>
          </div>
        )}
      </Transition>
    )
  }
}

Booking.defaultProps = {
  bookables: null,
  booking: null,
  extraClassName: null,
  recommendation: null,
}

Booking.propTypes = {
  bookables: PropTypes.arrayOf(PropTypes.shape()),
  booking: PropTypes.shape(),
  dispatch: PropTypes.func.isRequired,
  extraClassName: PropTypes.string,
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      bookings: PropTypes.string,
      cancellation: PropTypes.string,
      confirmation: PropTypes.string,
    }),
    url: PropTypes.string.isRequired,
  }).isRequired,
  recommendation: PropTypes.shape(),
}

export default Booking
