import { capitalize, pluralize } from 'pass-culture-shared'
import find from 'lodash.find'
import moment from 'moment'
import { getTimezone } from '../../../utils/timezone'

const filterIconByState = filters => (filters ? 'filter' : 'filter-active')

export const INITIAL_FILTER_PARAMS = {
  categories: null,
  date: null,
  distance: null,
  jours: null,
  latitude: null,
  longitude: null,
}

export const isSearchFiltersAdded = (initialParams, filterParams) =>
  Object.keys(initialParams).every(
    key =>
      typeof filterParams[key] === 'undefined' ||
      filterParams[key] === null ||
      filterParams[key] === ''
  )

export const getFirstChangingKey = (previousObject, nextObject) =>
  Object.keys(nextObject).find(key => {
    const isNewFalsy = nextObject[key] === null || nextObject[key] === ''
    const isPreviousFalsy =
      typeof previousObject[key] === 'undefined' ||
      previousObject[key] === null ||
      previousObject === ''
    if (isNewFalsy && isPreviousFalsy) {
      return false
    }
    return previousObject[key] !== nextObject[key]
  })

export const searchResultsTitle = (keywords, items, queryParams) => {
  let resultTitle
  if (keywords) {
    const count = items.length
    const resultString = pluralize(count, 'résultats')
    const keywordsString = decodeURI(keywords || '')
    const typesString = decodeURI(queryParams.types || '')
    resultTitle = `"${keywordsString}" ${typesString}: ${resultString}`
  }
  return resultTitle
}

const formatDate = (date, tz) =>
  capitalize(
    moment(date)
      .tz(tz)
      .format('dddd DD/MM/YYYY')
  )

export const getRecommendationDateString = offer => {
  if (offer.eventId === null) return 'permanent'

  const departementCode = offer.venue.departementCode
  const tz = getTimezone(departementCode)

  const fromDate = offer.dateRange[0]
  const toDate = offer.dateRange[1]
  const formatedDate = `du ${formatDate(fromDate, tz)} au ${formatDate(
    toDate,
    tz
  )}`
  return formatedDate
}

export const getDescriptionForSublabel = (category, data) => {
  // TODO continue with special chars...
  const categoryWithoutSpecialChar = category.replace(/%C3%89/g, 'É')
  return find(data, ['sublabel', categoryWithoutSpecialChar]).description
}

export const handleQueryChange = (newValue, callback) => {
  const { pagination } = this.props
  const { query } = this.state

  const nextFilterParams = Object.assign({}, query, newValue)
  const isNew = getFirstChangingKey(pagination.windowQuery, newValue)

  this.setState(
    {
      isNew,
      query: nextFilterParams,
    },
    callback
  )
}

// TODO SEARCH FILTER FUNCTIONS REFACTORING handleQueryChange etc

export default filterIconByState
