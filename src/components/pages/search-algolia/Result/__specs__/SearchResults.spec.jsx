import { mount, shallow } from 'enzyme'
import { createBrowserHistory, createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { toast } from 'react-toastify'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import state from '../../../../../mocks/state'
import { fetchAlgolia } from '../../../../../vendor/algolia/algolia'
import HeaderContainer from '../../../../layout/Header/HeaderContainer'
import RelativeFooterContainer from '../../../../layout/RelativeFooter/RelativeFooterContainer'
import Spinner from '../../../../layout/Spinner/Spinner'
import { SORT_CRITERIA } from '../../Criteria/criteriaEnums'
import { Filters } from '../../Filters/Filters'
import { EmptySearchResult } from '../EmptySearchResult'
import Result from '../Result'
import SearchAlgoliaDetailsContainer from '../ResultDetail/ResultDetailContainer'
import SearchResults from '../SearchResults'
import { SearchResultsList } from '../SearchResultsList'
import CriteriaSort from '../../CriteriaSort/CriteriaSort'
import { isGeolocationEnabled } from '../../../../../utils/geolocation'

jest.mock('../../../../../vendor/algolia/algolia', () => ({
  fetchAlgolia: jest.fn(),
}))
jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
  },
}))
jest.mock('../../../../../utils/geolocation', () => {
  const geolocationModule = jest.requireActual('../../../../../utils/geolocation')
  return {
    ...geolocationModule,
    isGeolocationEnabled: jest.fn(),
  }
})

const stubRef = wrapper => {
  const instance = wrapper.instance()
  instance['inputRef'] = {
    current: {
      blur: jest.fn(),
    },
  }
}

describe('components | SearchResults', () => {
  let props
  let change
  let clear
  let parse
  let replace
  let push

  beforeEach(() => {
    change = jest.fn()
    clear = jest.fn()
    parse = jest.fn().mockReturnValue({})
    replace = jest.fn()
    push = jest.fn()

    props = {
      criteria: {
        categories: [],
        searchAround: {
          everywhere: true,
          place: false,
          user: false
        },
        sortBy: '',
      },
      history: {
        location: {
          pathname: '/fake-url',
          search: '?mots-cles=librairie',
        },
        push,
        search: '',
        replace,
      },
      match: {
        params: {},
      },
      place: {
        geolocation: { latitude: null, longitude: null },
        name: null
      },
      query: {
        change,
        clear,
        parse,
      },
      redirectToSearchMainPage: jest.fn(),
      userGeolocation: {
        latitude: 40.1,
        longitude: 41.1,
      },
    }
    isGeolocationEnabled.mockReturnValue(true)
    fetchAlgolia.mockReturnValue(
      new Promise(resolve => {
        resolve({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
        })
      })
    )
  })

  afterEach(() => {
    fetchAlgolia.mockReset()
    parse.mockReset()
    replace.mockReset()
  })

  describe('when render', () => {
    it('should display a header with the right properties', () => {
      // when
      const wrapper = shallow(<SearchResults {...props} />)

      // then
      const header = wrapper.find(HeaderContainer)
      expect(header).toHaveLength(1)
    })

    it('should display a form element with an input text', () => {
      // when
      const wrapper = shallow(<SearchResults {...props} />)

      // then
      const form = wrapper.find('form')
      expect(form).toHaveLength(1)
      const textInput = form.find('input')
      expect(textInput).toHaveLength(1)
      expect(textInput.prop('name')).toBe('keywords')
      expect(textInput.prop('placeholder')).toBe('Titre, artiste...')
      expect(textInput.prop('type')).toBe('search')
    })

    it('should display a filter button', () => {
      // when
      const wrapper = shallow(<SearchResults {...props} />)

      // then
      const filterButton = wrapper.find({ children: 'Filtrer'})
      expect(filterButton).toHaveLength(1)
    })

    it('should display the number of selected filters in the filter button', () => {
      //given
      props.criteria.searchAround = {
        everywhere: false,
        place: false,
        user: true
      }
      props.criteria.categories = ['CINEMA']

      // when
      const wrapper = shallow(<SearchResults {...props} />)
      const numberOfActiveFilters = wrapper.find('[data-test="sr-filter-button-counter"]')

      // then
      expect(numberOfActiveFilters.text()).toStrictEqual('2')
    })

    it('should display the number of selected filters in the filter button when categories are provided by the url', () => {
      //given
      props.query.parse.mockReturnValue({
        'autour-de': 'oui',
        categories: 'CINEMA;VISITE',
      })

      // when
      const wrapper = shallow(<SearchResults {...props} />)

      // then
      const numberOfActiveFilters = wrapper.find('[data-test="sr-filter-button-counter"]')
      expect(numberOfActiveFilters.text()).toStrictEqual('3')
    })

    it('should display the number of selected filters in the filter button when categories are provided by the url and props', () => {
      //given
      props.criteria.searchAround = {
        everywhere: false,
        place: false,
        user: true
      }
      props.criteria.categories = ['CINEMA']
      props.query.parse.mockReturnValue({
        'autour-de': 'oui',
        categories: 'CINEMA;VISITE',
      })

      // when
      const wrapper = shallow(<SearchResults {...props} />)
      const numberOfActiveFilters = wrapper.find('[data-test="sr-filter-button-counter"]')

      // then
      expect(numberOfActiveFilters.text()).toStrictEqual('3')
    })

    it('should display a footer', () => {
      // when
      const wrapper = shallow(<SearchResults {...props} />)

      // then
      const footer = wrapper.find(RelativeFooterContainer)
      expect(footer).toHaveLength(1)
      expect(footer.prop('extraClassName')).toBe('dotted-top-red')
      expect(footer.prop('theme')).toBe('white')
    })

    it('should display spinner while loading', () => {
      // when
      const wrapper = shallow(<SearchResults {...props} />)

      // then
      expect(wrapper.find(Spinner)).toHaveLength(1)
    })

    it('should not display emptySearchResult component when loading', () => {
      // when
      const wrapper = shallow(<SearchResults {...props} />)

      // then
      expect(wrapper.find(EmptySearchResult)).toHaveLength(0)
    })

    it('should not display spinner while loading is not over', async () => {
      // when
      const wrapper = await shallow(<SearchResults {...props} />)

      // then
      expect(wrapper.find(Spinner)).toHaveLength(0)
    })

    it('should fetch data using query params when provided', async () => {
      // given
      fetchAlgolia.mockReturnValue(
        new Promise(resolve => {
          resolve({
            hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
            nbHits: 2,
            nbPages: 0,
            page: 0,
          })
        })
      )
      props.criteria.searchAround = {
        everywhere: false,
        place: false,
        user: true
      }
      parse.mockReturnValue({
        'autour-de': 'oui',
        categories: 'MUSEE',
        'mots-cles': 'une librairie',
        tri: '_by_price',
      })
      props.criteria = {}

      // when
      await shallow(<SearchResults {...props} />)

      // then
      expect(fetchAlgolia).toHaveBeenCalledWith({
        aroundRadius: 100,
        geolocation: {
          latitude: 40.1,
          longitude: 41.1,
        },
        keywords: 'une librairie',
        offerCategories: ['MUSEE'],
        offerIsDuo: false,
        offerIsFree: false,
        offerTypes: {
          isDigital: false,
          isEvent: false,
          isThing: false,
        },
        page: 0,
        priceRange: [0, 500],
        searchAround: true,
        sortBy: '_by_price',
      })
    })

    describe('when no keywords in url', () => {
      it('should fetch data with page 0, given categories, geolocation around user, sort by proximity', () => {
        props.criteria = {
          categories: ['Cinéma'],
          searchAround: {
            everywhere: false,
            place: false,
            user: true
          },
          sortBy: '_by_proximity',
        }

        // when
        shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith({
          aroundRadius: 100,
          geolocation: props.userGeolocation,
          keywords: '',
          offerCategories: ['Cinéma'],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          page: 0,
          priceRange: [0, 500],
          searchAround: true,
          sortBy: '_by_proximity',
        })
      })
    })

    describe('when no results', () => {
      beforeEach(() => {
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [],
              page: 0,
              nbHits: 0,
              nbPages: 0,
              hitsPerPage: 2,
              processingTimeMS: 1,
              query: 'librairie',
              params: 'query=librairie&hitsPerPage=2',
            })
          })
        )
      })

      afterEach(() => {
        fetchAlgolia.mockReset()
        props.query.parse.mockReset()
      })

      it('should display EmptySearchResult component when 0 result', async () => {
        // given
        const wrapper = shallow(<SearchResults {...props} />)
        stubRef(wrapper)
        const form = wrapper.find('form')

        // when
        await form.simulate('submit', {
          target: {
            keywords: {
              value: 'librairie',
            },
          },
          preventDefault: jest.fn(),
        })

        // then
        const emptySearchResult = wrapper.find(EmptySearchResult)
        const filterButton = wrapper.find({ children: 'Filtrer' })
        expect(emptySearchResult).toHaveLength(1)
        expect(filterButton).toHaveLength(0)
        expect(emptySearchResult.prop('searchedKeywords')).toBe('librairie')
      })

      it('should fetch offers in all categories, without keyword, around user and sorted by relevance when clicking on "autour de chez toi"', async () => {
        // given
        const history = createBrowserHistory()
        props.history = history
        props.history.push(
          '/recherche/resultats?mots-cles=recherche%20sans%20résultat&autour-de=oui&tri=_by_price&categories=INSTRUMENT'
        )
        props.query.parse.mockReturnValue({
          'autour-de': 'oui',
          categories: 'INSTRUMENT',
          'mots-cles': 'recherche sans résultat',
          tri: '_by_price',
        })
        const wrapper = await mount(
          <Router history={history}>
            <SearchResults {...props} />
          </Router>
        )
        wrapper.update()
        const linkButton = wrapper.find({ children: 'autour de chez toi' })

        // when
        await linkButton.simulate('click')

        // then
        expect(fetchAlgolia).toHaveBeenNthCalledWith(2, {
          aroundRadius: 100,
          geolocation: {
            latitude: 40.1,
            longitude: 41.1,
          },
          keywords: '',
          offerCategories: [],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          page: 0,
          priceRange: [0, 500],
          searchAround: true,
          sortBy: '',
        })
        const expectedUri = props.history.location.pathname + props.history.location.search
        expect(expectedUri).toBe('/recherche/resultats?mots-cles=&autour-de=oui&tri=&categories=&latitude=40.1&longitude=41.1')
      })
    })

    describe('when keywords in url', () => {
      it('should fill search input, display keywords, number of results and fetch data with page 0', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA', offer: { dates: [1586248757] } }],
              nbHits: 1,
              nbPages: 1,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'autour-de': 'non',
          'mots-cles': 'une librairie',
        })

        // when
        const wrapper = await shallow(<SearchResults {...props} />)

        // then
        const searchResultsListComponent = wrapper.find(SearchResultsList)
        const results = searchResultsListComponent.prop('results')
        const searchInput = wrapper.find('input')
        expect(results).toHaveLength(1)
        expect(searchInput.prop('value')).toBe('une librairie')
        expect(searchResultsListComponent.prop('resultsCount')).toBe(1)
        expect(fetchAlgolia).toHaveBeenCalledWith({
          aroundRadius: 100,
          geolocation: {
            latitude: 40.1,
            longitude: 41.1,
          },
          keywords: 'une librairie',
          offerCategories: [],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          page: 0,
          priceRange: [0, 500],
          searchAround: false,
          sortBy: '',
        })
      })

      it('should fill search input and display keywords, number of results when results are found', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
              nbHits: 2,
              nbPages: 0,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'autour-de': 'oui',
          'mots-cles': 'une librairie',
        })

        // when
        const wrapper = await shallow(<SearchResults {...props} />)

        // then
        const searchResultsListComponent = wrapper.find(SearchResultsList)
        const results = searchResultsListComponent.prop('results')
        const searchInput = wrapper.find('input')
        expect(results).toHaveLength(2)
        expect(searchResultsListComponent.prop('resultsCount')).toBe(2)
        expect(searchResultsListComponent.prop('geolocation')).toStrictEqual(props.userGeolocation)
        expect(searchResultsListComponent.prop('results')).toStrictEqual([
          { objectID: 'AA' },
          { objectID: 'BB' },
        ])
        expect(searchResultsListComponent.prop('search')).toBe(props.history.location.search)
        expect(searchInput.prop('value')).toBe('une librairie')
      })
    })

    describe('when geolocation', () => {
      it('should fetch data using geolocation coordinates when geolocation is enabled', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
              nbHits: 2,
              nbPages: 2,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'autour-de': 'oui',
          'mots-cles': 'une librairie',
        })

        // when
        shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith({
          aroundRadius: 100,
          geolocation: { latitude: 40.1, longitude: 41.1 },
          keywords: 'une librairie',
          offerCategories: [],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          page: 0,
          priceRange: [0, 500],
          searchAround: true,
          sortBy: '',
        })
      })

      it('should replace "autour-de" query param from oui to non when geolocation is disabled', async () => {
        // given
        props.userGeolocation = {
          latitude: null,
          longitude: null,
        }
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [],
              nbHits: 0,
              nbPages: 0,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'autour-de': 'oui',
        })
        isGeolocationEnabled.mockReturnValue(false)

        // when
        shallow(<SearchResults {...props} />)

        // then
        expect(props.history.replace).toHaveBeenCalledWith({
          search: '?mots-cles=&autour-de=non&tri=&categories=',
        })
        expect(fetchAlgolia).toHaveBeenCalledWith({
          aroundRadius: 100,
          geolocation: { latitude: null, longitude: null },
          keywords: '',
          offerCategories: [],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          page: 0,
          priceRange: [0, 500],
          searchAround: false,
          sortBy: '',
        })
      })
    })

    describe('when category filter', () => {
      it('should fetch data filtered by categories from props when provided', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
              nbHits: 2,
              nbPages: 2,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          categories: '',
          'mots-cles': 'une librairie',
        })
        props.criteria.categories = ['CINEMA']

        // when
        await shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith({
          aroundRadius: 100,
          geolocation: { latitude: 40.1, longitude: 41.1 },
          keywords: 'une librairie',
          offerCategories: ['CINEMA'],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          page: 0,
          priceRange: [0, 500],
          searchAround: false,
          sortBy: '',
        })
      })

      it('should fetch data filtered by categories from URL when provided', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
              nbHits: 2,
              nbPages: 0,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'autour-de': 'oui',
          categories: 'CINEMA',
          'mots-cles': 'une librairie',
        })
        props.criteria = {}

        // when
        await shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith({
          aroundRadius: 100,
          geolocation: { latitude: 40.1, longitude: 41.1 },
          keywords: 'une librairie',
          offerCategories: ['CINEMA'],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: { isDigital: false, isEvent: false, isThing: false },
          priceRange: [0, 500],
          page: 0,
          searchAround: true,
        })
      })

      it('should fetch data filtered by categories from URL when both from props and URL are provided', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
              nbHits: 2,
              nbPages: 2,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          categories: 'CINEMA',
          'mots-cles': 'une librairie',
        })
        props.criteria.categories = ['VISITE']

        // when
        await shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith({
          aroundRadius: 100,
          geolocation: { latitude: 40.1, longitude: 41.1 },
          keywords: 'une librairie',
          offerCategories: ['CINEMA'],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: { isDigital: false, isEvent: false, isThing: false },
          priceRange: [0, 500],
          page: 0,
          searchAround: false,
          sortBy: ''
        })
      })

      it('should fetch data with empty category filter when no category in URL nor props provided', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [],
              nbHits: 0,
              nbPages: 0,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          categories: '',
          'mots-cles': 'une librairie',
        })

        // when
        await shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith({
          aroundRadius: 100,
          geolocation: { latitude: 40.1, longitude: 41.1 },
          keywords: 'une librairie',
          offerCategories: [],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          page: 0,
          priceRange: [0, 500],
          searchAround: false,
          sortBy: '',
        })
      })
    })

    describe('when sort filter', () => {
      it('should fetch data using sort filter when provided from url', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
              nbHits: 2,
              nbPages: 0,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'mots-cles': 'une librairie',
          tri: '_by_proximity',
        })

        // when
        await shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith({
          aroundRadius: 100,
          geolocation: { latitude: 40.1, longitude: 41.1 },
          keywords: 'une librairie',
          offerCategories: [],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          page: 0,
          priceRange: [0, 500],
          searchAround: false,
          sortBy: '_by_proximity',
        })
      })

      it('should fetch data using sort filter when provided from prop', async () => {
        // given
        props.criteria.sortBy = '_by_proximity'
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
              nbHits: 2,
              nbPages: 0,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'mots-cles': 'une librairie',
          tri: '',
        })

        // when
        await shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith({
          aroundRadius: 100,
          geolocation: { latitude: 40.1, longitude: 41.1 },
          keywords: 'une librairie',
          offerCategories: [],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          page: 0,
          priceRange: [0, 500],
          searchAround: false,
          sortBy: '_by_proximity',
        })
      })

      it('should fetch data not using sort filter when not provided', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
              nbHits: 2,
              nbPages: 0,
              page: 0,
            })
          })
        )
        props.criteriacategories = []
        parse.mockReturnValue({
          'mots-cles': 'une librairie',
          tri: '',
        })

        // when
        await shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith({
          aroundRadius: 100,
          geolocation: { latitude: 40.1, longitude: 41.1 },
          keywords: 'une librairie',
          offerCategories: [],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          page: 0,
          priceRange: [0, 500],
          searchAround: false,
          sortBy: ''
        })
      })

      it('should display the sort filter received from props', async () => {
        // given
        fetchAlgolia.mockReturnValueOnce(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA', offer: { dates: [1586248757] } }],
              nbHits: 1,
              nbPages: 0,
              page: 0,
            })
          })
        )
        props.criteria.sortBy = '_by_price'

        // when
        const wrapper = await shallow(<SearchResults {...props} />)

        // then
        const sortCriterionLabel = wrapper.find(SearchResultsList).prop('sortCriterionLabel')
        expect(sortCriterionLabel).toBe('Prix')
      })

      it('should display the sort filter received from url', async () => {
        // given
        fetchAlgolia.mockReturnValueOnce(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA', offer: { dates: [1586248757] } }],
              nbHits: 1,
              nbPages: 0,
              page: 0,
            })
          })
        )
        props.criteria.sortBy = ''
        parse.mockReturnValue({
          tri: '_by_price',
        })

        // when
        const wrapper = await shallow(<SearchResults {...props} />)

        // then
        const sortCriterionLabel = wrapper.find(SearchResultsList).prop('sortCriterionLabel')
        expect(sortCriterionLabel).toBe('Prix')
      })
    })
  })

  describe('when searching', () => {
    it('should trigger search request when keywords have been provided', () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      stubRef(wrapper)
      const form = wrapper.find('form')

      // when
      form.simulate('submit', {
        target: {
          keywords: {
            value: 'un livre très cherché',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      expect(fetchAlgolia).toHaveBeenCalledWith({
        aroundRadius: 100,
        geolocation: { latitude: 40.1, longitude: 41.1 },
        keywords: 'un livre très cherché',
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerTypes: {
          isDigital: false,
          isEvent: false,
          isThing: false,
        },
        page: 0,
        priceRange: [0, 500],
        searchAround: false,
        sortBy: '',
      })
    })

    it('should trigger search request when keywords contains only spaces', () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      stubRef(wrapper)
      wrapper.setState({ searchedKeywords: 'different previous search' })
      const form = wrapper.find('form')

      // when
      form.simulate('submit', {
        target: {
          keywords: {
            value: ' ',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      expect(fetchAlgolia).toHaveBeenNthCalledWith(2, {
        aroundRadius: 100,
        geolocation: { latitude: 40.1, longitude: 41.1 },
        keywords: '',
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerTypes: {
          isDigital: false,
          isEvent: false,
          isThing: false,
        },
        page: 0,
        priceRange: [0, 500],
        searchAround: false,
        sortBy: '',
      })
    })

    it('should trigger search request when no keywords', () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      stubRef(wrapper)
      wrapper.setState({ searchedKeywords: 'different previous search' })
      const form = wrapper.find('form')

      // when
      form.simulate('submit', {
        target: {
          keywords: {
            value: '',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      expect(fetchAlgolia).toHaveBeenCalledWith({
        aroundRadius: 100,
        geolocation: { latitude: 40.1, longitude: 41.1 },
        keywords: '',
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerTypes: {
          isDigital: false,
          isEvent: false,
          isThing: false,
        },
        page: 0,
        priceRange: [0, 500],
        sortBy: '',
        searchAround: false,
      })
    })

    it('should not display results when no results', () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      stubRef(wrapper)
      const form = wrapper.find('form')
      fetchAlgolia.mockReturnValue({
        hits: [],
        page: 0,
        nbHits: 0,
        nbPages: 0,
        hitsPerPage: 2,
        processingTimeMS: 1,
        query: '',
        params: 'hitsPerPage=2',
      })

      // when
      form.simulate('submit', {
        target: {
          keywords: {
            value: '',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      const results = wrapper.find(Result)
      expect(results).toHaveLength(0)
    })

    it('should display results when search succeeded with at least one result', async () => {
      // given
      const offer = { objectID: 'AE', offer: { name: 'Livre de folie' } }
      fetchAlgolia
        .mockReturnValueOnce(
          new Promise(resolve => {
            resolve({
              hits: [],
              page: 0,
              nbHits: 0,
              nbPages: 0,
              hitsPerPage: 2,
              processingTimeMS: 1,
              query: 'librairie',
              params: 'query=\'librairie\'&hitsPerPage=2',
            })
          })
        )
        .mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [offer],
              page: 0,
              nbHits: 1,
              nbPages: 1,
              hitsPerPage: 2,
              processingTimeMS: 1,
              query: 'librairie',
              params: 'query=\'librairie\'&hitsPerPage=2',
            })
          })
        )
      const wrapper = shallow(<SearchResults {...props} />)
      stubRef(wrapper)
      const form = wrapper.find('form')

      // when
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      const results = wrapper.find(SearchResultsList)
      expect(results).toHaveLength(1)
      expect(results.at(0).prop('currentPage')).toStrictEqual(0)
      expect(results.at(0).prop('geolocation')).toStrictEqual({ latitude: 40.1, longitude: 41.1 })
      expect(results.at(0).prop('isLoading')).toStrictEqual(false)
      expect(results.at(0).prop('loadMore')).toStrictEqual(expect.any(Function))
      expect(results.at(0).prop('onSortClick')).toStrictEqual(expect.any(Function))
      expect(results.at(0).prop('results')).toStrictEqual([offer])
      expect(results.at(0).prop('resultsCount')).toStrictEqual(1)
      expect(results.at(0).prop('search')).toStrictEqual('?mots-cles=librairie')
      expect(results.at(0).prop('sortCriterionLabel')).toStrictEqual('Pertinence')
      expect(results.at(0).prop('totalPagesNumber')).toStrictEqual(1)
    })

    it('should clear previous results and page number when searching with new keywords', async () => {
      // given
      const offer1 = { objectID: 'AE', offer: { name: 'Livre de folie' } }
      const offer2 = { objectID: 'AF', offer: { name: 'Livre bien' } }
      const offer3 = { objectID: 'AG', offer: { name: 'Livre nul' } }
      fetchAlgolia.mockReturnValueOnce(
        new Promise(resolve => {
          resolve({
            hits: [offer1, offer2],
            page: 0,
            nbHits: 2,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: 'librairie',
            params: 'query=\'librairie\'&hitsPerPage=2',
          })
        })
      )
      const wrapper = shallow(<SearchResults {...props} />)
      stubRef(wrapper)
      const form = wrapper.find('form')

      // when
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      const resultsFirstFetch = wrapper.find(SearchResultsList).prop('results')
      expect(resultsFirstFetch).toHaveLength(2)

      // when
      fetchAlgolia.mockReturnValueOnce(
        new Promise(resolve => {
          resolve({
            hits: [offer3],
            page: 0,
            nbHits: 1,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: 'vas-y',
            params: 'query="vas-y"&hitsPerPage=2',
          })
        })
      )
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'vas-y',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      const resultSecondFetch = wrapper.find(SearchResultsList)
      expect(resultSecondFetch.prop('results')).toHaveLength(1)
      expect(wrapper.state()).toStrictEqual({
        currentPage: 0,
        filters: {
          aroundRadius: 100,
          date: {
            option: 'today',
            selectedDate: null,
          },
          offerIsFilteredByDate: false,
          offerCategories: [],
          offerIsDuo: false,
          offerIsFree: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          priceRange: [0, 500],
          searchAround: {
            everywhere: true,
            place: false,
            user: false
          },
          sortBy: '',
        },
        keywordsToSearch: 'vas-y',
        isLoading: false,
        numberOfActiveFilters: 0,
        place: {
          geolocation: { latitude: null, longitude: null },
          name: null
        },
        results: [{ objectID: 'AG', offer: { name: 'Livre nul' } }],
        resultsCount: 1,
        searchedKeywords: 'vas-y',
        sortCriterionLabel: 'Pertinence',
        totalPagesNumber: 0,
        userGeolocation: {
          latitude: 40.1,
          longitude: 41.1
        }
      })
    })

    it('should not trigger a second search request when submitting same keywords twice', async () => {
      // given
      const offer1 = { objectID: 'AE', offer: { name: 'Livre de folie de la librairie' } }
      const offer2 = { objectID: 'AF', offer: { name: 'Livre bien de la librairie' } }
      fetchAlgolia.mockReturnValueOnce(
        new Promise(resolve => {
          resolve({
            hits: [offer1, offer2],
            page: 0,
            nbHits: 1,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: 'librairie',
            params: 'query=librairie&hitsPerPage=2',
          })
        })
      )
      const wrapper = shallow(<SearchResults {...props} />)
      stubRef(wrapper)
      const form = wrapper.find('form')

      // when
      await form.simulate('submit', {
        target: {
          keywords: {
            value: '',
          },
        },
        preventDefault: jest.fn(),
      })
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      expect(fetchAlgolia).toHaveBeenCalledTimes(2)
      expect(fetchAlgolia).toHaveBeenNthCalledWith(1, {
        aroundRadius: 100,
        geolocation: { latitude: 40.1, longitude: 41.1 },
        keywords: '',
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerTypes: {
          isDigital: false,
          isEvent: false,
          isThing: false,
        },
        page: 0,
        priceRange: [0, 500],
        searchAround: false,
        sortBy: '',
      })
      expect(fetchAlgolia).toHaveBeenNthCalledWith(2, {
        aroundRadius: 100,
        geolocation: { latitude: 40.1, longitude: 41.1 },
        keywords: 'librairie',
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerTypes: {
          isDigital: false,
          isEvent: false,
          isThing: false,
        },
        page: 0,
        priceRange: [0, 500],
        searchAround: false,
        sortBy: '',
      })
    })

    it('should display an error when search failed', async () => {
      // given
      fetchAlgolia.mockReturnValue(
        new Promise(reject => {
          reject()
        })
      )
      const wrapper = shallow(<SearchResults {...props} />)
      stubRef(wrapper)
      const form = wrapper.find('form')

      // when
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      await toast.info
      expect(toast.info).toHaveBeenCalledWith(
        'La recherche n\'a pas pu aboutir, veuillez ré-essayer plus tard.'
      )
    })

    it('should call replace to display search keywords in url when fetch succeeded', () => {
      // given
      props.query.parse.mockReturnValue({
        'autour-de': 'oui',
        categories: 'VISITE',
        latitude: 40,
        longitude: 2,
        place: 'Paris',
        tri: '_by_price',
      })
      const wrapper = shallow(<SearchResults {...props} />)
      stubRef(wrapper)
      const form = wrapper.find('form')
      fetchAlgolia.mockReturnValue(
        new Promise(resolve => {
          resolve({
            hits: [],
            page: 0,
            nbHits: 0,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: 'librairie',
          })
        })
      )

      // when
      form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      expect(replace).toHaveBeenCalledWith({
        search: '?mots-cles=librairie&autour-de=oui&tri=_by_price&categories=VISITE&latitude=40&longitude=2&place=Paris',
      })
    })

    it('should remove focus from input when the form is submitted', () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      const instance = wrapper.instance()
      stubRef(wrapper)
      const form = wrapper.find('form')
      fetchAlgolia.mockReturnValue({
        hits: [],
        page: 0,
        nbHits: 0,
        nbPages: 0,
        hitsPerPage: 2,
        processingTimeMS: 1,
        query: '',
        params: 'hitsPerPage=2',
      })

      // when
      form.simulate('submit', {
        target: {
          keywords: {
            value: '',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      expect(instance.inputRef.current.blur).toHaveBeenCalledWith()
    })

    it('should remove focus from input when scrolling the results', () => {
      // given
      const history = createBrowserHistory()
      history.push('/recherche/resultats')
      const wrapper = mount(
        <Router history={history}>
          <SearchResults {...props} />
        </Router>
      )
      wrapper.setState({ isLoading: true })
      const searchResultsWrapper = wrapper.find(SearchResults)
      const input = searchResultsWrapper.instance().inputRef.current
      jest.spyOn(input, 'blur').mockImplementationOnce()

      const searchResults = wrapper.find({ children: 'Recherche en cours' })

      // when
      searchResults.simulate('scroll')

      // then
      expect(input.blur).toHaveBeenCalledTimes(1)
    })

    it('should fetch algolia with date filter when enabled', async () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      stubRef(wrapper)
      const selectedDate = new Date(2020, 3, 21)
      wrapper.setState({
        filters: {
          ...wrapper.state('filters'),
          date: {
            option: 'today',
            selectedDate,
          },
          offerIsFilteredByDate: true,
        },
      })

      // when
      const form = wrapper.find('form')
      form.simulate('submit', {
        preventDefault: jest.fn(),
        target: { keywords: { value: 'nouvelle recherche' } },
      })

      // then
      expect(fetchAlgolia).toHaveBeenCalledTimes(2)
      expect(fetchAlgolia).toHaveBeenNthCalledWith(2, {
        aroundRadius: 100,
        date: {
          option: 'today',
          selectedDate,
        },
        geolocation: {
          latitude: 40.1,
          longitude: 41.1,
        },
        keywords: 'nouvelle recherche',
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerTypes: {
          isDigital: false,
          isEvent: false,
          isThing: false,
        },
        page: 0,
        priceRange: [0, 500],
        searchAround: false,
        sortBy: '',
      })
    })

    describe('reset cross', () => {
      it('should not display reset cross when nothing is typed in text input', () => {
        // when
        const wrapper = shallow(<SearchResults {...props} />)

        // then
        const resetButton = wrapper.find('button[type="reset"]')
        expect(resetButton).toHaveLength(0)
      })

      it('should display reset cross when something is typed in text input', () => {
        // given
        const wrapper = shallow(<SearchResults {...props} />)
        const form = wrapper.find('form')
        const input = form.find('input')

        // when
        input.simulate('change', {
          target: {
            name: 'keywords',
            value: 'typed search',
          },
          preventDefault: jest.fn(),
        })

        // then
        const resetButton = wrapper.find('button[type="reset"]')
        expect(resetButton).toHaveLength(1)
      })

      it('should clear text input when clicking on reset cross', () => {
        // given
        const history = createMemoryHistory()
        history.push('/recherche/resultats?mots-cles=librairie&page=2')
        const wrapper = mount(
          <Router history={history}>
            <SearchResults {...props} />
          </Router>
        )
        const form = wrapper.find('form')
        const input = form.find('input').first()
        input.simulate('change', {
          target: {
            name: 'keywords',
            value: 'typed search',
          },
        })
        const resetButton = wrapper.find('button[type="reset"]')

        // when
        resetButton.simulate('click')

        // then
        const expectedMissingResetButton = wrapper.find('button[type="reset"]')
        const resetInput = form.find('input').first()
        expect(expectedMissingResetButton).toHaveLength(0)
        expect(resetInput.prop('value')).toBe('')
      })
    })
  })

  describe('when navigating', () => {
    let history
    let store
    const buildStore = configureStore([thunk])

    beforeEach(() => {
      history = createMemoryHistory()
      store = buildStore(state)
    })

    it('should render search main page when current route is /recherche/resultats', () => {
      // given
      history.push('/recherche/resultats')

      // when
      const wrapper = mount(
        <Router history={history}>
          <Provider store={store}>
            <SearchResults {...props} />
          </Provider>
        </Router>
      )

      // then
      const form = wrapper.find('form')
      const searchDetails = wrapper.find(SearchAlgoliaDetailsContainer)
      expect(form).toHaveLength(1)
      expect(searchDetails).toHaveLength(0)
    })

    it('should render item details when current route is /recherche/resultats/details/AE', () => {
      // given
      history.push('/recherche/resultats/details/AE')

      // when
      const wrapper = mount(
        <Router history={history}>
          <Provider store={store}>
            <SearchResults {...props} />
          </Provider>
        </Router>
      )

      // then
      const form = wrapper.find('form')
      const searchDetails = wrapper.find(SearchAlgoliaDetailsContainer)
      expect(searchDetails).toHaveLength(1)
      expect(form).toHaveLength(0)
    })

    it('should render filters page when current route is /recherche/resultats/filtres', () => {
      // given
      history.push('/recherche/resultats/filtres')
      props.query.parse.mockReturnValue({
        categories: 'VISITE;CINEMA',
        'mots-cles': 'librairie',
        tri: '_by_price',
      })

      // when
      const wrapper = mount(
        <Router history={history}>
          <Provider store={store}>
            <SearchResults {...props} />
          </Provider>
        </Router>
      )

      // then
      const filters = wrapper.find(Filters)
      expect(filters).toHaveLength(1)
      expect(filters.prop('history')).toStrictEqual(props.history)
      expect(filters.prop('initialFilters')).toStrictEqual({
        aroundRadius: 100,
        date: {
          option: 'today',
          selectedDate: null,
        },
        offerIsFilteredByDate: false,
        offerCategories: ['VISITE', 'CINEMA'],
        offerIsDuo: false,
        offerIsFree: false,
        offerTypes: {
          isDigital: false,
          isEvent: false,
          isThing: false,
        },
        priceRange: [0, 500],
        searchAround: {
          everywhere: true,
          place: false,
          user: false
        },
        sortBy: '_by_price',
      })
      expect(filters.prop('match')).toStrictEqual(props.match)
      expect(filters.prop('offers')).toStrictEqual({ hits: [], nbHits: 0, nbPages: 0 })
      expect(filters.prop('place')).toStrictEqual(props.place)
      expect(filters.prop('query')).toStrictEqual(props.query)
      expect(filters.prop('showFailModal')).toStrictEqual(expect.any(Function))
      expect(filters.prop('updateFilteredOffers')).toStrictEqual(expect.any(Function))
      expect(filters.prop('updateFilters')).toStrictEqual(expect.any(Function))
      expect(filters.prop('updateNumberOfActiveFilters')).toStrictEqual(expect.any(Function))
      expect(filters.prop('updatePlace')).toStrictEqual(expect.any(Function))
      expect(filters.prop('userGeolocation')).toStrictEqual(props.userGeolocation)
    })

    it('should render sort page when current route is /recherche/resultats/tri', () => {
      // given
      history.push('/recherche/resultats/tri')
      props.query.parse.mockReturnValue({
        categories: 'VISITE;CINEMA',
        'mots-cles': 'librairie',
        tri: '_by_price',
      })

      // when
      const wrapper = mount(
        <Router history={history}>
          <Provider store={store}>
            <SearchResults {...props} />
          </Provider>
        </Router>
      )

      // then
      const sortPage = wrapper.find(CriteriaSort)
      expect(sortPage).toHaveLength(1)
      expect(sortPage.prop('activeCriterionLabel')).toStrictEqual('Prix')
      expect(sortPage.prop('backTo')).toStrictEqual('/recherche/resultats?mots-cles=librairie')
      expect(sortPage.prop('criteria')).toStrictEqual(SORT_CRITERIA)
      expect(sortPage.prop('geolocation')).toStrictEqual(props.userGeolocation)
      expect(sortPage.prop('history')).toStrictEqual(props.history)
      expect(sortPage.prop('match')).toStrictEqual(props.match)
      expect(sortPage.prop('onCriterionSelection')).toStrictEqual(expect.any(Function))
      expect(sortPage.prop('title')).toStrictEqual('Trier par')
    })

    describe('come back icon', () => {
      it('should render an icon to come back to search main page when a research has been made', () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [],
              nbHits: 0,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'mots-cles': 'une librairie',
        })

        // when
        const wrapper = shallow(<SearchResults {...props} />)

        // then
        const form = wrapper.find('form')
        const backIcon = form.findWhere(node => node.prop('svg') === 'picto-back-grey').first()
        expect(backIcon).toHaveLength(1)
      })

      it('should reset text input when clicking on come back arrow', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [],
              nbHits: 0,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'mots-cles': 'une librairie',
        })
        const redirectToSearchMainPage = jest.fn()

        // when
        const wrapper = await shallow(
          <SearchResults
            {...props}
            redirectToSearchMainPage={redirectToSearchMainPage}
          />
        )

        const form = wrapper.find('form')
        const backButton = form.findWhere(node => node.prop('type') === 'button').first()
        expect(wrapper.state('keywordsToSearch')).toBe('une librairie')
        backButton.simulate('click')

        // then
        expect(redirectToSearchMainPage).toHaveBeenCalledTimes(1)
        expect(wrapper.state('keywordsToSearch')).toBe('')
      })
    })

    describe('header', () => {
      it('should not render header when search has been made', () => {
        // given
        history.push('/recherche/resultats?mots-cles=librairie&page=1')
        const offer1 = { objectID: 'AE', offer: { name: 'Livre de folie de la librairie' } }
        const offer2 = { objectID: 'AY', offer: { name: 'Livre bien de la librairie' } }
        fetchAlgolia.mockReturnValueOnce(
          new Promise(resolve => {
            resolve({
              hits: [offer1, offer2],
              page: 0,
              nbHits: 1,
              nbPages: 0,
              hitsPerPage: 2,
              processingTimeMS: 1,
              query: 'librairie',
              params: 'query=librairie&hitsPerPage=2',
            })
          })
        )
        const wrapper = mount(
          <Router history={history}>
            <SearchResults {...props} />
          </Router>
        )
        const form = wrapper.find('form')

        // when
        form.simulate('submit', {
          target: {
            keywords: {
              value: 'librairie',
            },
          },
          preventDefault: jest.fn(),
        })
        wrapper.update()

        // then
        const header = wrapper.find(HeaderContainer)
        expect(header).toHaveLength(0)
      })

      it('should render header when on details page', () => {
        // given
        history.push('/recherche/resultats/details/AE?mots-cles=librairie&page=1')

        // when
        const wrapper = mount(
          <Router history={history}>
            <Provider store={store}>
              <SearchResults {...props} />
            </Provider>
          </Router>
        )

        // then
        const header = wrapper.find(HeaderContainer)
        expect(header).toHaveLength(1)
      })
    })
  })

  describe('when filtering', () => {
    it('should redirect to filters page', () => {
      // given
      const history = createBrowserHistory()
      history.push('/recherche/resultats?mots-cles=librairie')
      props.history = history
      const initialState = {
        geolocation: {
          latitude: 40.1,
          longitude: 41.1,
        },
      }
      const store = configureStore([])(initialState)
      const wrapper = mount(
        <Provider store={store}>
          <Router history={history}>
            <SearchResults {...props} />
          </Router>
        </Provider>
      )
      const filterButton = wrapper.find({ children: 'Filtrer' })

      // when
      filterButton.simulate('click')

      // then
      const expectedUrl = history.location.pathname + history.location.search
      expect(expectedUrl).toBe('/recherche/resultats/filtres?mots-cles=librairie')
    })

    it('should redirect to sort page when clicking on sort button', async () => {
      // given
      fetchAlgolia.mockReturnValue(
        new Promise(resolve => {
          resolve({
            hits: [{ objectID: 'AA', offer: { dates: [1586248757] } }],
            nbHits: 1,
            nbPages: 0,
            page: 0,
          })
        })
      )
      const history = createBrowserHistory()
      history.push('/recherche/resultats?mots-cles=librairie')
      props.history = history
      const store = configureStore([])({})
      const wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <SearchResults {...props} />
          </Router>
        </Provider>
      )
      wrapper.update()
      const sortButton = wrapper.find({ children: 'Pertinence' })

      // when
      await sortButton.simulate('click')

      // then
      const expectedUrl = history.location.pathname + history.location.search
      expect(expectedUrl).toBe('/recherche/resultats/tri?mots-cles=librairie')
    })

    it('should change sort button name after sort criterion selection', async () => {
      // given
      fetchAlgolia.mockReturnValue(
        new Promise(resolve => {
          resolve({
            hits: [{ objectID: 'AA', offer: { dates: [1586248757] } }],
            nbHits: 1,
            nbPages: 0,
            page: 0,
          })
        })
      )
      const history = createBrowserHistory()
      history.push('/recherche/resultats/tri?mots-cles=librairie&tri=_by_price')
      props.history = history
      const store = configureStore([])({})
      const wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <SearchResults {...props} />
          </Router>
        </Provider>
      )

      // when
      const byProximityButton = wrapper.find({ children: 'Proximité' })
      await byProximityButton.simulate('click')
      wrapper.update()

      // then
      const expectedUri = history.location.pathname + history.location.search
      expect(expectedUri).toBe('/recherche/resultats?mots-cles=librairie&tri=_by_proximity')
      const sortButton = wrapper.find({ children: 'Proximité' })
      expect(sortButton).toHaveLength(1)
    })

    it('should fetch new results on sort criterion selection', () => {
      // given
      const history = createBrowserHistory()
      history.push('/recherche/resultats/tri?mots-cles=&tri=_by_price')
      props.history = history
      const store = configureStore([])({})
      const wrapper = mount(
        <Provider store={store}>
          <Router history={history}>
            <SearchResults {...props} />
          </Router>
        </Provider>
      )

      // when
      const byProximityButton = wrapper.find({ children: 'Proximité' })
      byProximityButton.simulate('click')

      // then
      expect(fetchAlgolia).toHaveBeenCalledTimes(2)
      expect(fetchAlgolia).toHaveBeenNthCalledWith(2, {
        aroundRadius: 100,
        geolocation: { latitude: 40.1, longitude: 41.1 },
        keywords: '',
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerTypes: {
          isDigital: false,
          isEvent: false,
          isThing: false,
        },
        page: 0,
        priceRange: [0, 500],
        searchAround: false,
        sortBy: '_by_proximity',
      })
    })

    it('should replace and not merge results with new ones on sort criterion selection', async () => {
      // given
      const history = createBrowserHistory()
      fetchAlgolia
        .mockReturnValueOnce(
          new Promise(resolve => {
            resolve({
              hits: [
                { objectID: 'AA', offer: { dates: [1586248757] } },
                {
                  objectID: 'BB',
                  offer: { dates: [1586248757] },
                },
              ],
              nbHits: 1,
              nbPages: 0,
              page: 0,
            })
          })
        )
        .mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [
                { objectID: 'BB', offer: { dates: [1586248757] } },
                {
                  objectID: 'AA',
                  offer: { dates: [1586248757] },
                },
              ],
              nbHits: 1,
              nbPages: 0,
              page: 0,
            })
          })
        )
      history.push('/recherche/resultats/tri?mots-cles=&tri=_by_price')
      props.history = history
      const store = configureStore([])({})
      const wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <SearchResults {...props} />
          </Router>
        </Provider>
      )

      // when
      const byProximityButton = wrapper.find({ children: 'Proximité' })
      await byProximityButton.simulate('click')

      // then
      wrapper.update()
      const results = wrapper.find(Result)
      expect(results).toHaveLength(2)
    })
  })
})
