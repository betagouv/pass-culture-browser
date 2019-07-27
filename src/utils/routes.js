import React from 'react'
import { Redirect } from 'react-router-dom'

import { WEBAPP_CONTACT_EXTERNAL_PAGE } from './config'
import ActivationContainer from '../components/pages/activation/ActivationContainer'
import BetaPage from '../components/pages/BetaPage'
import MyBookingsContainer from '../components/pages/my-bookings/MyBookingsContainer'
import DiscoveryContainer from '../components/pages/discovery/DiscoveryContainer'
import FavoritesPage from '../components/pages/FavoritesPage'
import ForgotPasswordPage from '../components/pages/ForgotPasswordPage'
import ProfileContainer from '../components/pages/profile/ProfileContainer'
import TypeFormPage from '../components/pages/typeform/TypeFormContainer'
import SearchContainer from '../components/pages/search/SearchContainer'
import SigninContainer from '../components/pages/signin/SigninContainer'
import SignupContainer from '../components/pages/signup/SignupContainer'
import { isFeatureDisabled } from './featureFlipping'

function redirectToBeta() {
  return <Redirect to="/beta" />
}

const routes = [
  {
    path: '/',
    render: redirectToBeta,
  },
  {
    component: BetaPage,
    path: '/beta',
    title: 'Bienvenue dans l’avant-première du pass Culture',
  },
  {
    component: ActivationContainer,
    path: '/activation/:token?',
    title: 'Activation',
  },
  {
    component: SigninContainer,
    path: '/connexion',
    title: 'Connexion',
  },
  {
    component: SignupContainer,
    disabled: isFeatureDisabled('WEBAPP_SIGNUP'),
    path: '/inscription',
    title: 'Inscription',
  },
  {
    component: ForgotPasswordPage,
    path: '/mot-de-passe-perdu/:view?',
    title: 'Mot de passe perdu',
  },
  {
    component: TypeFormPage,
    path: '/typeform',
    title: 'Questionnaire',
  },
  /* ---------------------------------------------------
   *
   * MENU ITEMS
   * NOTE les elements ci-dessous sont les elements du main menu
   * Car ils contiennent une propriété `icon`
   *
   ---------------------------------------------------  */
  {
    component: DiscoveryContainer,
    disabled: false,
    icon: 'offres-w',
    path:
      '/decouverte/:offerId?/:mediationId?/:details(details)?/:bookings(reservations)?/:bookingId?/:cancellation(annulation)?/:confirmation(confirmation)?',
    title: 'Les offres',
  },
  {
    component: SearchContainer,
    disabled: false,
    icon: 'search-w',
    path:
      '/recherche/(resultats)?/:option?/:subOption?/:offerId?/:mediationId?/:details(details)?/:bookings(reservations)?/:bookingId?/:cancellation(annulation)?/:confirmation(confirmation)?',
    title: 'Recherche',
  },
  {
    component: MyBookingsContainer,
    disabled: false,
    icon: 'calendar-w',
    path:
      '/reservations/:details(details)?/:bookingId?/:cancellation(annulation)?/:confirmation(confirmation)?',
    title: 'Mes réservations',
  },
  {
    component: FavoritesPage,
    disabled: isFeatureDisabled('FAVORITE_OFFER'),
    icon: 'like-w',
    path: '/favoris',
    title: 'Mes préférés',
  },
  {
    component: ProfileContainer,
    disabled: false,
    icon: 'user-w',
    path: '/profil/:view?/:status?',
    title: 'Mon compte',
  },
  {
    disabled: false,
    href: WEBAPP_CONTACT_EXTERNAL_PAGE,
    icon: 'help-w',
    target: '_blank',
    title: 'Aide',
  },
  {
    disabled: false,
    href:
      'https://pass-culture.gitbook.io/documents/textes-normatifs/mentions-legales-et-conditions-generales-dutilisation-de-lapplication-pass-culture',
    icon: 'txt-w',
    target: '_blank',
    title: 'Mentions légales',
  },
]

export default routes
