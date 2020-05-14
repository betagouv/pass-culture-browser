import { shallow } from 'enzyme'
import React from 'react'

import Header from '../Header'
import User from '../../../../pages/profile/ValueObjects/User'

describe('src | components | menu | Header', () => {
  let props

  beforeEach(() => {
    props = {
      currentUser: new User({
        publicName: 'Emmanuel Macron',
        wallet_balance: 500,
      }),
    }
  })

  describe('render()', () => {
    it('should render the username and his wallet', () => {
      // given
      const wrapper = shallow(<Header {...props} />)

      // when
      const walletElement = wrapper.find('#main-menu-header-wallet-value').text()
      const username = wrapper.find('#main-menu-header-username').text()

      // then
      expect(walletElement).toBe('500\u00A0€')
      expect(username).toBe('Emmanuel Macron')
    })
  })
})
