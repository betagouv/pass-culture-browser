import React from 'react'
import { Redirect } from 'react-router-dom'

import ActivationRoutesContainer from '../components/pages/activation/ActivationRoutesContainer'
import BetaPage from '../components/pages/BetaPage'
import MyBookingsPage from '../components/pages/my-bookings'
import DiscoveryContainer from '../components/pages/discovery/DiscoveryContainer'
import FavoritesPage from '../components/pages/FavoritesPage'
import ForgotPasswordPage from '../components/pages/ForgotPasswordPage'
import ProfilePage from '../components/pages/profile'
import SearchContainer from '../components/pages/search/SearchContainer'
import { Signin } from '../components/pages/signin'
import SignupPage from '../components/pages/SignupPage'

import { SUPPORT_EMAIL, SUPPORT_EMAIL_SUBJECT } from './config'

const routes = [
  {
    path: '/',
    render: () => <Redirect to="/beta" />,
  },
  {
    component: BetaPage,
    path: '/beta',
    title: "Bienvenue dans l'avant-première du Pass Culture",
  },
  {
    component: ActivationRoutesContainer,
    path: '/activation/:token?',
    title: 'Activation',
  },
  {
    component: Signin,
    path: '/connexion',
    title: 'Connexion',
  },
  {
    component: SignupPage,
    path: '/inscription',
    title: 'Inscription',
  },
  {
    component: ForgotPasswordPage,
    path: '/mot-de-passe-perdu/:view?',
    title: 'Mot de passe perdu',
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
    // exemple d'URL optimale qui peut être partagée
    // par les sous composants
    path:
      '/decouverte/:offerId?/:mediationId?/:view(booking|verso)?/:bookingId?/:view(cancelled)?',
    title: 'Les offres',
  },
  {
    component: SearchContainer,
    disabled: false,
    icon: 'search-w',
    path:
      '/recherche/(resultats)?/:option?/:subOption?/:offerId?/:mediationIdOrView?/:view(booking)?/:bookingId?',
    title: 'Recherche',
  },
  {
    component: MyBookingsPage,
    disabled: false,
    icon: 'calendar-w',
    path: '/reservations',
    title: 'Mes Réservations',
  },
  {
    component: FavoritesPage,
    disabled: true,
    icon: 'like-w',
    path: '/favoris',
    title: 'Mes Préférés',
  },
  {
    component: ProfilePage,
    disabled: false,
    icon: 'user-w',
    path: '/profil/:view?/:status?',
    title: 'Mon Profil',
  },
  {
    disabled: false,
    href: `mailto:${SUPPORT_EMAIL}?subject=${SUPPORT_EMAIL_SUBJECT}`,
    icon: 'mail-w',
    title: 'Nous contacter',
  },
  {
    disabled: false,
    href:
      'https://pass-culture.gitbook.io/documents/textes-normatifs/mentions-legales-et-conditions-generales-dutilisation-de-lapplication-pass-culture',
    icon: 'txt-w',
    target: '_blank',
    title: 'Mentions Légales',
  },
]

export default routes
