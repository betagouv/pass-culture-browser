import { mapStateToProps } from '../VersoContentOfferContainer'

describe('src | components | verso | verso-content | verso-info-offer | VersoContentOfferContainer', () => {
  describe('mapStateToProps', () => {
    it('should return an object containing bookables, current recommendation and information regarding the offer expiration', () => {
      // given
      const recommendation = {
        mediationId: 2,
        offer: {
          isFinished: false,
          stocks: [{}],
          venue: {
            latitude: 48.91683,
            longitude: 2.4388,
          },
        },
        offerId: 1,
        uniqId: 3,
      }
      const initialState = {
        data: {
          bookings: [],
          recommendations: [recommendation],
        },
        geolocation: {
          latitude: 41.1,
          longitude: 42.1,
        },
      }
      const props = {
        match: {
          params: { mediationId: 2, offerId: 1 },
          url: 'this is a fake url',
        },
        recommendation,
      }

      // when
      const result = mapStateToProps(initialState, props)

      // then
      expect(result.bookables).not.toBeNull()
      expect(result.isFinished).toBe(false)
      expect(result.recommendation).not.toBeNull()
    })
  })
})
