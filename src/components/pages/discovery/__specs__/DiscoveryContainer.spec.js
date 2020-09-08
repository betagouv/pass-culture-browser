import { recommendationNormalizer } from '../../../../utils/normalizers'
import { mapDispatchToProps, mapStateToProps } from '../DiscoveryContainer'

jest.mock('../../../../utils/fetch-normalize-data/requestData', () => {
  const { assignData, createDataReducer, deleteData, _requestData } = jest.requireActual(
    '../../../../utils/fetch-normalize-data/reducers/data/actionCreators'
  )

  return {
    assignData,
    createDataReducer,
    deleteData,
    requestData: _requestData,
  }
})
jest.useFakeTimers()

describe('src | components | pages | discovery | DiscoveryContainer', () => {
  let dispatch
  let replace
  let props

  beforeEach(() => {
    dispatch = jest.fn()
    replace = jest.fn()
    props = {
      history: {
        replace,
      },
      location: {
        search: '',
      },
      match: {
        params: {},
      },
      query: {
        parse: () => ({}),
      },
    }
  })

  describe('mapStateToProps()', () => {
    it('should return an object of props', () => {
      // given
      const state = {
        data: {
          recommendations: [],
        },
        pagination: {
          seedLastRequestTimestamp: 11111111112,
        },
        geolocation: {
          longitude: 48.256756,
          latitude: 2.8796567,
          watchId: 1,
        },
      }

      const ownProps = {
        match: {
          params: {},
        },
      }

      // when
      const props = mapStateToProps(state, ownProps)

      // then
      expect(props).toStrictEqual({
        coordinates: {
          latitude: 2.8796567,
          longitude: 48.256756,
          watchId: 1,
        },
        currentRecommendation: undefined,
        readRecommendations: undefined,
        recommendations: [],
        seedLastRequestTimestamp: 11111111112,
        shouldReloadRecommendations: true,
      })
    })
  })

  describe('mapDispatchToProps()', () => {
    describe('when mapping loadRecommendations', () => {
      it('should load the recommendations with page equals 1 when no current recommendation without user geolocation when it is denied', async () => {
        // given
        const handleRequestSuccess = jest.fn()
        const handleRequestFail = jest.fn()
        const currentRecommendation = {}
        const recommendations = []
        const readRecommendations = null
        const shouldReloadRecommendations = false
        const functions = mapDispatchToProps(dispatch, props)
        const { loadRecommendations } = functions

        Object.defineProperty(navigator, 'geolocation', {
          writable: true,
          value: {
            getCurrentPosition: jest.fn(reject => reject()),
          },
        })

        // when
        await loadRecommendations(
          handleRequestSuccess,
          handleRequestFail,
          currentRecommendation,
          recommendations,
          readRecommendations,
          shouldReloadRecommendations
        )

        // then
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          config: {
            apiPath: `/recommendations?`,
            body: {
              readRecommendations: null,
              offersSentInLastCall: [],
            },
            handleFail: handleRequestFail,
            handleSuccess: handleRequestSuccess,
            method: 'PUT',
            normalizer: recommendationNormalizer,
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS?',
        })
      })

      it(
        'should load the recommendations with page equals 2' +
          ' when current recommendation is a valid one attached to an offer' +
          ' without user geolocation when it is denied',
        async () => {
          // given
          const handleRequestSuccess = jest.fn()
          const handleRequestFail = jest.fn()
          const currentRecommendation = {
            id: 'ABC3',
            index: 1,
            offerId: 'ABC2',
          }
          const recommendations = [{ id: 'AE3', index: 3, offerId: 'AE5' }]
          const readRecommendations = null
          const shouldReloadRecommendations = false
          const functions = mapDispatchToProps(dispatch, props)
          const { loadRecommendations } = functions

          Object.defineProperty(navigator, 'geolocation', {
            writable: true,
            value: {
              getCurrentPosition: jest.fn(success => success()),
            },
          })

          // when
          await loadRecommendations(
            handleRequestSuccess,
            handleRequestFail,
            currentRecommendation,
            recommendations,
            readRecommendations,
            shouldReloadRecommendations
          )

          // then
          expect(dispatch.mock.calls[0][0]).toStrictEqual({
            config: {
              apiPath: `/recommendations?`,
              body: {
                readRecommendations: null,
                offersSentInLastCall: ['AE5'],
              },
              handleFail: handleRequestFail,
              handleSuccess: handleRequestSuccess,
              method: 'PUT',
              normalizer: recommendationNormalizer,
            },
            type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS?',
          })
        }
      )

      it('should load recommendations using user geolocation when user geolocation is granted', async () => {
        // given
        const handleRequestSuccess = jest.fn()
        const handleRequestFail = jest.fn()
        const currentRecommendation = {
          id: 'ABC3',
          index: 1,
          offerId: 'ABC2',
        }
        const recommendations = [{ id: 'AE3', index: 3, offerId: 'AE4' }]
        const readRecommendations = null
        const shouldReloadRecommendations = false
        const coordinates = {
          latitude: 2.8796567,
          longitude: 48.256756,
          watchId: 1,
        }
        const functions = mapDispatchToProps(dispatch, props)
        const { loadRecommendations } = functions

        Object.defineProperty(navigator, 'geolocation', {
          writable: true,
          value: {
            getCurrentPosition: jest.fn(success => success()),
          },
        })

        // when
        await loadRecommendations(
          handleRequestSuccess,
          handleRequestFail,
          currentRecommendation,
          recommendations,
          readRecommendations,
          shouldReloadRecommendations,
          coordinates
        )

        // then
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          config: {
            apiPath: `/recommendations?longitude=48.256756&latitude=2.8796567`,
            body: {
              readRecommendations: null,
              offersSentInLastCall: ['AE4'],
            },
            handleFail: handleRequestFail,
            handleSuccess: handleRequestSuccess,
            method: 'PUT',
            normalizer: recommendationNormalizer,
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS?LONGITUDE=48.256756&LATITUDE=2.8796567',
        })
      })

      it('should load the recommendations when user is not geolocated', async () => {
        // given
        const handleRequestSuccess = jest.fn()
        const handleRequestFail = jest.fn()
        const currentRecommendation = {
          id: 'ABC3',
          index: 1,
          offerId: 'ABC2',
        }
        const recommendations = [{ id: 'AE3', index: 3, offerId: 'AE4' }]
        const readRecommendations = null
        const shouldReloadRecommendations = false
        const coordinates = {
          latitude: null,
          longitude: null,
          watchId: null,
        }
        const functions = mapDispatchToProps(dispatch, props)
        const { loadRecommendations } = functions

        Object.defineProperty(navigator, 'geolocation', {
          writable: true,
          value: {
            getCurrentPosition: jest.fn(resolve =>
              resolve({
                coords: {
                  latitude: 1,
                  longitude: 2,
                },
              })
            ),
          },
        })

        // when
        await loadRecommendations(
          handleRequestSuccess,
          handleRequestFail,
          currentRecommendation,
          recommendations,
          readRecommendations,
          shouldReloadRecommendations,
          coordinates
        )

        // then
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          config: {
            apiPath: `/recommendations?longitude=2&latitude=1`,
            body: {
              readRecommendations: null,
              offersSentInLastCall: ['AE4'],
            },
            handleFail: handleRequestFail,
            handleSuccess: handleRequestSuccess,
            method: 'PUT',
            normalizer: recommendationNormalizer,
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS?LONGITUDE=2&LATITUDE=1',
        })
      })
    })

    describe('when mapping redirectToFirstRecommendationIfNeeded', () => {
      describe('when there are no recommendations', () => {
        it('should return undefined', () => {
          // given
          const loadedRecommendations = []

          // when
          const redirect = mapDispatchToProps(
            dispatch,
            props
          ).redirectToFirstRecommendationIfNeeded(loadedRecommendations)

          // then
          expect(redirect).toBeUndefined()
        })
      })

      describe('when not on discovery pathname', () => {
        it('should return undefined', () => {
          // given
          const loadedRecommendations = [{ id: 'firstRecommendation' }]
          props.location.pathname = ''

          // when
          const redirect = mapDispatchToProps(
            dispatch,
            props
          ).redirectToFirstRecommendationIfNeeded(loadedRecommendations)

          // then
          expect(redirect).toBeUndefined()
        })
      })
    })

    describe('when mapping resetReadRecommendations', () => {
      it('should reset recommendations with the right configuration', () => {
        // when
        mapDispatchToProps(dispatch, props).resetReadRecommendations()

        // then
        expect(dispatch).toHaveBeenCalledWith({
          patch: { readRecommendations: [] },
          type: 'ASSIGN_DATA',
        })
      })
    })

    describe('when mapping saveLastRecommendationsRequestTimestamp', () => {
      it('should save recommendations loaded timestamp with the right configuration', () => {
        // when
        mapDispatchToProps(dispatch, props).saveLastRecommendationsRequestTimestamp()

        // then
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SAVE_RECOMMENDATIONS_REQUEST_TIMESTAMP',
        })
      })
    })

    describe('when mapping updateLastRequestTimestamp', () => {
      it('should save update last seed request timestamp', () => {
        // when
        mapDispatchToProps(dispatch, props).updateLastRequestTimestamp()

        // then
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          seedLastRequestTimestamp: expect.any(Number),
          type: 'UPDATE_SEED_LAST_REQUEST_TIMESTAMP',
        })
      })
    })

    describe('when mapping resetRecommendations', () => {
      it('should delete all recommendations in the store', () => {
        // when
        mapDispatchToProps(dispatch, props).resetRecommendations()

        // then
        expect(dispatch).toHaveBeenCalledWith({
          patch: { recommendations: [] },
          type: 'ASSIGN_DATA',
        })
      })
    })
  })
})
