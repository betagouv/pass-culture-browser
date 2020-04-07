import { mount, shallow } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import { Router } from 'react-router'
import { fetchAlgolia } from '../../../../../vendor/algolia/algolia'
import HeaderContainer from '../../../../layout/Header/HeaderContainer'
import { Criteria } from '../../Criteria/Criteria'
import { GEOLOCATION_CRITERIA } from '../../Criteria/criteriaEnums'
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox'
import { Filters } from '../Filters'
import Slider from 'rc-slider'
import FilterToggle from '../FilterToggle/FilterToggle'

jest.mock('../../../../../vendor/algolia/algolia', () => ({
  fetchAlgolia: jest.fn(),
}))
describe('components | Filters', () => {
  let props

  beforeEach(() => {
    props = {
      geolocation: {
        latitude: 40,
        longitude: 41,
      },
      history: {
        location: {
          pathname: '',
          search: '',
        },
        listen: jest.fn(),
        push: jest.fn(),
        replace: jest.fn(),
      },
      initialFilters: {
        aroundRadius: 0,
        isSearchAroundMe: false,
        offerCategories: ['VISITE', 'CINEMA'],
        offerDuo: false,
        offerTypes: {
          isDigital: false,
          isEvent: false,
          isThing: false,
        },
        sortBy: '_by_price',
      },
      isGeolocationEnabled: false,
      isUserAllowedToSelectCriterion: jest.fn(),
      match: {
        params: {},
      },
      offers: {
        hits: [],
        nbHits: 0,
        nbPages: 0,
      },
      query: {
        parse: jest.fn(),
      },
      redirectToSearchFiltersPage: jest.fn(),
      showFailModal: jest.fn(),
      updateFilters: jest.fn(),
      updateFilteredOffers: jest.fn(),
    }
  })

  describe('render', () => {
    describe('localisation filter page', () => {
      it('should render localisation filter page when on route /recherche-offres/filtres/localisation', () => {
        // given
        props.history.location.pathname = '/recherche-offres/resultats/filtres/localisation'
        props.history.location.search = '?mots-cles=librairie'

        // when
        const wrapper = shallow(<Filters {...props} />)

        // then
        const criteria = wrapper.find(Criteria)
        expect(criteria).toHaveLength(1)
        expect(criteria.prop('backTo')).toStrictEqual(
          '/recherche-offres/resultats/filtres?mots-cles=librairie'
        )
        expect(criteria.prop('criteria')).toStrictEqual(GEOLOCATION_CRITERIA)
        expect(criteria.prop('history')).toStrictEqual(props.history)
        expect(criteria.prop('match')).toStrictEqual(props.match)
        expect(criteria.prop('onCriterionSelection')).toStrictEqual(expect.any(Function))
        expect(criteria.prop('title')).toStrictEqual('Localisation')
      })

      it('should render a Criteria component with a "Partout" criterion when not searching around me', () => {
        // given
        props.history.location.pathname = '/recherche-offres/resultats/filtres/localisation'
        props.initialFilters.isSearchAroundMe = false

        // when
        const wrapper = shallow(<Filters {...props} />)

        // then
        const criteria = wrapper.find(Criteria)
        expect(criteria.prop('activeCriterionLabel')).toStrictEqual('Partout')
      })

      describe('when clicking on "Partout"', () => {
        it('should trigger search and redirect to filters page when clicking on "Partout" criterion', () => {
          // given
          props.history = createBrowserHistory()
          jest.spyOn(props.history, 'replace').mockImplementationOnce(() => {})
          props.history.location.pathname = '/recherche-offres/resultats/filtres/localisation'
          props.isUserAllowedToSelectCriterion.mockReturnValue(true)
          props.query.parse.mockReturnValue({
            'autour-de-moi': 'non',
            categories: 'VISITE;CINEMA',
            'mots-cles': 'librairie',
            tri: '_by_price',
          })
          fetchAlgolia.mockReturnValue(
            new Promise(resolve => {
              resolve({
                hits: [],
                nbHits: 0,
                page: 0,
              })
            })
          )
          const wrapper = mount(
            <Router history={props.history}>
              <Filters {...props} />
            </Router>
          )
          const everywhereButton = wrapper
            .find(Criteria)
            .find('button')
            .first()

          // when
          everywhereButton.simulate('click')

          // then
          expect(fetchAlgolia).toHaveBeenCalledWith({
            keywords: 'librairie',
            offerCategories: ['VISITE', 'CINEMA'],
            offerDuo: false,
            offerTypes: {
              isDigital: false,
              isEvent: false,
              isThing: false,
            },
            sortBy: '_by_price',
          })
          expect(props.redirectToSearchFiltersPage).toHaveBeenCalledWith()
          expect(props.history.replace).toHaveBeenCalledWith({
            search: '?mots-cles=librairie&autour-de-moi=non&tri=_by_price&categories=VISITE;CINEMA',
          })
        })
      })

      describe('when clicking on "Autour de moi"', () => {
        it('should trigger search and redirect to filters page when clicking on "Autour de moi" criterion', () => {
          // given
          props.history = createBrowserHistory()
          jest.spyOn(props.history, 'replace').mockImplementationOnce(() => {})
          props.history.location.pathname = '/recherche-offres/resultats/filtres/localisation'
          props.initialFilters = {
            aroundRadius: 50,
            isSearchAroundMe: false,
            offerCategories: ['VISITE'],
            offerDuo: false,
            offerTypes: {
              isDigital: false,
              isEvent: false,
              isThing: false,
            },
            sortBy: '_by_price',
          }
          props.isUserAllowedToSelectCriterion.mockReturnValue(true)
          props.query.parse.mockReturnValue({
            'autour-de-moi': 'oui',
            categories: 'VISITE',
            'mots-cles': 'librairie',
            tri: '_by_price',
          })
          fetchAlgolia.mockReturnValue(
            new Promise(resolve => {
              resolve({
                hits: [],
                nbHits: 0,
                page: 0,
              })
            })
          )
          const wrapper = mount(
            <Router history={props.history}>
              <Filters {...props} />
            </Router>
          )
          const aroundMeButton = wrapper
            .find(Criteria)
            .find('button')
            .at(1)

          // when
          aroundMeButton.simulate('click')

          // then
          expect(fetchAlgolia).toHaveBeenCalledWith({
            aroundRadius: 50,
            geolocation: { latitude: 40, longitude: 41 },
            keywords: 'librairie',
            offerCategories: ['VISITE'],
            offerDuo: false,
            offerTypes: {
              isDigital: false,
              isEvent: false,
              isThing: false,
            },
            sortBy: '_by_price',
          })
          expect(props.redirectToSearchFiltersPage).toHaveBeenCalledWith()
          expect(props.history.replace).toHaveBeenCalledWith({
            search: '?mots-cles=librairie&autour-de-moi=oui&tri=_by_price&categories=VISITE',
          })
        })
      })
    })

    describe('filters page', () => {
      it('should render a Header component with the right props', () => {
        // given
        props.history.location.pathname = '/recherche-offres/filtres'
        props.history.location.search = '?mots-cles=librairie'

        // when
        const wrapper = shallow(<Filters {...props} />)

        // then
        const header = wrapper.find(HeaderContainer)
        expect(header).toHaveLength(1)
        expect(header.prop('backTo')).toStrictEqual(
          '/recherche-offres/resultats?mots-cles=librairie'
        )
        expect(header.prop('closeTo')).toBeNull()
        expect(header.prop('reset')).toStrictEqual(expect.any(Function))
        expect(header.prop('title')).toStrictEqual('Filtrer')
      })

      it('should display the number of results on the display results button', () => {
        // given
        props.history.location.pathname = '/recherche-offres/filtres'
        props.offers.nbHits = 10

        // when
        const wrapper = shallow(<Filters {...props} />)

        // then
        const numberOfResults = wrapper
          .findWhere(node => node.text() === 'Afficher les 10 résultats')
          .first()
        expect(numberOfResults).toHaveLength(1)
      })

      it('should display "999+" on the display results button when number of results exceeds 999', () => {
        // given
        props.history.location.pathname = '/recherche-offres/filtres'
        props.offers.nbHits = 1000

        // when
        const wrapper = shallow(<Filters {...props} />)

        // then
        const numberOfResults = wrapper
          .findWhere(node => node.text() === 'Afficher les 999+ résultats')
          .first()
        expect(numberOfResults).toHaveLength(1)
      })

      it('should filter offers when clicking on display results button', () => {
        // given
        props.history.location.pathname = '/recherche-offres/filtres'
        props.offers.nbHits = 1000
        const wrapper = shallow(<Filters {...props} />)
        const resultsButton = wrapper.find('.sf-button')

        // when
        resultsButton.simulate('click')

        // then
        expect(props.updateFilteredOffers).toHaveBeenCalledWith({
          hits: [],
          nbHits: 1000,
          nbPages: 0,
        })
      })

      it('should redirect to results page with query param when clicking on display results button', () => {
        // given
        props.history.location.pathname = '/recherche-offres/filtres'
        props.history.location.search = '?mots-cles=librairie'
        const wrapper = shallow(<Filters {...props} />)
        const resultsButton = wrapper.find('.sf-button')

        // when
        resultsButton.simulate('click')

        // then
        expect(props.history.push).toHaveBeenCalledWith(
          '/recherche-offres/resultats?mots-cles=librairie'
        )
      })

      it('should redirect to results page with no query param when clicking on display results button', () => {
        // given
        props.history.location.pathname = '/recherche-offres/filtres'
        const wrapper = shallow(<Filters {...props} />)
        const resultsButton = wrapper.find('.sf-button')

        // when
        resultsButton.simulate('click')

        // then
        expect(props.history.push).toHaveBeenCalledWith('/recherche-offres/resultats')
      })

      it('should update filters when clicking on display results button', () => {
        // given
        props.history.location.pathname = '/recherche-offres/filtres'
        const wrapper = shallow(<Filters {...props} />)
        const resultsButton = wrapper.find('.sf-button')

        // when
        resultsButton.simulate('click')

        // then
        expect(props.updateFilters).toHaveBeenCalledWith({
          aroundRadius: 0,
          isSearchAroundMe: false,
          offerCategories: ['VISITE', 'CINEMA'],
          offerDuo: false,
          offerTypes: {
            isDigital: false,
            isEvent: false,
            isThing: false,
          },
          sortBy: '_by_price',
        })
      })

      describe('geolocation filter', () => {
        it('should display a "Localisation" title for geolocation filter', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const title = wrapper.findWhere(node => node.text() === 'Localisation').first()
          expect(title).toHaveLength(1)
        })

        it('should display a "Partout" for geolocation filter when initial filter is "Partout"', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.isSearchAroundMe = false

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const button = wrapper.findWhere(node => node.text() === 'Partout').first()
          expect(button).toHaveLength(1)
        })

        it('should display a "Autour de moi" for geolocation filter when initial filter is "Autour de moi"', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.isSearchAroundMe = true

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const button = wrapper.findWhere(node => node.text() === 'Autour de moi').first()
          expect(button).toHaveLength(1)
        })

        it('should redirect to localisation filter page with given query params when clicking on geolocation filter button', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.history.location.search = '?mots-cles=librairie'
          props.initialFilters.isSearchAroundMe = true
          const wrapper = shallow(<Filters {...props} />)
          const button = wrapper.findWhere(node => node.text() === 'Autour de moi').first()

          // when
          button.simulate('click')

          // then
          expect(props.history.push).toHaveBeenCalledWith(
            '/recherche-offres/resultats/filtres/localisation?mots-cles=librairie'
          )
        })

        it('should redirect to localisation filter page with no query params when clicking on geolocation filter button', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.isSearchAroundMe = true
          const wrapper = shallow(<Filters {...props} />)
          const button = wrapper.findWhere(node => node.text() === 'Autour de moi').first()

          // when
          button.simulate('click')

          // then
          expect(props.history.push).toHaveBeenCalledWith(
            '/recherche-offres/resultats/filtres/localisation'
          )
        })
      })

      describe('radius filter', () => {
        describe('when geolocation filter is "Partout"', () => {
          it('should not display a "Rayon" title', () => {
            // given
            props.history.location.pathname = '/recherche-offres/filtres'
            props.initialFilters.isSearchAroundMe = false

            // when
            const wrapper = shallow(<Filters {...props} />)

            // then
            const title = wrapper.findWhere(node => node.text() === 'Rayon').first()
            expect(title).toHaveLength(0)
          })

          it('should not display the kilometers radius value', () => {
            // given
            props.history.location.pathname = '/recherche-offres/filtres'
            props.initialFilters.aroundRadius = 0
            props.initialFilters.isSearchAroundMe = false

            // when
            const wrapper = shallow(<Filters {...props} />)

            // then
            const kilometersRadius = wrapper.findWhere(node => node.text() === '0 km').first()
            expect(kilometersRadius).toHaveLength(0)
          })

          it('should not render a Slider component', () => {
            // given
            props.history.location.pathname = '/recherche-offres/filtres'
            props.initialFilters.isSearchAroundMe = false

            // when
            const wrapper = shallow(<Filters {...props} />)

            // then
            const slider = wrapper.find(Slider)
            expect(slider).toHaveLength(0)
          })
        })

        //radiusRevert: added .skip to describe below and disabled eslint
        // eslint-disable-next-line jest/no-disabled-tests
        describe.skip('when geolocation filter is "Autour de moi"', () => {
          it('should display a "Rayon" title', () => {
            // given
            props.history.location.pathname = '/recherche-offres/filtres'
            props.initialFilters.isSearchAroundMe = true

            // when
            const wrapper = shallow(<Filters {...props} />)

            // then
            const title = wrapper.findWhere(node => node.text() === 'Rayon').first()
            expect(title).toHaveLength(1)
          })

          it('should display the kilometers radius value', () => {
            // given
            props.history.location.pathname = '/recherche-offres/filtres'
            props.initialFilters.aroundRadius = 50
            props.initialFilters.isSearchAroundMe = true

            // when
            const wrapper = shallow(<Filters {...props} />)

            // then
            const kilometersRadius = wrapper.findWhere(node => node.text() === '50 km').first()
            expect(kilometersRadius).toHaveLength(1)
          })

          it('should render a Slider component', () => {
            // given
            props.history.location.pathname = '/recherche-offres/filtres'
            props.initialFilters.aroundRadius = 20
            props.initialFilters.isSearchAroundMe = true

            // when
            const wrapper = shallow(<Filters {...props} />)

            // then
            const slider = wrapper.find(Slider)
            expect(slider).toHaveLength(1)
            expect(slider.prop('max')).toStrictEqual(100)
            expect(slider.prop('min')).toStrictEqual(0)
            expect(slider.prop('onChange')).toStrictEqual(expect.any(Function))
            expect(slider.prop('onAfterChange')).toStrictEqual(expect.any(Function))
            expect(slider.prop('value')).toStrictEqual(20)
          })
        })
      })

      describe('offer type', () => {
        it('should display a "Type d\'offres" title for offer types filter', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const title = wrapper.findWhere(node => node.text() === "Type d'offres").first()
          expect(title).toHaveLength(1)
        })

        it('should render three FilterCheckbox components unchecked by default', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerTypes = {
            isDigital: false,
            isEvent: false,
            isThing: false,
          }

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const filterCheckboxes = wrapper
            .find('[data-test="sf-offer-types-filter-wrapper"]')
            .find(FilterCheckbox)
          expect(filterCheckboxes).toHaveLength(3)
          expect(filterCheckboxes.at(0).prop('checked')).toBe(false)
          expect(filterCheckboxes.at(0).prop('className')).toBe('fc-label')
          expect(filterCheckboxes.at(0).prop('id')).toBe('isDigital')
          expect(filterCheckboxes.at(0).prop('label')).toBe('Offres numériques')
          expect(filterCheckboxes.at(0).prop('name')).toBe('isDigital')
          expect(filterCheckboxes.at(0).prop('onChange')).toStrictEqual(expect.any(Function))
          expect(filterCheckboxes.at(1).prop('checked')).toBe(false)
          expect(filterCheckboxes.at(1).prop('className')).toBe('fc-label')
          expect(filterCheckboxes.at(1).prop('id')).toBe('isThing')
          expect(filterCheckboxes.at(1).prop('label')).toBe('Offres physiques')
          expect(filterCheckboxes.at(1).prop('name')).toBe('isThing')
          expect(filterCheckboxes.at(1).prop('onChange')).toStrictEqual(expect.any(Function))
          expect(filterCheckboxes.at(2).prop('checked')).toBe(false)
          expect(filterCheckboxes.at(2).prop('className')).toBe('fc-label')
          expect(filterCheckboxes.at(2).prop('id')).toBe('isEvent')
          expect(filterCheckboxes.at(2).prop('label')).toBe('Sorties')
          expect(filterCheckboxes.at(2).prop('name')).toBe('isEvent')
          expect(filterCheckboxes.at(2).prop('onChange')).toStrictEqual(expect.any(Function))
        })

        it('should render three FilterCheckbox components checked when offer types are checked', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerTypes = {
            isDigital: true,
            isEvent: true,
            isThing: true,
          }

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const filterCheckboxes = wrapper
            .find('[data-test="sf-offer-types-filter-wrapper"]')
            .find(FilterCheckbox)
          expect(filterCheckboxes.at(0).prop('checked')).toBe(true)
          expect(filterCheckboxes.at(0).prop('className')).toBe('fc-label-checked')
          expect(filterCheckboxes.at(1).prop('checked')).toBe(true)
          expect(filterCheckboxes.at(1).prop('className')).toBe('fc-label-checked')
          expect(filterCheckboxes.at(2).prop('checked')).toBe(true)
          expect(filterCheckboxes.at(2).prop('className')).toBe('fc-label-checked')
        })

        it('should display the number of offer types selected when checked', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerTypes = {
            isDigital: true,
            isEvent: true,
            isThing: true,
          }

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const numberOfOfferTypesSelected = wrapper
            .findWhere(node => node.text() === '(3)')
            .first()
          expect(numberOfOfferTypesSelected).toHaveLength(1)
        })

        it('should not display the number of offer types selected when not checked', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerTypes = {
            isDigital: false,
            isEvent: false,
            isThing: false,
          }

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const numberOfOfferTypesSelected = wrapper
            .findWhere(node => node.text() === '(3)')
            .first()
          expect(numberOfOfferTypesSelected).toHaveLength(0)
        })

        it('should fetch offers when clicking on digital offer type', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          const wrapper = shallow(<Filters {...props} />)
          const digitalFilter = wrapper
            .find('[data-test="sf-offer-types-filter-wrapper"]')
            .find(FilterCheckbox)
            .at(0)
          props.query.parse.mockReturnValue({
            'mots-cles': 'librairies',
          })
          fetchAlgolia.mockReturnValue(
            new Promise(resolve => {
              resolve({
                hits: [],
                nbHits: 0,
                page: 0,
              })
            })
          )

          // when
          digitalFilter.simulate('change', {
            target: {
              name: 'isDigital',
              checked: true,
            },
          })

          // then
          expect(fetchAlgolia).toHaveBeenCalledWith({
            keywords: 'librairies',
            offerCategories: ['VISITE', 'CINEMA'],
            offerDuo: false,
            offerTypes: {
              isDigital: true,
              isEvent: false,
              isThing: false,
            },
            sortBy: '_by_price',
          })
        })
      })

      describe('offer duo', () => {
        it('should display a "Uniquement les offres duo" title for offer duo filter', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const title = wrapper.findWhere(node => node.text() === "Uniquement les offres duo").first()
          expect(title).toHaveLength(1)
        })

        it('should render a FilterToggle component unchecked by default', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerDuo = false

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const filterOfferDuo = wrapper
            .find('[data-test="sf-offer-duo-wrapper-test"]')
            .find(FilterToggle)
          expect(filterOfferDuo).toHaveLength(1)
          expect(filterOfferDuo.prop('checked')).toBe(false)
          expect(filterOfferDuo.prop('id')).toBe('offerDuo')
          expect(filterOfferDuo.prop('name')).toBe('offerDuo')
          expect(filterOfferDuo.prop('onChange')).toStrictEqual(expect.any(Function))
        })

        it('should fetch offers when clicking on offer duo', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          const wrapper = shallow(<Filters {...props} />)
          const offerDuoFilter = wrapper
            .find('[data-test="sf-offer-duo-wrapper-test"]')
            .find(FilterToggle)
          props.query.parse.mockReturnValue({})
          fetchAlgolia.mockReturnValue(
            new Promise(resolve => {
              resolve({
                hits: [],
                nbHits: 0,
                page: 0,
              })
            })
          )

          // when
          offerDuoFilter.simulate('change', {
            target: {
              name: 'offerDuo',
              checked: true,
            },
          })

          // then
          expect(fetchAlgolia).toHaveBeenCalledWith({
            keywords: '',
            offerCategories: ['VISITE', 'CINEMA'],
            offerDuo: true,
            offerTypes: {
              isDigital: false,
              isEvent: false,
              isThing: false,
            },
            sortBy: '_by_price',
          })
        })
      })

      describe('offer categories', () => {
        it('should display an accessible "Catégories" title button', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const categoriesTitle = wrapper.find({ children: 'Catégories' })
          const categoriesTitleButton = wrapper.find('button[aria-label="Afficher les catégories"]')
          expect(categoriesTitle).toHaveLength(1)
          expect(categoriesTitleButton.prop('aria-label')).toBe('Afficher les catégories')
          expect(categoriesTitleButton.prop('aria-pressed')).toBe(true)
        })

        it('should not render FilterCheckbox component when categories filter toggled hidden', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerCategories = []
          const wrapper = shallow(<Filters {...props} />)
          const categoriesButton = wrapper.findWhere(node => node.text() === 'Catégories').first()
          const categoriesWrapper = wrapper.find('[data-test="sf-categories-filter-wrapper"]')
          const filterCheckboxBeforeClick = categoriesWrapper.find(FilterCheckbox)
          const categoriesButtonClassNameBeforeClick = categoriesButton.prop('className')

          // when
          categoriesButton.simulate('click')

          // then
          const categoriesWrapperAfterClick = wrapper.find(
            '[data-test="sf-categories-filter-wrapper"]'
          )
          const filterCheckboxAfterClick = categoriesWrapperAfterClick.find(FilterCheckbox)
          expect(filterCheckboxBeforeClick).toHaveLength(11)
          expect(filterCheckboxAfterClick).toHaveLength(0)

          const categoriesButtonAfterClick = wrapper
            .findWhere(node => node.text() === 'Catégories')
            .at(1)
          expect(categoriesButtonClassNameBeforeClick).toBe(
            'sf-category-title-wrapper sf-title-drop-down'
          )
          expect(categoriesButtonAfterClick.prop('className')).toBe(
            'sf-category-title-wrapper sf-title-drop-down-flipped'
          )
        })

        it('should render one unchecked FilterCheckbox component for each Category Criteria when no category is selected', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerCategories = []

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const cinemaFilterCheckbox = wrapper.find('FilterCheckbox[label="Cinéma"]')
          expect(cinemaFilterCheckbox.prop('checked')).toBe(false)
          expect(cinemaFilterCheckbox.prop('className')).toBe('fc-label')
          expect(cinemaFilterCheckbox.prop('id')).toBe('CINEMA')
          expect(cinemaFilterCheckbox.prop('label')).toBe('Cinéma')
          expect(cinemaFilterCheckbox.prop('name')).toBe('CINEMA')
          expect(cinemaFilterCheckbox.prop('onChange')).toStrictEqual(expect.any(Function))
          expect(wrapper.find('FilterCheckbox[label="Visites, expositions"]').prop('checked')).toBe(
            false
          )
          expect(wrapper.find('FilterCheckbox[label="Musique"]').prop('checked')).toBe(false)
          expect(wrapper.find('FilterCheckbox[label="Spectacles"]').prop('checked')).toBe(false)
          expect(wrapper.find('FilterCheckbox[label="Cours, ateliers"]').prop('checked')).toBe(
            false
          )
          expect(wrapper.find('FilterCheckbox[label="Livres"]').prop('checked')).toBe(false)
          expect(
            wrapper.find('FilterCheckbox[label="Films, séries, podcasts"]').prop('checked')
          ).toBe(false)
          expect(wrapper.find('FilterCheckbox[label="Presse"]').prop('checked')).toBe(false)
          expect(wrapper.find('FilterCheckbox[label="Jeux vidéos"]').prop('checked')).toBe(false)
          expect(
            wrapper.find('FilterCheckbox[label="Conférences, rencontres"]').prop('checked')
          ).toBe(false)
          expect(
            wrapper.find('FilterCheckbox[label="Instruments de musique"]').prop('checked')
          ).toBe(false)
        })

        it('should not render FilterCheckbox component for "Toutes les catégories" Criteria', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerCategories = []

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const allCategoriesFilterCheckbox = wrapper.find(
            'FilterCheckbox[label="Toutes les catégories"]'
          )
          expect(allCategoriesFilterCheckbox).toHaveLength(0)
        })

        it('should render a FilterCheckbox component checked when category is selected', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerCategories = ['CINEMA', 'LIVRE']

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const cinemaCheckbox = wrapper.find('FilterCheckbox[label="Cinéma"]')
          expect(cinemaCheckbox.prop('checked')).toBe(true)
          expect(cinemaCheckbox.prop('className')).toBe('fc-label-checked')
          expect(wrapper.find('FilterCheckbox[label="Visites, expositions"]').prop('checked')).toBe(
            false
          )
          expect(wrapper.find('FilterCheckbox[label="Musique"]').prop('checked')).toBe(false)
          expect(wrapper.find('FilterCheckbox[label="Spectacles"]').prop('checked')).toBe(false)
          expect(wrapper.find('FilterCheckbox[label="Cours, ateliers"]').prop('checked')).toBe(
            false
          )
          expect(wrapper.find('FilterCheckbox[label="Livres"]').prop('checked')).toBe(true)
          expect(wrapper.find('FilterCheckbox[label="Livres"]').prop('className')).toBe(
            'fc-label-checked'
          )
          expect(
            wrapper.find('FilterCheckbox[label="Films, séries, podcasts"]').prop('checked')
          ).toBe(false)
          expect(wrapper.find('FilterCheckbox[label="Presse"]').prop('checked')).toBe(false)
          expect(wrapper.find('FilterCheckbox[label="Jeux vidéos"]').prop('checked')).toBe(false)
          expect(
            wrapper.find('FilterCheckbox[label="Conférences, rencontres"]').prop('checked')
          ).toBe(false)
          expect(
            wrapper.find('FilterCheckbox[label="Instruments de musique"]').prop('checked')
          ).toBe(false)
        })

        it('should display the number of selected categories', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerCategories = ['CINEMA', 'LIVRE', 'VISITE']

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const numberOfOfferTypesSelected = wrapper
            .findWhere(node => node.text() === '(3)')
            .first()
          expect(numberOfOfferTypesSelected).toHaveLength(1)
        })

        it('should not display the number of offer types selected when no filter is selected', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerCategories = []

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          const numberOfOfferTypesSelected = wrapper
            .findWhere(node => node.text() === '(0)')
            .first()
          expect(numberOfOfferTypesSelected).toHaveLength(0)
        })

        it('should transform array of categories received from props into an object in state', () => {
          // given
          props.history.location.pathname = '/recherche-offres/filtres'
          props.initialFilters.offerCategories = ['CINEMA', 'VISITE']

          // when
          const wrapper = shallow(<Filters {...props} />)

          // then
          expect(wrapper.state().filters.offerCategories).toStrictEqual({
            CINEMA: true,
            VISITE: true,
          })
        })
      })

      describe('reset filters', () => {
        describe('when single categorie', () => {
          it('should reset filters and trigger search to Algolia with given category', () => {
            // given
            props.history = createBrowserHistory()
            jest.spyOn(props.history, 'replace').mockImplementationOnce(() => {})
            props.history.location.pathname = '/recherche-offres/resultats/filtres'
            props.initialFilters = {
              isSearchAroundMe: true,
              offerCategories: ['VISITE'],
              offerDuo: false,
              offerTypes: {
                isDigital: false,
                isEvent: false,
                isThing: false,
              },
              sortBy: '_by_price',
            }
            props.query.parse.mockReturnValue({
              'mots-cles': 'librairie',
            })
            fetchAlgolia.mockReturnValue(
              new Promise(resolve => {
                resolve({
                  hits: [],
                  nbHits: 0,
                  page: 0,
                })
              })
            )
            const wrapper = mount(
              <Router history={props.history}>
                <Filters {...props} />
              </Router>
            )
            const resetButton = wrapper
              .find(HeaderContainer)
              .find('.reset-button')
              .first()

            // when
            resetButton.simulate('click')

            // then
            expect(fetchAlgolia).toHaveBeenCalledWith({
              //radiusRevert: aroundRadius: 0,
              keywords: 'librairie',
              offerCategories: [],
              offerDuo: false,
              offerTypes: {
                isDigital: false,
                isEvent: false,
                isThing: false,
              },
              sortBy: '_by_price',
            })
          })
        })

        describe('when multiple categories', () => {
          it('should reset filters and trigger search to Algolia with given categories', () => {
            // given
            props.history = createBrowserHistory()
            jest.spyOn(props.history, 'replace').mockImplementationOnce(() => {})
            props.history.location.pathname = '/recherche-offres/resultats/filtres'
            props.initialFilters = {
              isSearchAroundMe: true,
              offerCategories: ['VISITE', 'CINEMA'],
              offerTypes: {
                isDigital: true,
                isEvent: true,
                isThing: true,
              },
              sortBy: '_by_price',
            }
            props.query.parse.mockReturnValue({
              'mots-cles': 'librairie',
            })
            fetchAlgolia.mockReturnValue(
              new Promise(resolve => {
                resolve({
                  hits: [],
                  nbHits: 0,
                  page: 0,
                })
              })
            )
            const wrapper = mount(
              <Router history={props.history}>
                <Filters {...props} />
              </Router>
            )
            const resetButton = wrapper
              .find(HeaderContainer)
              .find('.reset-button')
              .first()

            // when
            resetButton.simulate('click')

            // then
            expect(fetchAlgolia).toHaveBeenCalledWith({
              //radiusRevert: aroundRadius: 0,
              keywords: 'librairie',
              offerCategories: [],
              offerDuo: false,
              offerTypes: {
                isDigital: false,
                isEvent: false,
                isThing: false,
              },
              sortBy: '_by_price',
            })
          })
        })
      })
    })
  })
})
