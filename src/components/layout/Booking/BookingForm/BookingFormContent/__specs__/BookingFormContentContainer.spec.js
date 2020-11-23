import { mapStateToProps } from '../BookingFormContentContainer'

describe('src | components | BookingFormContentContainer', () => {
  describe('mapStateToProps', () => {
    it('should return an object of props', () => {
      // given
      const state = {
        data: {
          offers: [
            {
              id: 'O1',
              isDuo: true,
              offerType: {
                value: 'FAKE_TYPE',
              },
            },
          ],
          stocks: [
            {
              id: 'S1',
              offerId: 'O1',
              remainingQuantity: 3,
            },
          ],
        },
      }

      const ownProps = {
        offerId: 'O1',
        values: {
          stockId: 'S1',
        },
      }

      // when
      const props = mapStateToProps(state, ownProps)

      // then
      expect(props).toStrictEqual({
        isStockDuo: true,
        isSubscription: false,
      })
    })
  })
})
