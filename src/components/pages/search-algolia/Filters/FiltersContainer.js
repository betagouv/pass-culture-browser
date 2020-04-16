import { selectUserGeolocation } from '../../../../redux/selectors/geolocationSelectors'
import { isGeolocationEnabled, isUserAllowedToSelectCriterion } from '../../../../utils/geolocation'
import { connect } from 'react-redux'
import { Filters } from './Filters'

export const mapStateToProps = (state, ownProps) => {
  const geolocation = selectUserGeolocation(state)
  const redirectToSearchFiltersPage = () => {
    const { history } = ownProps
    const { location: { search = '' } } = history
    history.push(`/recherche/resultats/filtres${search}`)
  }

  return {
    geolocation,
    isGeolocationEnabled: isGeolocationEnabled(geolocation),
    isUserAllowedToSelectCriterion,
    redirectToSearchFiltersPage,
  }
}

export default connect(mapStateToProps)(Filters)
