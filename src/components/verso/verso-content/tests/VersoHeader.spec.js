import React from 'react'
import { shallow } from 'enzyme'

import VersoHeader from '../VersoHeader'

// given
const props = {
  backgroundColor: '#ACE539',
  subtitle: 'Offer subtitle',
  title: 'Offer title',
}

describe('src | components | verso | VersoHeader', () => {
  it('should match the snapshot with all props', () => {
    // when
    const wrapper = shallow(<VersoHeader {...props} />)

    // then
    expect(wrapper).toMatchSnapshot()
  })

  it('check if has title', () => {
    // when
    const wrapper = shallow(<VersoHeader {...props} />)
    const element = wrapper.find('#verso-offer-name')

    // then
    const expected = props.title
    expect(element.text()).toStrictEqual(expected)
  })

  it('check if has subtitle', () => {
    // when
    const wrapper = shallow(<VersoHeader {...props} />)
    const element = wrapper.find('#verso-offer-venue')

    // then
    const expected = props.subtitle
    expect(element.text()).toStrictEqual(expected)
  })

  it('check if has background color', () => {
    // when
    const wrapper = shallow(<VersoHeader {...props} />)
    const element = wrapper.find('.verso-header')

    // then
    const expected = { backgroundColor: props.backgroundColor }
    expect(element.prop('style')).toStrictEqual(expected)
  })
})
