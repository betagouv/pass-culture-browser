/* eslint
  react/jsx-one-expression-per-line: 0 */
import React from 'react'
import get from 'lodash.get'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { requestData } from 'pass-culture-shared'
import { Transition } from 'react-transition-group'

import { ROOT_PATH } from '../../utils/config'
import { externalSubmitForm } from '../forms/utils'
import BookingForm from './BookingForm'
import BookingError from './BookingError'
import BookingLoader from './BookingLoader'
import BookingSuccess from './BookingSuccess'
import { selectBookables } from '../../selectors/selectBookables'
import currentRecommendationSelector from '../../selectors/currentRecommendation'

const duration = 250

const defaultStyle = {
  top: '100%',
  transition: `top ${duration}ms ease-in-out`,
}

const transitionStyles = {
  entered: { top: 0 },
  entering: { top: '100%' },
  exited: { display: 'none', visibility: 'none' },
}

class Booking extends React.PureComponent {
  constructor(props) {
    super(props)
    this.formId = 'form-create-booking'
    const actions = { requestData }
    this.actions = bindActionCreators(actions, props.dispatch)
    this.state = {
      bookedPayload: false,
      canSubmitForm: false,
      isErrored: false,
      isSubmitting: false,
      mounted: false,
    }
  }

  componentDidMount() {
    this.setState({ mounted: true })
  }

  componentWillUnmount() {
    this.setState({ mounted: false })
  }

  onFormMutation = ({ invalid, values }) => {
    // intervient aux changement sur le form
    // pour les changements sur 'invalid | values'
    const nextCanSubmitForm = !invalid && values.stockId && values.price >= 0
    const { canSubmitForm } = this.state
    const hasFormValid = canSubmitForm !== nextCanSubmitForm
    if (!hasFormValid) return
    this.setState({ canSubmitForm: nextCanSubmitForm })
  }

  onFormSubmit = formValues => {
    const onSubmittingStateChanged = () => {
      this.actions.requestData('POST', 'bookings', {
        body: { ...formValues },
        handleFail: this.handleRequestFail,
        // après la mise à jour du booking pour un user
        // on cherche à recupérer la nouvelle valeur du wallet
        // il faut alors une nouvelle requête pour l'update du store redux
        handleSuccess: this.updateUserFromStore,
        name: 'booking',
      })
    }
    // appel au service apres le changement du state
    this.setState({ isSubmitting: true }, onSubmittingStateChanged)
  }

  updateUserFromStore = (state, action) => {
    const bookedPayload = action.data
    this.actions.requestData('PATCH', 'users/current', {
      body: {},
      handleFail: this.handleRequestFail,
      handleSuccess: this.handleRequestSuccess(bookedPayload),
      key: 'user',
    })
  }

  handleRequestSuccess = bookedPayload => () => {
    const nextState = {
      bookedPayload,
      isErrored: false,
      isSubmitting: false,
    }
    this.setState(nextState)
  }

  handleRequestFail = (state, action) => {
    const nextState = {
      bookedPayload: false,
      isErrored: action,
      isSubmitting: false,
    }
    this.setState(nextState)
  }

  cancelBookingHandler = () => {
    const { match, history } = this.props
    const baseurl = match.url.replace('/booking', '')
    history.replace(baseurl)
  }

  renderFormControls = () => {
    const { bookedPayload, isSubmitting, canSubmitForm } = this.state
    const showCancelButton = !isSubmitting && !bookedPayload
    const showSubmitButton = showCancelButton && canSubmitForm
    return (
      <React.Fragment>
        {showCancelButton && (
          <button
            type="reset"
            className="text-center my5"
            onClick={this.cancelBookingHandler}
          >
            <span>Annuler</span>
          </button>
        )}
        {showSubmitButton && (
          <button
            type="submit"
            className="has-text-centered my5"
            onClick={() => externalSubmitForm(this.formId)}
          >
            <b>Valider</b>
          </button>
        )}
        {bookedPayload && (
          <button
            type="button"
            className="text-center my5"
            onClick={this.cancelBookingHandler}
          >
            <b>OK</b>
          </button>
        )}
      </React.Fragment>
    )
  }

  render() {
    const userConnected = false
    const { recommendation, bookables, isEvent } = this.props
    const { bookedPayload, isErrored, isSubmitting, mounted } = this.state
    const showForm = !isSubmitting && !bookedPayload && !isErrored
    const defaultBookable = !isEvent && get(bookables, '[0]')
    const formInitialValues = {
      bookables,
      date: null,
      price: get(defaultBookable, 'price'),
      quantity: 1,
      recommendationId: recommendation.id,
      stockId: get(defaultBookable, 'id'),
    }
    const backgroundImage = `url('${ROOT_PATH}/mosaic-k.png')`
    return (
      <Transition in={mounted} timeout={0}>
        {state => (
          <div
            id="booking-card"
            className="is-overlay is-clipped flex-rows"
            style={{ ...defaultStyle, ...transitionStyles[state] }}
          >
            <header className="flex-0">
              <h1 className="title">
                <span>{get(recommendation, 'offer.eventOrThing.name')}</span>
              </h1>
              <h2 className="subtitle">
                <span>{get(recommendation, 'offer.venue.name')}</span>
              </h2>
            </header>
            <div
              className="main flex-1 items-center is-clipped is-relative"
              style={{ backgroundImage }}
            >
              <div className="views-container is-overlay">
                {isSubmitting && <BookingLoader />}
                {bookedPayload && (
                  <BookingSuccess isEvent={isEvent} data={bookedPayload} />
                )}
                {isErrored && <BookingError {...isErrored} />}
                {showForm && (
                  <React.Fragment>
                    <BookingForm
                      formId={this.formId}
                      disabled={userConnected}
                      isEvent={isEvent}
                      onSubmit={this.onFormSubmit}
                      recommendation={recommendation}
                      onMutation={this.onFormMutation}
                      initialValues={formInitialValues}
                      onValidation={this.onFormValidation}
                      className="flex-rows items-center"
                    />
                  </React.Fragment>
                )}
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
  isEvent: false,
  recommendation: null,
}

Booking.propTypes = {
  bookables: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isEvent: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  match: PropTypes.object.isRequired,
  recommendation: PropTypes.object,
}

const mapStateToProps = (state, { match }) => {
  const { offerId, mediationId } = match.params
  const recommendation = currentRecommendationSelector(
    state,
    offerId,
    mediationId
  )
  const isEvent = (get(recommendation, 'offer.eventId') && true) || false
  // pas sur qu'un selecteur soit pertinent:
  // perfs -> l'user ne reviendra pas sur la page puisqu'il est déjà venu
  // opaque -> oblige a regarder dans un fichier ce qui se passe
  const bookables = selectBookables(state, recommendation, match)
  return {
    bookables,
    isEvent,
    recommendation,
  }
}

export default connect(mapStateToProps)(Booking)
