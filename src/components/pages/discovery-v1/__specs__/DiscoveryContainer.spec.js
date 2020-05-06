import { mapDispatchToProps, mapStateToProps } from '../DiscoveryContainer'
import { recommendationNormalizer } from '../../../../utils/normalizers'

jest.mock('redux-thunk-data', () => {
  const { assignData, createDataReducer, deleteData, requestData } = jest.requireActual(
    'fetch-normalize-data'
  )
  return {
    assignData,
    createDataReducer,
    deleteData,
    requestData,
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
      it('should load the recommendations with page equals 1 when no current recommendation', () => {
        // given
        const handleRequestSuccess = jest.fn()
        const handleRequestFail = jest.fn()
        const currentRecommendation = {}
        const recommendations = []
        const readRecommendations = null
        const shouldReloadRecommendations = false
        const functions = mapDispatchToProps(dispatch, props)
        const { loadRecommendations } = functions

        // when
        loadRecommendations(
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
            apiPath: `/recommendations/v2?`,
            body: {
              readRecommendations: null,
              seenRecommendationIds: [],
            },
            handleFail: handleRequestFail,
            handleSuccess: handleRequestSuccess,
            method: 'PUT',
            normalizer: recommendationNormalizer,
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS/V2?',
        })
      })

      it('should load the recommendations with page equals 2 when current recommendation is a valid one attached to an offer', () => {
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
        const functions = mapDispatchToProps(dispatch, props)
        const { loadRecommendations } = functions

        // when
        loadRecommendations(
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
            apiPath: `/recommendations/v2?`,
            body: {
              readRecommendations: null,
              seenRecommendationIds: ['AE4'],
            },
            handleFail: handleRequestFail,
            handleSuccess: handleRequestSuccess,
            method: 'PUT',
            normalizer: recommendationNormalizer,
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS/V2?',
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
  })
})
