import { mapDispatchToProps, mapStateToProps } from '../MyBookingsContainer'
import { bookingNormalizer } from '../../../../utils/normalizers'

describe('src | components | pages | my-bookings | MyBookingsContainer', () => {
  describe('mapStateToProps()', () => {
    it('should return an object', () => {
      // given
      const state = {
        data: {
          bookings: [],
          offers: [],
        },
      }

      // when
      const props = mapStateToProps(state)

      // then
      expect(props).toStrictEqual({
        validBookings: expect.any(Object),
      })
    })
  })

  describe('requestGetBookings()', () => {
    it('should dispatch my bookings', () => {
      // given
      const dispatch = jest.fn()
      const handleFail = jest.fn()
      const handleSuccess = jest.fn()

      // when
      mapDispatchToProps(dispatch).requestGetBookings(handleFail, handleSuccess)

      // then
      expect(dispatch).toHaveBeenCalledWith({
        config: {
          apiPath: '/bookings',
          handleFail: expect.any(Function),
          handleSuccess: expect.any(Function),
          method: 'GET',
          normalizer: bookingNormalizer,
        },
        type: 'REQUEST_DATA_GET_/BOOKINGS',
      })
    })
  })
})
