import React from 'react'
import { shallow, mount } from 'enzyme'

import RemainingCredit from '../RemainingCredit'
import { NON_BREAKING_SPACE } from '../../../../../../utils/specialCharacters'
import User from '../../ValueObjects/User'

describe('remainingCredit', () => {
  let props

  beforeEach(() => {
    props = {
      user: new User({
        expenses: [
          { domain: 'all', current: 10, max: 300 },
          { domain: 'digital', current: 100, max: 200 },
          { domain: 'physical', current: 100, max: 200 },
        ],
        wallet_balance: 0,
      }),
    }
  })

  describe('render', () => {
    it('should display three gauges and prices', () => {
      // Given
      props.user = new User({
        expenses: [
          { domain: 'all', current: 10, max: 500 },
          { domain: 'digital', current: 20, max: 201 },
          { domain: 'physical', current: 30, max: 202 },
        ],
        wallet_balance: 351,
      })

      // When
      const wrapper = mount(<RemainingCredit {...props} />)

      // Then
      const digitalRemainingCredit = wrapper.find({ children: `181${NON_BREAKING_SPACE}€` })
      const physicalRemainingCredit = wrapper.find({ children: `172${NON_BREAKING_SPACE}€` })
      expect(digitalRemainingCredit).toHaveLength(1)
      expect(physicalRemainingCredit).toHaveLength(1)
    })

    it('should display details text', () => {
      // When
      const wrapper = shallow(<RemainingCredit {...props} />)

      // Then
      const gaugeTitle = wrapper.find({
        children: `Tu peux encore dépenser jusqu’à${NON_BREAKING_SPACE}:`,
      })
      const digitalRemainingCreditText = wrapper.find({
        children: `en offres\u000Anumériques\u000A(streaming…)`,
      })
      const physicalRemainingCreditText = wrapper.find({
        children: 'en offres\u000Aphysiques\u000A(livres…)',
      })
      const remainingCreditText = wrapper.find({ children: 'en sorties\u000A(spectacles…)' })
      expect(gaugeTitle).toHaveLength(1)
      expect(digitalRemainingCreditText).toHaveLength(1)
      expect(physicalRemainingCreditText).toHaveLength(1)
      expect(remainingCreditText).toHaveLength(1)
    })

    describe('readMore', () => {
      const READ_MORE_TEXT = `Le but du pass Culture est de renforcer tes pratiques culturelles,
                mais aussi d’en créer de nouvelles. Ces plafonds ont été mis en place
                pour favoriser la diversification des pratiques culturelles.`

      it('should render hidden readMore explanation', () => {
        // When
        const wrapper = shallow(<RemainingCredit {...props} />)

        // Then
        const readMoreExplanationNode = wrapper.find({ children: READ_MORE_TEXT })
        expect(readMoreExplanationNode).toHaveLength(0)
      })

      it('should display readMore explanation on title click', () => {
        // When
        const wrapper = shallow(<RemainingCredit {...props} />)
        const readMoreTitle = `Pourquoi les biens physiques et numériques sont-ils limités${NON_BREAKING_SPACE}?`
        const readMoreTitleNode = wrapper.find({ children: readMoreTitle })
        readMoreTitleNode.invoke('onClick')()

        // Then
        const readMoreExplanationNode = wrapper.find({ children: READ_MORE_TEXT })

        expect(readMoreExplanationNode).toHaveLength(1)
      })
    })
  })
})
