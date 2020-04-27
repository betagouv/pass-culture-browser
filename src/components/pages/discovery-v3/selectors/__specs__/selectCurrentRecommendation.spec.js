import selectCurrentRecommendation from '../selectCurrentRecommendation'

describe('src | components | pages | discovery | selectors | selectCurrentRecommendation', () => {
  let offerId

  describe('when there is offerId and no mediationId', () => {
    it('should select the current recommendation corresponding to match params', () => {
      // given
      offerId = 'ARBA'
      const recommendation = {
        productIdentifier: 'foo',
        offerId,
      }
      const state = {
        data: {
          recommendations: [recommendation],
        },
      }

      // when
      const result = selectCurrentRecommendation(state, offerId)

      // then
      const expected = {
        index: 0,
        ...recommendation,
      }
      expect(result).toStrictEqual(expected)
    })
  })
})
