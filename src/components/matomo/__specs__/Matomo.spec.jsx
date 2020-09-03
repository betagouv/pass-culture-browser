import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

import getMockStore from '../../../utils/mockStore'
import MatomoContainer from '../MatomoContainer'

jest.mock('../../../utils/config', () => ({
  MATOMO_GEOLOCATION_GOAL_ID: 1,
  ANDROID_APPLICATION_ID: 'app.passculture.testing.webapp',
}))

describe('src | components | Matomo', () => {
  let fakeMatomo
  let history
  let store
  let props

  beforeEach(() => {
    history = createBrowserHistory()
    history.push('/router/path')
    fakeMatomo = {
      push: jest.fn(),
    }
    window._paq = fakeMatomo
    store = getMockStore({
      currentUser: (state = null) => state,
    })
  })

  it('should push a new page displayed event', () => {
    // when
    mount(
      <Router history={history}>
        <Provider store={store}>
          <MatomoContainer {...props} />
        </Provider>
      </Router>
    )

    // then
    expect(fakeMatomo.push).toHaveBeenNthCalledWith(1, ['setCustomUrl', '/router/path'])
  })

  it('should push the page title', () => {
    // given
    document.title = 'pass Culture page title'

    // when
    mount(
      <Router history={history}>
        <Provider store={store}>
          <MatomoContainer {...props} />
        </Provider>
      </Router>
    )

    // then
    expect(fakeMatomo.push).toHaveBeenNthCalledWith(2, [
      'setDocumentTitle',
      'pass Culture page title',
    ])
  })

  describe('when user is not logged', () => {
    it('should push Anonymous as userId', () => {
      // when
      mount(
        <Router history={history}>
          <Provider store={store}>
            <MatomoContainer {...props} />
          </Provider>
        </Router>
      )

      // then
      expect(fakeMatomo.push).toHaveBeenNthCalledWith(3, ['setUserId', 'ANONYMOUS on WEBAPP'])
    })

    it('should reset userId', () => {
      // given
      history.push(`/connexion`)

      // when
      mount(
        <Router history={history}>
          <Provider store={store}>
            <MatomoContainer {...props} />
          </Provider>
        </Router>
      )

      // then
      expect(fakeMatomo.push).toHaveBeenNthCalledWith(5, ['resetUserId'])
    })
  })

  describe('when user is logged', () => {
    it('should dispatch the user id when current user is logged', () => {
      // given
      store = getMockStore({
        currentUser: (
          state = {
            id: '5FYTbfk4TR',
          }
        ) => state,
      })

      // when
      mount(
        <Router history={history}>
          <Provider store={store}>
            <MatomoContainer {...props} />
          </Provider>
        </Router>
      )

      // then
      expect(fakeMatomo.push).toHaveBeenNthCalledWith(3, ['setUserId', '5FYTbfk4TR on WEBAPP'])
    })
  })

  describe('when user is coming from webapp', () => {
    it('should dispatch user id with the right platform and custom variable', () => {
      // Given
      store = getMockStore({
        currentUser: (
          state = {
            id: '5FYTbfk4TR',
          }
        ) => state,
      })

      // When
      mount(
        <Router history={history}>
          <Provider store={store}>
            <MatomoContainer {...props} />
          </Provider>
        </Router>
      )

      // Then
      expect(fakeMatomo.push).toHaveBeenCalledWith(['setUserId', '5FYTbfk4TR on WEBAPP'])
      expect(fakeMatomo.push).toHaveBeenCalledWith([
        'setCustomVariable',
        1,
        'platform',
        'browser',
        'visit',
      ])
      expect(fakeMatomo.push).not.toHaveBeenCalledWith(['setUserId', '5FYTbfk4TR on TWA'])
      expect(fakeMatomo.push).not.toHaveBeenCalledWith([
        'setCustomVariable',
        1,
        'platform',
        'application',
        'visit',
      ])
    })
  })

  describe('when user is coming from twa', () => {
    it('should dispatch user id with the right platform and custom variable', () => {
      // Given
      Object.defineProperty(document, 'referrer', {
        get: () => 'android-app://app.passculture.testing.webapp',
      })

      store = getMockStore({
        currentUser: (
          state = {
            id: '5FYTbfk4TR',
          }
        ) => state,
      })

      // When
      mount(
        <Router history={history}>
          <Provider store={store}>
            <MatomoContainer {...props} />
          </Provider>
        </Router>
      )

      // Then
      expect(fakeMatomo.push).toHaveBeenCalledWith(['setUserId', '5FYTbfk4TR on TWA'])
      expect(fakeMatomo.push).toHaveBeenCalledWith([
        'setCustomVariable',
        1,
        'platform',
        'application',
        'visit',
      ])
      expect(fakeMatomo.push).not.toHaveBeenCalledWith(['setUserId', '5FYTbfk4TR on WEBAPP'])
      expect(fakeMatomo.push).not.toHaveBeenCalledWith([
        'setCustomVariable',
        1,
        'platform',
        'browser',
        'visit',
      ])
    })
  })
})
