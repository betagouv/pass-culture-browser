import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import FormError from '../../forms/FormError'
import FormFooter from '../../forms/FormFooter'
import InputField from '../../forms/inputs/InputField'
import withResetForm from './withResetForm'

const cancelOptions = {
  className: 'is-white-text',
  disabled: false,
  label: 'Annuler',
  url: '/connexion',
}

const submitOptions = {
  className: 'is-bold is-white-text',
  label: 'OK',
}

export const RawRequestEmailForm = ({ canSubmit, isLoading, formErrors }) => (
  <Fragment>
    <div>
      <div className="logout-form-header">
        <div className="logout-form-title">
          {'Renseignez votre adresse e-mail pour réinitialiser votre mot de passe.'}
        </div>
        <div className="logout-form-mandatory-label">
          {'* Champs obligatoires'}
        </div>
      </div>
      <div>
        <InputField
          disabled={isLoading}
          label="Adresse e-mail"
          name="email"
          placeholder="Ex. : nom@domaine.fr"
          required
          theme="white"
        />
        {formErrors && <FormError customMessage={formErrors} />}
      </div>
    </div>
    <FormFooter
      cancel={cancelOptions}
      submit={{ ...submitOptions, disabled: !canSubmit }}
    />
  </Fragment>
)

RawRequestEmailForm.defaultProps = {
  formErrors: false,
}

RawRequestEmailForm.propTypes = {
  canSubmit: PropTypes.bool.isRequired,
  formErrors: PropTypes.oneOfType([PropTypes.array, PropTypes.bool, PropTypes.string]),
  isLoading: PropTypes.bool.isRequired,
}

export default withResetForm(RawRequestEmailForm, null, '/users/reset-password', 'POST')
