import PropTypes from 'prop-types'
import React, { Fragment, PureComponent } from 'react'
import { Field } from 'react-final-form'

import formatDecimals from '../../../../../utils/numbers/formatDecimals'
import CheckBoxField from '../../../../forms/inputs/CheckBoxField'
import DatePickerField from '../../../../forms/inputs/DatePickerField/DatePickerField'
import SelectField from '../../../../forms/inputs/SelectField'
import DuoOfferContainer from '../../../../layout/DuoOffer/DuoOfferContainer'
import getCalendarProvider from '../../utils/getCalendarProvider'
import parseHoursByStockId from '../../utils/parseHoursByStockId'

class BookingFormContent extends PureComponent {
  componentDidMount() {
    const { invalid, onChange, values } = this.props
    const { price, stockId } = values
    if (stockId) {
      const nextCanSubmitForm = Boolean(!invalid && stockId && price >= 0)
      onChange(nextCanSubmitForm)
    }
  }

  componentDidUpdate(prevProps) {
    const { invalid, onChange, values } = this.props
    const { price, stockId } = values
    if (stockId !== prevProps.values.stockId) {
      const nextCanSubmitForm = Boolean(!invalid && stockId && price >= 0)
      onChange(nextCanSubmitForm)
    }
  }

  handleChangeAndRemoveCalendar = input => (value, event) => {
    event.preventDefault()
    input.onChange(value)
  }

  renderBookingDatePickerField = ({ input }) => {
    const { values } = this.props
    const { value } = input
    const calendarDates = getCalendarProvider(values)
    const calendarLabel = calendarDates.length === 1 ? '' : 'Choisis une date :'
    const dateFormat = 'DD MMMM YYYY'

    return (
      <div className="booking-form-content-datepicker">
        <DatePickerField
          {...input}
          clearable={false}
          dateFormat={dateFormat}
          extraClassName="text-center mb36"
          hideToday
          id="booking-form-date-picker-field"
          includeDates={calendarDates}
          label={calendarLabel}
          name="date"
          onChange={this.handleChangeAndRemoveCalendar(input)}
          readOnly={calendarDates.length === 1}
          selected={value === '' ? null : value}
        />
      </div>
    )
  }

  renderIsDuo = () => {
    const { offerId } = this.props

    return (<DuoOfferContainer
      label="Réserver 2 places"
      offerId={offerId}
            />)
  }

  render() {
    const {
      extraClassName,
      formId,
      handleSubmit,
      isEvent,
      isReadOnly,
      isStockDuo,
      values,
    } = this.props
    const { price, isDuo } = values
    const bookableTimes = parseHoursByStockId(values)
    const hasOneBookableTime = bookableTimes.length === 1
    const hasBookableTimes = bookableTimes.length > 0
    const hourLabel = hasOneBookableTime ? '' : 'Choisis une heure :'
    const displayPriceWarning = !isEvent || (bookableTimes && hasBookableTimes)
    const computedPrice = isDuo ? price * 2 : price
    const formattedComputedPrice = formatDecimals(computedPrice)
    return (
      <form
        className={`${extraClassName} ${isReadOnly ? 'is-read-only' : ''}`}
        id={formId}
        onSubmit={handleSubmit}
      >
        {isEvent && (
          <Fragment>
            <Field
              name="date"
              render={this.renderBookingDatePickerField}
            />
            {bookableTimes && hasBookableTimes && (
              <SelectField
                className="text-center"
                id="booking-form-time-picker-field"
                label={hourLabel}
                name="time"
                options={bookableTimes}
                placeholder="Heure et prix"
                readOnly={hasOneBookableTime}
              />
            )}
            {isStockDuo && (
              <div className="isDuo">
                <CheckBoxField
                  name="isDuo"
                  required={false}
                >
                  {this.renderIsDuo()}
                </CheckBoxField>
              </div>
            )}
          </Fragment>
        )}

        {displayPriceWarning && (
          <p className="text-center fs22">
            <span className="is-block">
              {'Tu es sur le point de réserver'}
            </span>
            <span className="is-block">
              {`cette offre pour ${formattedComputedPrice} €.`}
            </span>
          </p>
        )}
      </form>
    )
  }
}

BookingFormContent.defaultProps = {
  extraClassName: '',
  isEvent: false,
  isReadOnly: false,
  isStockDuo: false,
  offerId: '',
}

BookingFormContent.propTypes = {
  extraClassName: PropTypes.string,
  formId: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  isEvent: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isStockDuo: PropTypes.bool,
  offerId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.shape().isRequired,
}

export default BookingFormContent
