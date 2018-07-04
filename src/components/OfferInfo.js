import get from 'lodash.get'
import moment from 'moment'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import Icon from './layout/Icon'
import Capitalize from './utils/Capitalize'
import selectDistance from '../selectors/distance'
import selectCurrentOffer from '../selectors/currentOffer'
import selectCurrentOfferer from '../selectors/currentOfferer'
import selectCurrentRecommendation from '../selectors/currentRecommendation'
import selectCurrentSource from '../selectors/currentSource'
import selectCurrentThumbUrl from '../selectors/currentThumbUrl'
import selectTimezone from '../selectors/currentTimezone'
import selectVenue from '../selectors/currentVenue'
import { navigationLink } from '../utils/geolocation'

class OfferInfo extends Component {
  render() {
    const {
      distance,
      offer,
      offerer,
      recommendation,
      source,
      thumbUrl,
      tz,
      venue,
    } = this.props

    const infos = {
      image: thumbUrl,
      description: get(source, 'description'),
      what: get(source, 'description')
        ? ''
        : get(offer, 'eventOccurence.event.description'), // TODO: add what when set in API
      when: get(recommendation, 'mediatedOccurences', []).map(
        o => o.beginningDatetime
      ),
      where: {
        name: get(venue, 'name'),
        address: get(venue, 'address') + ',' + (get(venue, 'postalCode') || '')
                                       + ',' + (get(venue, 'city') || ''),
      },
    }

    return (
      <div className="offer-info">
        {offerer && (
          <div className="offerer">Ce livre vous est offert par {offerer}.</div>
        )}
        {false && <img alt="" className="offerPicture" src={infos.image} />}
        {infos.description && (
          <div className="description">
            {infos.description
              .split('\n')
              .map((p, index) => <p key={index}>{p}</p>)}
          </div>
        )}
        {infos.what && (
          <div>
            <h3>Quoi ?</h3>
            <p>{infos.what}</p>
          </div>
        )}
        {infos.when && (
          <div>
            <h3>Quand ?</h3>
            <ul className="dates-info">
              {infos.when.map(
                (occurence, index) =>
                  index < 7 && console.log(tz) && (
                    <li key={index}>
                      <Capitalize>{moment(occurence).tz(tz).format('dddd DD/MM/YYYY à H:mm')}</Capitalize>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}
        {infos.where.name &&
          infos.where.address && (
            <div>
              <h3>Où ?</h3>
              <a
                className="distance"
                href={navigationLink(venue.latitude, venue.longitude)}
              >
                {distance}
                <Icon svg="ico-geoloc-solid2" alt="Géolocalisation" />
              </a>
              <ul className="address-info">
                <li>{infos.where.name}</li>
                {infos.where.address
                  .split(/[,\n\r]/)
                  .map((el, index) => <li key={index}><Capitalize>{el}</Capitalize></li>)}
              </ul>
            </div>
          )}
      </div>
    )
  }
}

export default connect(state => ({
  distance: selectDistance(state),
  offer: selectCurrentOffer(state),
  offerer: selectCurrentOfferer(state),
  source: selectCurrentSource(state),
  thumbUrl: selectCurrentThumbUrl(state),
  recommendation: selectCurrentRecommendation(state),
  venue: selectVenue(state),
  tz: selectTimezone(state),
}))(OfferInfo)
