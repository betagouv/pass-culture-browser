import { shallow } from 'enzyme'
import React from 'react'

import Thumb from '../Thumb'

describe('src | components | pages | Thumb', () => {
  describe('render', () => {
    describe('without Mediation', () => {
      // given
      const props = {
        src: 'http://fake.url',
      }
      it('should display backgound div', () => {
        // when
        const wrapper = shallow(<Thumb {...props} />)
        const backgroundDiv = wrapper.find('.background').props()
        const thumbDiv = wrapper
          .find('.thumb')
          .childAt(1)
          .props()

        // then
        expect(backgroundDiv.style.backgroundImage).toStrictEqual("url('http://fake.url')")
        expect(backgroundDiv.style.backgroundSize).toBeNull()
        expect(thumbDiv.style.backgroundImage).toStrictEqual("url('http://fake.url')")
        expect(thumbDiv.style.backgroundSize).toBeNull()
        expect(thumbDiv.className).toStrictEqual('image translatable ')
      })
    })
    describe('with Mediation', () => {
      it('should display backgound div', () => {
        // given
        const props = {
          src: 'http://fake.url',
          translated: true,
          withMediation: true,
        }

        // when
        const wrapper = shallow(<Thumb {...props} />)
        const backgroundDiv = wrapper.find('.background')
        const thumbDiv = wrapper
          .find('.thumb')
          .childAt(0)
          .props()

        // then
        expect(backgroundDiv.exists()).toStrictEqual(false)
        expect(thumbDiv.style.backgroundImage).toStrictEqual("url('http://fake.url')")
        expect(thumbDiv.style.backgroundSize).toStrictEqual('cover')
        expect(thumbDiv.className).toStrictEqual('image translatable translated')
      })
    })
  })
})
