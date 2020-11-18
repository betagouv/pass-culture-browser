export const myBookingsNormalizer = {
  stock: {
    normalizer: {
      offer: {
        normalizer: {
          stocks: 'stocks',
        },
        stateKey: 'offers',
      },
    },
  },
}

export const bookingNormalizer = {
  mediation: 'mediations',
  stock: {
    normalizer: {
      offer: 'offers',
    },
    stateKey: 'stocks',
  },
}

export const favoriteNormalizer = {
  booking: 'bookings',
  offer: {
    normalizer: {
      stocks: 'stocks',
    },
    stateKey: 'offers',
  },
}

export const recommendationNormalizer = {
  bookings: {
    normalizer: {
      stock: 'stocks',
    },
    stateKey: 'bookings',
  },
  mediation: 'mediations',
  offer: {
    normalizer: {
      favorites: 'favorites',
      stocks: 'stocks',
    },
    stateKey: 'offers',
  },
}

export const offerNormalizer = {
  activeMediation: {
    stateKey: 'mediations',
  },
  firstMatchingBooking: 'bookings',
  stocks: {
    stateKey: 'stocks',
    normalizer: {
      bookings: 'bookings',
    },
  },
}
