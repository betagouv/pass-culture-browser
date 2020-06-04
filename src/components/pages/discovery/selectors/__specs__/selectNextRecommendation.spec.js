import selectNextRecommendation from '../selectNextRecommendation'

describe('src | components | pages | discovery | selectors | selectNextRecommendation', () => {
  it('should select the next indexified recommendation', () => {
    // given
    const offerId = 'AE'
    const currentRecommendation = {
      id: 'BF',
      offerId,
    }
    const nextRecommendation = {
      offerId: 'CE',
    }
    const state = {
      data: {
        recommendations: [currentRecommendation, nextRecommendation],
      },
    }

    // when
    const result = selectNextRecommendation(state, offerId)

    // then
    const expected = {
      index: 1,
      ...nextRecommendation,
    }
    expect(result).toStrictEqual(expected)
  })
})
