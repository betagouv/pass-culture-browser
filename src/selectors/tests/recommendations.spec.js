import { selectRecommendations } from '../recommendations'
import state2 from '../../mocks/global_state_2_Testing_10_10_18'

describe('selectRecommendations', () => {
  it.skip('should return an empty array if there is no recommendations', () => {
    const state = {
      data: {
        recommendations: [],
      },
      geolocation: {
        latitude: 'latitude',
        longitude: 'longitude',
      },
    }
    expect(selectRecommendations(state)).toEqual([])
  })

  it('should return recommendations', () => {
    const expected = {
      bookingsIds: [],
      dateCreated: '2018-10-10T14:19:27.410551Z',
      dateRead: null,
      dateUpdated: '2018-10-10T14:19:27.410609Z',
      distance: '5444 km',
      firstThumbDominantColor: [237, 235, 231],
      id: 'AEWPS',
      index: 0,
      inviteforEventOccurrenceId: null,
      isClicked: true,
      isFavorite: false,
      isFirst: false,
      mediation: {
        authorId: 'AMTQ',
        backText: null,
        credit: 'undefined',
        dateCreated: '2018-09-12T08:35:27.948370Z',
        dateModifiedAtLastProvider: '2018-09-12T08:35:27.948349Z',
        firstThumbDominantColor: [237, 235, 231],
        frontText: null,
        id: 'AKSA',
        idAtProviders: null,
        isActive: true,
        lastProviderId: null,
        modelName: 'Mediation',
        offerId: 'AKLA',
        thumbCount: 1,
        tutoIndex: null,
      },
      mediationId: 'AKSA',
      modelName: 'Recommendation',
      offer: {
        bookingEmail: null,
        dateCreated: '2018-09-12T08:19:01.614549Z',
        dateModifiedAtLastProvider: '2018-09-12T08:19:01.614532Z',
        dateRange: [],
        eventId: null,
        eventOrThing: {
          dateModifiedAtLastProvider: '2018-09-12T08:19:01.612018Z',
          description:
            'LA TOILE est une plateforme VOD qui vous propose une programmation complémentaire en lien avec VOTRE salle de cinéma. ',
          extraData: null,
          firstThumbDominantColor: null,
          id: 'BE',
          idAtProviders: null,
          isNational: false,
          lastProviderId: null,
          mediaUrls: [],
          modelName: 'Thing',
          name: 'La Toile VOD',
          thumbCount: 0,
          type: 'AUDIOVISUEL',
          url: 'https://www.la-toile-vod.com/login',
        },
        id: 'AKLA',
        idAtProviders: null,
        isActive: true,
        lastProviderId: null,
        modelName: 'Offer',
        stocks: [
          {
            available: 200,
            bookingLimitDatetime: null,
            bookingRecapSent: null,
            dateModified: '2018-09-12T15:13:50.187143Z',
            dateModifiedAtLastProvider: '2018-09-12T15:13:50.187134Z',
            eventOccurrenceId: null,
            groupSize: 1,
            id: 'C8PA',
            idAtProviders: null,
            isSoftDeleted: false,
            lastProviderId: null,
            modelName: 'Stock',
            offerId: 'AKLA',
            price: 3,
          },
        ],
        thingId: 'BE',
        venue: {
          address: null,
          bookingEmail: null,
          city: null,
          dateModifiedAtLastProvider: '2018-09-12T08:15:18.450460Z',
          departementCode: null,
          firstThumbDominantColor: null,
          id: 'AMLA',
          idAtProviders: null,
          isVirtual: true,
          lastProviderId: null,
          latitude: null,
          longitude: null,
          managingOfferer: {
            address: '15 RUE FENELON',
            bic: null,
            city: 'PARIS 10',
            dateCreated: '2018-09-12T08:15:18.438270Z',
            dateModifiedAtLastProvider: '2018-09-12T08:15:18.438257Z',
            firstThumbDominantColor: null,
            iban: null,
            id: 'A9EA',
            idAtProviders: null,
            isActive: true,
            lastProviderId: null,
            modelName: 'Offerer',
            name: 'CARBEC MEDIA',
            postalCode: '75010',
            siren: '818194870',
            thumbCount: 0,
          },
          managingOffererId: 'A9EA',
          modelName: 'Venue',
          name: 'Offre en ligne',
          postalCode: null,
          siret: null,
          thumbCount: 0,
        },
        venueId: 'AMLA',
      },
      offerId: 'AKLA',
      search: 'page=1',
      shareMedium: null,
      thumbUrl: 'http://localhost/storage/thumbs/mediations/AKSA',
      tz: 'Europe/Paris',
      uniqId: 'thing_BE',
      userId: 'AQBA',
      validUntilDate: '2018-10-13T14:19:27.442986Z',
    }
    const result = selectRecommendations(state2)

    expect(result[0]).toEqual(expected)
  })
})
