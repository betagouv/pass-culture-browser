import { mount, shallow } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import { Route, Router } from 'react-router'
import { CATEGORY_CRITERIA } from '../Criteria/criteriaEnums'
import { CriteriaCategory } from '../CriteriaCategory/CriteriaCategory'
import { CriteriaLocation } from '../CriteriaLocation/CriteriaLocation'
import { CriteriaSort } from '../CriteriaSort/CriteriaSort'
import { Home } from '../Home/Home'
import SearchResults from '../Result/SearchResults'
import SearchAlgolia from '../SearchAlgolia'

describe('components | SearchAlgolia', () => {
  let props
  beforeEach(() => {
    props = {
      geolocation: {
        latitude: 32,
        longitude: 45,
      },
      history: createBrowserHistory(),
      match: {
        params: {},
      },
      query: {
        clear: jest.fn(),
        change: jest.fn(),
        parse: jest.fn(),
      },
      redirectToSearchMainPage: jest.fn(),
    }
  })

  describe('routing', () => {
    describe('home page', () => {
      it('should render home page when path is exactly /recherche', () => {
        // given
        const wrapper = shallow(<SearchAlgolia {...props} />)

        // when
        const routes = wrapper.find(Route)

        // then
        expect(routes.at(0).prop('path')).toBe('/recherche(/menu)?')
        expect(routes.at(0).prop('exact')).toBe(true)
        const home = routes.at(0).find(Home)
        expect(home).toHaveLength(1)
        expect(home.prop('categoryCriterion')).toStrictEqual({
          icon: 'ico-all',
          label: 'Toutes les catégories',
          facetFilter: '',
        })
        expect(home.prop('geolocationCriterion')).toStrictEqual({
          isSearchAroundMe: false,
          params: { icon: 'ico-everywhere', label: 'Partout', requiresGeolocation: false },
        })
        expect(home.prop('history')).toStrictEqual(props.history)
        expect(home.prop('sortCriterion')).toStrictEqual({
          icon: 'ico-relevance',
          index: '',
          label: 'Pertinence',
          requiresGeolocation: false,
        })
      })
    })

    describe('results page', () => {
      it('should render search results page when path is /recherche/resultats', () => {
        // given
        props.history.location.pathname = 'recherche/resultats'
        const wrapper = shallow(<SearchAlgolia {...props} />)

        // when
        const routes = wrapper.find(Route)

        // then
        const resultatsRoute = routes.at(1)
        expect(resultatsRoute.prop('path')).toBe('/recherche/resultats')
        const searchResultsComponent = resultatsRoute.find(SearchResults)
        expect(searchResultsComponent.prop('criteria')).toStrictEqual({
          categories: [],
          isSearchAroundMe: false,
          sortBy: '',
        })
        expect(searchResultsComponent.prop('geolocation')).toStrictEqual(props.geolocation)
        expect(searchResultsComponent.prop('history')).toStrictEqual(props.history)
        expect(searchResultsComponent.prop('match')).toStrictEqual(props.match)
        expect(searchResultsComponent.prop('query')).toStrictEqual(props.query)
        expect(searchResultsComponent.prop('redirectToSearchMainPage')).toStrictEqual(
          props.redirectToSearchMainPage
        )
        expect(searchResultsComponent.prop('search')).toStrictEqual(props.history.location.search)
      })

      it('should render search results page with given category when path is /recherche/resultats', () => {
        // given
        props.history.location.pathname = 'recherche/resultats'
        const wrapper = shallow(<SearchAlgolia {...props} />)
        wrapper.setState({ categoryCriterion: CATEGORY_CRITERIA.CINEMA })

        // when
        const routes = wrapper.find(Route)

        // then
        const resultatsRoute = routes.at(1)
        expect(resultatsRoute.prop('path')).toBe('/recherche/resultats')
        const searchResultsComponent = resultatsRoute.find(SearchResults)
        expect(searchResultsComponent.prop('criteria')).toStrictEqual({
          categories: ['CINEMA'],
          isSearchAroundMe: false,
          sortBy: '',
        })
      })
    })

    describe('geolocation criteria page', () => {
      it('should render geolocation criteria page when path is /recherche/criteres-localisation', () => {
        // given
        props.history.location.pathname = 'recherche/criteres-localisation'
        const wrapper = shallow(<SearchAlgolia {...props} />)

        // when
        const routes = wrapper.find(Route)

        // then
        const criteriaLocationRoute = routes.at(2)
        expect(criteriaLocationRoute.prop('path')).toBe('/recherche/criteres-localisation')
        const searchCriteriaLocation = criteriaLocationRoute.find(CriteriaLocation)
        expect(searchCriteriaLocation.prop('activeCriterionLabel')).toStrictEqual('Partout')
        expect(searchCriteriaLocation.prop('criteria')).toStrictEqual(expect.any(Object))
        expect(searchCriteriaLocation.prop('geolocation')).toStrictEqual(props.geolocation)
        expect(searchCriteriaLocation.prop('history')).toStrictEqual(props.history)
        expect(searchCriteriaLocation.prop('match')).toStrictEqual(props.match)
        expect(searchCriteriaLocation.prop('onCriterionSelection')).toStrictEqual(expect.any(Function))
        expect(searchCriteriaLocation.prop('title')).toStrictEqual('Localisation')
      })

      it('should redirect to main page when clicking on Criteria', () => {
        // given
        props.history.push('/recherche/criteres-localisation')
        const wrapper = mount(
          <Router history={props.history}>
            <SearchAlgolia {...props} />
          </Router>
        )
        const everywhereButton = wrapper
          .find('button')
          .first()

        // when
        everywhereButton.simulate('click')

        // then
        expect(props.redirectToSearchMainPage).toHaveBeenCalledWith()
      })
    })

    describe('category criteria page', () => {
      it('should render category criteria page when path is /recherche/criteres-categorie', () => {
        // given
        props.history.location.pathname = '/recherche/criteres-categorie'
        const wrapper = shallow(<SearchAlgolia {...props} />)

        // when
        const routes = wrapper.find(Route)

        // then
        const critereCategorieRoute = routes.at(3)
        expect(critereCategorieRoute.prop('path')).toBe('/recherche/criteres-categorie')
        const searchCriteriaCategory = critereCategorieRoute.find(CriteriaCategory)
        expect(searchCriteriaCategory.prop('activeCriterionLabel')).toStrictEqual(
          'Toutes les catégories'
        )
        expect(searchCriteriaCategory.prop('criteria')).toStrictEqual(expect.any(Object))
        expect(searchCriteriaCategory.prop('history')).toStrictEqual(props.history)
        expect(searchCriteriaCategory.prop('match')).toStrictEqual(props.match)
        expect(searchCriteriaCategory.prop('onCriterionSelection')).toStrictEqual(
          expect.any(Function)
        )
        expect(searchCriteriaCategory.prop('title')).toStrictEqual('Catégories')
      })
    })

    describe('sort criteria page', () => {
      it('should render sorting criteria page when path is /recherche/criteres-tri', () => {
        // given
        props.history.location.pathname = '/recherche/criteres-tri'
        const wrapper = shallow(<SearchAlgolia {...props} />)

        // when
        const routes = wrapper.find(Route)

        // then
        const sortingCriteriaRoute = routes.at(4)
        expect(sortingCriteriaRoute.prop('path')).toBe('/recherche/criteres-tri')
        const sortingCriteria = sortingCriteriaRoute.find(CriteriaSort)
        expect(sortingCriteria.prop('activeCriterionLabel')).toStrictEqual('Pertinence')
        expect(sortingCriteria.prop('criteria')).toStrictEqual(expect.any(Object))
        expect(sortingCriteria.prop('geolocation')).toStrictEqual(props.geolocation)
        expect(sortingCriteria.prop('history')).toStrictEqual(props.history)
        expect(sortingCriteria.prop('match')).toStrictEqual(props.match)
        expect(sortingCriteria.prop('onCriterionSelection')).toStrictEqual(expect.any(Function))
        expect(sortingCriteria.prop('title')).toStrictEqual('Trier par')
      })
    })
  })

  describe('render', () => {
    it('should define a resize event to prevent page from resizing when Android keyboard is displayed', () => {
      // Given
      const metaTag = document.createElement('meta')
      jest
        .spyOn(document, 'querySelector')
        .mockReturnValueOnce({ offsetHeight: 123 })
        .mockReturnValue(metaTag)
      shallow(<SearchAlgolia {...props} />)

      // When
      window.onresize()

      // Then
      expect(document.querySelector().content).toMatch(
        'height=123px, width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no'
      )
    })

    it('should reset the resize event and meta tag when unmounting', () => {
      // Given
      const metaTag = document.createElement('meta')
      jest.spyOn(document, 'querySelector').mockReturnValue(metaTag)
      const wrapper = shallow(<SearchAlgolia {...props} />)

      // When
      wrapper.unmount()

      // Then
      expect(window.onresize).toBeNull()
      expect(document.querySelector().content).toBe(
        'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no'
      )
    })

    it('should select "Partout" by default', () => {
      // given
      props.isGeolocationEnabled = false
      props.history.location.pathname = '/recherche'
      const wrapper = mount(
        <Router history={props.history}>
          <SearchAlgolia {...props} />
        </Router>
      )

      // when
      const aroundMe = wrapper.findWhere(node => node.text() === 'Partout').first()

      // then
      expect(aroundMe).toHaveLength(1)
    })

    it('should select "Toutes les catégories" by default', () => {
      // given
      props.history.location.pathname = '/recherche/criteres-categorie'
      const wrapper = mount(
        <Router history={props.history}>
          <SearchAlgolia {...props} />
        </Router>
      )

      // when
      const aroundMe = wrapper.findWhere(node => node.text() === 'Toutes les catégories').first()

      // then
      expect(aroundMe).toHaveLength(1)
    })
  })
})
