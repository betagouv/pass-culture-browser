import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

import Icon from '../../../layout/Icon'

const MyFavorite = ({
  favorite,
  humanizeRelativeDistance,
  location,
  offer,
  status
}) => {
  const { id: favoriteId, thumbUrl } = favorite
  const { name: offerName, product } = offer || {}
  const { offerType } = product || {}
  const { appLabel = '' } = offerType || {}
  const { pathname, search } = location
  const detailsUrl = `${pathname}/details/${favoriteId}${search}`
  return (
    <li className="mf-my-favorite">
      <Link
        className="teaser-link"
        to={detailsUrl}
      >
        <div className="teaser-thumb">{thumbUrl && <img
          alt=""
          src={thumbUrl}
                                                   />}
        </div>
        <div className="teaser-wrapper mf-wrapper">
          <div className="teaser-title">{offerName}</div>
          <div className="teaser-sub-title">{appLabel}</div>
          <div className="mf-infos">
            {status && <span className={`mf-status mf-${status.class}`}>{status.label}</span>}
            <span className="teaser-sub-title">{humanizeRelativeDistance}</span>
          </div>
        </div>
        <div className="teaser-arrow">
          <Icon
            className="teaser-arrow-img"
            svg="ico-next-S"
          />
        </div>
      </Link>
    </li>
  )
}

MyFavorite.defaultProps = {
  favorite: null
}

MyFavorite.propTypes = {
  favorite: PropTypes.shape({
    id: PropTypes.string.isRequired,
    thumbUrl: PropTypes.string.isRequired
  }),
  humanizeRelativeDistance: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired
  }).isRequired,
  offer: PropTypes.shape({
    dateRange: PropTypes.arrayOf(PropTypes.string),
    isFinished: PropTypes.bool,
    isFullyBooked: PropTypes.bool,
    name: PropTypes.string,
    product: PropTypes.shape({
      offerType: PropTypes.shape({
        appLabel: PropTypes.string
      })
    }),
    stocks: PropTypes.arrayOf(PropTypes.shape({
      bookings: PropTypes.arrayOf(PropTypes.shape())
    }))
  }).isRequired,
  status: PropTypes.shape({
    class: PropTypes.string,
    label: PropTypes.string
  }).isRequired
}

export default MyFavorite
