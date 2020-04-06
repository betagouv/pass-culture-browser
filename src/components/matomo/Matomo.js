import PropTypes from 'prop-types'
import queryString from 'query-string'
import { MATOMO_GEOLOCATION_GOAL_ID } from '../../utils/config'

const Matomo = ({ location, userId, coordinates }) => {
  const Matomo = window._paq

  const { pathname, search } = location
  const searchParameters = queryString.parse(search)
  const searchKeyword = searchParameters['mots-cles']

  Matomo.push(['setCustomUrl', pathname])
  Matomo.push(['setDocumentTitle', document.title])

  if (searchKeyword) {
    const categories = searchParameters['categories'] || false
    const numberOfResults = false

    Matomo.push(['trackSiteSearch', searchKeyword, categories, numberOfResults])
  }

  Matomo.push(['setUserId', userId + ' on WEBAPP'])

  if (location.pathname == '/connexion') {
    Matomo.push(['resetUserId'])
  }

  Matomo.push(['trackPageView'])

  if (coordinates.latitude && coordinates.longitude) {
    Matomo.push(['trackGoal', MATOMO_GEOLOCATION_GOAL_ID])
  }

  return null
}

Matomo.propTypes = {
  coordinates: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  userId: PropTypes.string.isRequired,
}

export default Matomo
