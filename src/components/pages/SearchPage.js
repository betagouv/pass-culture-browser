import get from 'lodash.get'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import {
  Icon,
  InfiniteScroller,
  requestData,
  withSearch,
  pluralize,
} from 'pass-culture-shared'

import Main from '../layout/Main'
import Footer from '../layout/Footer'
import SearchByOfferType from '../SearchByOfferType'
import SearchResultItem from '../SearchResultItem'
import SearchFilter from '../SearchFilter'
import searchSelector from '../../selectors/search'
import { selectRecommendations } from '../../selectors'
import { toggleFilterMenu } from '../../reducers/filter'

const renderPageHeader = () => (
  <header>
    <h1>
Recherche
    </h1>
  </header>
)

const renderPageFooter = () => {
  const footerProps = { borderTop: true, colored: true }
  return <Footer {...footerProps} />
}

class SearchPage extends Component {
  onFilterClick = () => {
    const { dispatch } = this.props
    dispatch(toggleFilterMenu())
  }

  handleDataRequest = (handleSuccess = () => {}, handleFail = () => {}) => {
    const { dispatch, goToNextSearchPage, location, querySearch } = this.props
    const len = get(location, 'search.length')
    if (!len) return
    dispatch(
      requestData('GET', `recommendations?${querySearch}`, {
        handleFail,
        handleSuccess: (state, action) => {
          handleSuccess(state, action)
          goToNextSearchPage()
        },
      })
    )
  }

  render() {
    const {
      handleClearQueryParams,
      handleQueryParamsChange,
      handleRemoveFilter,
      handleSearchChange,
      isVisible,
      queryParams,
      recommendations,
    } = this.props
    const { search } = queryParams || {}

    return (
      <Main
        handleDataRequest={this.handleDataRequest}
        header={renderPageHeader}
        name="search"
        footer={renderPageFooter}
      >
        <div>
          <form className="section" onSubmit={handleSearchChange}>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  id="search"
                  className="input search-input"
                  placeholder="Saisissez une recherche"
                  type="text"
                  defaultValue={search}
                />
              </div>
              <div className="control">
                <button className="button is-rounded is-medium" type="submit">
                  Chercher
                </button>
              </div>
              <button
                type="button"
                className="button is-secondary"
                onClick={this.onFilterClick}
              >
                &nbsp;
                <Icon svg="ico-filter" />
                &nbsp;
              </button>
              <button
                type="button"
                id="close-filter-menu"
                className="button is-secondary"
                onClick={this.onFilterClick}
              >
                &nbsp;
                <Icon svg="ico-chevron-up" />
                &nbsp;
              </button>
            </div>
          </form>
        </div>
        <SearchFilter
          handleQueryParamsChange={handleQueryParamsChange}
          handleRemoveFilter={handleRemoveFilter}
          handleClearQueryParams={handleClearQueryParams}
          isVisible={isVisible}
        />
        <InfiniteScroller
          className="recommendations-list main-list"
          handleLoadMore={this.handleDataRequest}
        >
          <h2>
            {search &&
              `"${search}" : ${pluralize(recommendations.length, 'résultats')}`}
          </h2>
          {recommendations.map(o => (
            <SearchResultItem key={o.id} recommendation={o} />
          ))}
        </InfiniteScroller>
        {recommendations &&
          recommendations.length === 0 && (
            <SearchByOfferType
              handleQueryParamsChange={handleQueryParamsChange}
              title="PAR CATEGORIES"
            />
          )}
      </Main>
    )
  }
}

SearchPage.defaultProps = {
  querySearch: null,
}

SearchPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  goToNextSearchPage: PropTypes.func.isRequired,
  handleClearQueryParams: PropTypes.func.isRequired,
  handleQueryParamsChange: PropTypes.func.isRequired,
  handleRemoveFilter: PropTypes.func.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  queryParams: PropTypes.object.isRequired,
  querySearch: PropTypes.string,
  recommendations: PropTypes.array.isRequired,
}

export default compose(
  withSearch({
    dataKey: 'recommendations',
    defaultQueryParams: {
      search: undefined,
    },
  }),
  connect((state, ownProps) => {
    const queryParams = searchSelector(state, ownProps.location.search)
    return {
      isVisible: state.filter,
      queryParams,
      recommendations: selectRecommendations(state),
      user: state.user,
    }
  })
)(SearchPage)
