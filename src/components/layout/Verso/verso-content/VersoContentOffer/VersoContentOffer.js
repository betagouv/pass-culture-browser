import get from 'lodash.get'
import PropTypes from 'prop-types'
import React, { Fragment, PureComponent } from 'react'
import { capitalize } from 'react-final-form-utils'

import getDurationFromMinutes from './getDurationFromMinutes'
import VersoActionsBar from './VersoActionsBar'
import Icon from '../../../Icon'
import { navigationLink } from '../../../../../utils/geolocation'

class VersoContentOffer extends PureComponent {
  componentDidMount() {
    const { handleRequestMusicAndShowTypes } = this.props
    handleRequestMusicAndShowTypes()
  }

  renderOfferDetails() {
    const { offer } = this.props
    const { description } = offer || {}

    if (!description) return null

    return (
      <div>
        <h3>{'Et en détails ?'}</h3>
        <pre
          className="is-raw-description"
          id="verso-offer-description"
        >
          {description}
        </pre>
      </div>
    )
  }

  renderOfferWhat() {
    const { musicSubType, musicType, offer, showSubType, showType } = this.props
    const { durationMinutes, extraData, offerType } = offer || {}
    const { author, performer, speaker, stageDirector } = extraData || {}
    const { appLabel } = offerType || {}

    const duration = getDurationFromMinutes(durationMinutes)
    const type = get(musicType, 'label') || get(showType, 'label')
    const subType = get(musicSubType, 'label') || get(showSubType, 'label')

    return (
      <div>
        <h3>{'Quoi ?'}</h3>
        <div>
          <span
            className="is-bold"
            id="verso-offer-label"
          >
            {appLabel}
          </span>
          {durationMinutes && (
            <span>
              {' - Durée'} {duration}
            </span>
          )}
        </div>
        {type && (
          <div>
            {'Genre : '}
            {type}
            {subType && `/ ${subType}`}
          </div>
        )}
        {author && (
          <div>
            {'Auteur : '}
            {author}
          </div>
        )}
        {performer && (
          <div>
            {'Interprète : '}
            {performer}
          </div>
        )}
        {speaker && (
          <div>
            {'Intervenant : '}
            {speaker}
          </div>
        )}
        {stageDirector && (
          <div>
            {'Metteur en scène : '}
            {stageDirector}
          </div>
        )}
      </div>
    )
  }

  renderEventOfferDateInfos() {
    const { bookables, maxShownDates } = this.props
    const sliced = bookables.slice(0, maxShownDates)
    const hasMoreBookables = bookables.length > maxShownDates

    return (
      <Fragment>
        {sliced.map(obj => (
          <li key={obj.id}>
            {capitalize(obj.humanBeginningDate)}
            {!obj.userHasCancelledThisDate && obj.userHasAlreadyBookedThisDate && ' (réservé)'}
          </li>
        ))}
        {hasMoreBookables && <li>{'Cliquez sur "j’y vais" pour voir plus de dates.'}</li>}
      </Fragment>
    )
  }

  renderThingOfferDateInfos() {
    const { bookables } = this.props
    const limitDatetime = get(bookables, '[0].bookinglimitDatetime')

    return (
      <Fragment>
        <li>
          {'Dès maintenant'}
          {limitDatetime && ` et jusqu’au ${limitDatetime}`}
        </li>
      </Fragment>
    )
  }

  renderOfferWhen() {
    const { isFinished, offer } = this.props
    const { isThing } = offer || {}

    const offerDateInfos = isThing
      ? this.renderThingOfferDateInfos()
      : this.renderEventOfferDateInfos()

    return (
      <div>
        <h3>{'Quand ?'}</h3>
        <ul className="dates-info">
          {isFinished ? <li>{'L’offre n’est plus disponible.'}</li> : offerDateInfos}
        </ul>
      </div>
    )
  }

  renderOfferWhere() {
    const { distance, offer } = this.props
    const { venue } = offer || {}
    const { address, city, latitude, longitude, name, postalCode, publicName } = venue || {}

    return (
      <div>
        <h3>{'Où ?'}</h3>
        <div className="flex-columns flex-between">
          <p className="address-info">
            <span className="is-block">{publicName || name}</span>
            {address && <span className="is-block">{address}</span>}
            {postalCode && <span className="is-block">{postalCode}</span>}
            {city && <span className="is-block">{city}</span>}
          </p>
          {latitude && longitude && (
            <a
              className="distance"
              href={navigationLink(latitude, longitude)}
            >
              <span>{distance}&nbsp;</span>
              <Icon
                alt="Géolocalisation dans Open Street Map"
                svg="ico-geoloc-solid2"
              />
            </a>
          )}
        </div>
      </div>
    )
  }

  render() {
    const { booking } = this.props
    const { completedUrl } = booking || {}
    return (
      <div className="verso-info">
        {completedUrl && <VersoActionsBar url={completedUrl} />}
        {this.renderOfferWhat()}
        {this.renderOfferDetails()}
        {this.renderOfferWhen()}
        {this.renderOfferWhere()}
      </div>
    )
  }
}

VersoContentOffer.defaultProps = {
  bookables: null,
  booking: null,
  isFinished: false,
  maxShownDates: 7,
  musicSubType: null,
  musicType: null,
  offer: null,
  showSubType: null,
  showType: null,
}

VersoContentOffer.propTypes = {
  bookables: PropTypes.arrayOf(PropTypes.shape()),
  booking: PropTypes.shape(),
  distance: PropTypes.string.isRequired,
  handleRequestMusicAndShowTypes: PropTypes.func.isRequired,
  isFinished: PropTypes.bool,
  maxShownDates: PropTypes.number,
  musicSubType: PropTypes.shape(),
  musicType: PropTypes.shape(),
  offer: PropTypes.shape({
    product: PropTypes.shape(),
  }),
  showSubType: PropTypes.shape(),
  showType: PropTypes.shape(),
}

export default VersoContentOffer
