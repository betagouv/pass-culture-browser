import { Selector } from 'testcafe'

import { ROOT_PATH } from '../src/utils/config'
import { fetchSandbox } from './helpers/sandboxes'

const forgotPasswordLink = Selector('.lf-lost-password')
const inputUserEmail = Selector('#email')
const sendTokenButton = Selector('footer > button')
const pageH2Title = Selector('.logout-form-title')

const userNewPasswordInput = Selector('#newPassword')
const userNewPasswordConfirmInput = Selector('#newPasswordConfirm')
const submitNewPasswordButton = Selector("button[type='submit']")

const baseURL = `${ROOT_PATH}connexion`

fixture("En étant déconnecté de l'application")

test('je clique sur "mot de passe oublié", je remplis le formulaire avec une adresse email et je suis redirigé·e vers la page de confirmation', async t => {
  // given
  const { user } = await fetchSandbox(
    'webapp_09_lost_password',
    'get_webapp_user_with_not_validated_password'
  )
  const { email } = user

  // when
  await t.navigateTo(baseURL).click(forgotPasswordLink)

  let location = await t.eval(() => window.location)
  await t
    .expect(location.pathname)
    .eql('/mot-de-passe-perdu')
    .expect(pageH2Title.innerText)
    .eql('Renseigne ton adresse e-mail pour réinitialiser ton mot de passe.')

  // when
  await t.typeText(inputUserEmail, email).click(sendTokenButton)

  // then
  location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/mot-de-passe-perdu/succes')
})

test('je clique sur le lien reçu par email, je saisis mon nouveau mot de passe, et je suis redirigé·e vers la page de confirmation', async t => {
  // given
  const { user } = await fetchSandbox(
    'webapp_09_lost_password',
    'get_webapp_user_with_not_validated_password'
  )
  const { resetPasswordToken } = user
  const url = `${ROOT_PATH}mot-de-passe-perdu?token=${resetPasswordToken}`
  // when
  await t.navigateTo(url)

  await t
    .typeText(userNewPasswordInput, 'user@AZERTY123')
    .typeText(userNewPasswordConfirmInput, 'user@AZERTY123')
    .click(submitNewPasswordButton)

  // then
  const location = await t.eval(() => window.location)
  await t
    .expect(location.pathname)
    .eql('/mot-de-passe-perdu/succes')
    .expect(location.search)
    .eql(`?token=${resetPasswordToken}`)
})
