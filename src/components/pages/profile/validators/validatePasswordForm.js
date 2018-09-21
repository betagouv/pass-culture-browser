/**
 * USER PROFILE PAGE
 * Fichier de validation du formulaire du changement de mot de passe
 */
import { FORM_ERROR } from 'final-form'
import isEqual from 'lodash.isequal'

import { isPassword } from '../../../../utils/strings'

const FORM_KEYS = ['oldPassword', 'newPassword', 'newPasswordConfirm']
const DEFAULT_REQUIRED_ERROR = 'Ce champs est requis'
const ERROR_IS_NOT_MATCHING_CONFIRM = 'Les mots de passe ne correspondent pas'
const ERROR_IS_EQUAL_ORIGINAL =
  'Votre nouveau mot de passe ne doit pas correspondre à votre ancien mot de passe'

const validateEqualities = values => {
  const isMatchingOriginal =
    values.newPassword &&
    values.oldPassword &&
    isEqual(values.newPassword, values.oldPassword)
  // si le nouveau mot de passe correspond à l'ancien
  if (isMatchingOriginal) {
    return { [FORM_ERROR]: ERROR_IS_EQUAL_ORIGINAL }
  }
  const isMatchingConfirm =
    values.newPassword &&
    values.newPasswordConfirm &&
    isEqual(values.newPassword, values.newPasswordConfirm)
  // si le nouveau mot de passe ne correspond pas à la confirmation
  if (!isMatchingConfirm) {
    return { [FORM_ERROR]: ERROR_IS_NOT_MATCHING_CONFIRM }
  }
  return {}
}

const validatePasswordForm = formValues => {
  let errors = FORM_KEYS.reduce((acc, key) => {
    const value = formValues[key]
    // NOTE: Les anciens MDP durant la phase beta
    // n'avait pas de règle de validation
    const isBetaPhasePassword = key === 'oldPassword'
    if (!isBetaPhasePassword && !isPassword(value))
      return { ...acc, [key]: DEFAULT_REQUIRED_ERROR }
    return acc
  }, {})
  const hasErrors = Object.keys(errors).length > 0
  // si pas d'erreurs on vérifie les égalités des champs
  if (!hasErrors) errors = validateEqualities(formValues)
  return errors
}

export default validatePasswordForm
