import React, { Component } from 'react'

import FormInput from './FormInput'

class PriceItem extends Component {
  render () {
    console.log('his.props', this.props)
    const { endDate, startDate, size, value } = this.props
    return (
      <div className='price-item mb3 col-9 mx-auto p2'>

        <label className='mr1'>
          début
        </label>
        <FormInput className='input price-item__form-input mb1'
          defaultValue={startDate}
          name='startDate'
        />
        <br />

        <label className='mr1'>
          fin
        </label>
        <FormInput className='input price-item__form-input mb1'
          defaultValue={endDate}
          name='endDate'
        />
        <br />

        <label className='mr1'>
          groupe
        </label>
        <FormInput className='input price-item__form-input mb1'
          defaultValue={size}
          name='size'
        />
        <br />

        <label className='mr1'>
          prix
        </label>
        <FormInput className='input price-item__form-input'
          defaultValue={value}
          name='value'
        />

      </div>
    )
  }
}

export default PriceItem
