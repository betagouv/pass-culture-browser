import selectUniqAndIndexifiedRecommendations, {
  fakeLastRecommendation,
} from '../selectUniqAndIndexifiedRecommendations'

describe('src | components | pages | discovery | selectors | selectUniqAndIndexifiedRecommendations', () => {
  it('should return an array of object having an `uniqId` property', () => {
    // given
    const state = {
      data: {
        recommendations: [
          {
            productOrTutoIdentifier: 'product_0',
            id: 'AE',
          },
          {
            id: 'BF',
          },
        ],
      },
    }

    // when
    const results = selectUniqAndIndexifiedRecommendations(state)

    // then
    expect(results).not.toHaveLength(0)
    results.forEach(result => {
      expect(result.productOrTutoIdentifier).toBeDefined()
    })
  })

  it('should return an empty array if there are no recommendations except lastFakeRecommendation', () => {
    // given
    const state = {
      data: {
        recommendations: [],
      },
      geolocation: {
        latitude: 48.8637,
        longitude: 2.3374,
        watchId: 1,
      },
    }

    // when
    const result = selectUniqAndIndexifiedRecommendations(state)

    // then
    expect(result).toStrictEqual([fakeLastRecommendation])
  })

  it('should return recommendations', () => {
    // given
    const recommendation = {
      bookingsIds: [],
      dateCreated: '2018-10-10T14:19:27.410551Z',
      dateRead: null,
      dateUpdated: '2018-10-10T14:19:27.410609Z',
      productOrTutoIdentifier: 'product_0',
      distance: '5444 km',
      firstThumbDominantColor: [237, 235, 231],
      id: 'AEWPS',
      index: 0,
      isClicked: true,
      isFavorite: false,
      isFirst: false,
      mediationId: 'AKSA',
      modelName: 'Recommendation',
      offerId: 'AKLA',
      search: 'page=1',
      shareMedium: null,
      thumbUrl: 'http://localhost/storage/thumbs/mediations/AKSA',
      uniqId: 'product_BE',
      userId: 'AQBA',
      validUntilDate: '2018-10-13T14:19:27.442986Z',
    }
    const state = {
      data: {
        recommendations: [recommendation],
      },
    }

    // when
    const result = selectUniqAndIndexifiedRecommendations(state)

    // then
    expect(result[0]).toStrictEqual(recommendation)
    expect(result).toHaveLength(2)
  })
})
