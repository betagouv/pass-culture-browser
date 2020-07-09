import React from 'react'
import { mount, shallow } from 'enzyme'

import BetaPage from '../BetaPage'
import FormFooter from '../../../forms/FormFooter'
import { Router } from 'react-router'
import { createBrowserHistory } from 'history'
import Icon from '../../../layout/Icon/Icon'

describe('components | BetaPage', () => {
  it('should render page component with pass culture information', () => {
    // when
    const wrapper = shallow(<BetaPage />)

    // then
    const line1 = wrapper.findWhere(node => node.text() === 'Bienvenue dans\nvotre pass Culture')
    const line2 = wrapper.findWhere(
      node => node.text() === 'Vous avez 18 ans et vivez dans un\ndépartement éligible ?'
    )
    const line3 = wrapper.findWhere(
      node =>
        node.text() ===
        "Bénéficiez de 500 € afin de\nrenforcer vos pratiques\nculturelles et d'en découvrir\nde nouvelles !"
    )
    expect(line1).toHaveLength(1)
    expect(line2).toHaveLength(1)
    expect(line3).toHaveLength(1)
  })

  it('should render an Icon component for page background', () => {
    // when
    const wrapper = shallow(<BetaPage />)

    // then
    const icon = wrapper.find(Icon)
    expect(icon.prop('alt')).toBe('')
    expect(icon.prop('svg')).toBe('circle')
  })

  it('should render a FormFooter component with the right props', () => {
    // given
    const trackSignupMock = jest.fn()
    const props = { trackSignup: trackSignupMock }

    // when
    const wrapper = shallow(<BetaPage {...props} />)

    // then
    const footer = wrapper.find(FormFooter)
    expect(footer).toHaveLength(1)
    expect(footer.prop('externalLink')).toStrictEqual({
      id: 'sign-up-link',
      label: 'Créer un compte',
      title: 'Créer un compte (nouvelle fenêtre)',
      tracker: trackSignupMock,
      url: 'https://www.demarches-simplifiees.fr/commencer/inscription-pass-culture',
    })
    expect(footer.prop('submit')).toStrictEqual({
      id: 'sign-in-link',
      label: "J'ai un compte",
      url: '/connexion',
    })
  })

  it('should redirect to sign in page when clicking on sign in link', () => {
    // given
    const history = createBrowserHistory()
    const wrapper = mount(
      <Router history={history}>
        <BetaPage />
      </Router>
    )
    const signInLink = wrapper.findWhere(node => node.text() === "J'ai un compte").first()

    // when
    // see issue : shorturl.at/rxCHW
    signInLink.simulate('click', { button: 0 })

    // then
    expect(wrapper.prop('history').location.pathname).toBe('/connexion')
  })
})
