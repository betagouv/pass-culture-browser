import { getRemainingCreditForGivenCreditLimit } from '../getRemainingCreditForGivenCreditLimit'

describe('getRemainingCreditForGivenCreditLimit', () => {
  it('returns wallet balance if lower than max minus actual', () => {
    // given
    const wallet = 100
    const expense = { domain: 'all', current: 0, max: 200 }

    // then
    const result = getRemainingCreditForGivenCreditLimit(wallet)(expense)

    // when
    expect(result).toBe(100)
  })

  it('returns max minus actual if lower than wallet balance', () => {
    // given
    const wallet = 400
    const expense = { domain: 'physical', current: 90, max: 200 }

    // then
    const result = getRemainingCreditForGivenCreditLimit(wallet)(expense)

    // when
    expect(result).toBe(110)
  })
})
