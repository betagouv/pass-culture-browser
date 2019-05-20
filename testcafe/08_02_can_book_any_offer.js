import { Selector } from 'testcafe'

import { fetchSandbox } from './helpers/sandboxes'
import getMenuWalletValue from './helpers/getMenuWalletValue'
import getPageUrl from './helpers/getPageUrl'
import { ROOT_PATH } from '../src/utils/config'
import createUserRoleFromUserSandbox from './helpers/createUserRoleFromUserSandbox'

let offerPage = null
let offerBookingPage = null
let previousWalletValue = null
const discoverURL = `${ROOT_PATH}decouverte`

const alreadyBookedOfferButton = Selector('#verso-already-booked-button')
const bookOfferButton = Selector('#verso-booking-button')
const bookingItem = Selector('.booking-item')
const closeMenu = Selector('#main-menu-close-button')
const menuReservations = Selector('.navlink').withText('Mes Réservations')
const openMenu = Selector('#deck-footer .profile-button')
const openVerso = Selector('#deck-open-verso-button')
const sendBookingButton = Selector('#booking-validation-button')

let userRole

fixture("08_02_01 L'user peut réserver n'importe quelle offre").beforeEach(
  async t => {
    if (!userRole) {
      userRole = await createUserRoleFromUserSandbox(
        'webapp_08_booking',
        'get_existing_webapp_user_can_book_digital_offer'
      )
    }
    const { mediationId, offer } = await fetchSandbox(
      'webapp_08_booking',
      'get_non_free_thing_offer_with_active_mediation'
    )
    offerPage = `${discoverURL}/${offer.id}/${mediationId}`
    offerBookingPage = `${offerPage}/booking`
    await t.useRole(userRole).navigateTo(offerPage)
  }
)

test("J'ai de l'argent sur mon pass", async t => {
  await t.click(openMenu).wait(500)
  previousWalletValue = await getMenuWalletValue()
  await t
    .expect(previousWalletValue)
    .gt(0)
    .click(closeMenu)
})

test("Je peux réserver l'offre", async t => {
  await t
    .click(openVerso)
    .wait(500)
    .expect(alreadyBookedOfferButton.exists)
    .notOk()
    .expect(bookOfferButton.textContent)
    .contains(`J'y vais!`)
    .click(bookOfferButton)
    .expect(getPageUrl())
    .eql(offerBookingPage)
    .expect(sendBookingButton.exists)
    .ok()
    .click(sendBookingButton)
})

test("Je vois l'offre dans 'mes réservations' et je peux cliquer dessus pour revenir à la page 'Mes réservations'", async t => {
  await t
    .click(openMenu)
    .click(menuReservations)
    .expect(getPageUrl())
    .eql(`${ROOT_PATH}reservations`)
    .click(bookingItem)
    .expect(getPageUrl())
    .match(/\/decouverte\/.*\/verso$/)
})

// TODO Ecrire un test pour l'annulation d'une réservation
