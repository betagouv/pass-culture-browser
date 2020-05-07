import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import { MesInformationsField } from '../forms/fields/MesInformationsField'

class MesInformations extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      publicName: props.user.publicName,
      errors: null,
    }
    this.publicNameInputRef = React.createRef()
  }

  handlePublicNameChange = event => {
    const newValue = event.target.value
    this.setState({ publicName: newValue })
  }

  handleBlur = event => {
    const { handleSubmit, getFormValuesByNames } = this.props
    const formValuesByNames = getFormValuesByNames(event)
    handleSubmit(formValuesByNames, this.handleSubmitFail, this.handleSubmitSuccess)
  }

  handleSubmitFail = (state, action) => {
    this.setState({ errors: { ...action.payload.errors } })
    this.publicNameInputRef.current.focus()
    this.publicNameInputRef.current.select()
  }

  handleSubmitSuccess = () => {
    this.setState({ errors: null })
  }

  render() {
    const { user, getDepartment } = this.props
    const { errors, publicName } = this.state
    return (
      <section>
        <Link
          className="mi-link"
          to="/profil/informations"
        >
          <img
            alt=""
            src="/icons/ico-informations.svg"
          />
          <div className="mi-link-label">
            {'Informations personnelles'}
          </div>
          <img
            alt=""
            src="/icons/ico-next-lightgrey.svg"
          />
        </Link>
        <header className="mes-informations-title-container">
          <h2 className="mes-informations-title">
            {'Mes informations'}
          </h2>
        </header>
        <form>
          <MesInformationsField
            errors={errors && errors.publicName}
            id="identifiant"
            label="Identifiant"
            maxLength={255}
            minLength={3}
            name="publicName"
            onBlur={this.handleBlur}
            onChange={this.handlePublicNameChange}
            ref={this.publicNameInputRef}
            required
            value={publicName}
          />
          <MesInformationsField
            disabled
            id="name"
            label="Nom et prénom"
            name="name"
            value={`${user.firstName} ${user.lastName}`}
          />
          <MesInformationsField
            disabled
            id="email"
            label="Adresse e-mail"
            name="email"
            value={user.email}
          />
          <MesInformationsField
            disabled
            id="departementCode"
            label="Département de résidence"
            name="departementCode"
            value={getDepartment(user.departementCode)}
          />
        </form>
        <div className="mi-field">
          <label>
            {'Mot de passe'}
          </label>
          <Link
            className="mi-field-button"
            to="/profil/password"
          >
            {'Changer mon mot de passe'}
          </Link>
        </div>
      </section>
    )
  }
}

MesInformations.propTypes = {
  getDepartment: PropTypes.func.isRequired,
  getFormValuesByNames: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  user: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]).isRequired,
}

export default MesInformations
