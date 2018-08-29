import React from 'react'
import { Redirect } from 'react-router-dom'

import BetaPage from '../components/pages/BetaPage'
import BookingsPage from '../components/pages/BookingsPage'
import DiscoveryPage from '../components/pages/DiscoveryPage'
import FavoritesPage from '../components/pages/FavoritesPage'
import ProfilePage from '../components/pages/ProfilePage'
import SigninPage from '../components/pages/SigninPage'
import SignupPage from '../components/pages/SignupPage'
import TermsPage from '../components/pages/TermsPage'

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
    component: SigninPage,
    path: '/connexion',
    title: 'Connexion',
  },
  {
    component: SignupPage,
    path: '/inscription',
    title: 'Inscription',
  },
  {
    component: DiscoveryPage,
    // il s'agit de l'URL optimale qui peut être partagée
    path: '/decouverte/:offerId?/:mediationId?/:view(booking|verso)?',
    title: 'Les offres',
  },
  {
    component: FavoritesPage,
    path: '/favoris',
    title: 'Mes favoris',
  },
  {
    component: ProfilePage,
    path: '/profil',
    title: 'Profil',
  },
  {
    component: BookingsPage,
    path: '/reservations',
    title: 'Réservations',
  },
  {
    component: TermsPage,
    path: '/mentions-legales',
    title: 'Mentions Légales',
  },
]

export default routes
