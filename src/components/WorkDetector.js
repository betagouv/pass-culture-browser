import classnames from 'classnames'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import Select from './Select'
import { assignForm } from '../reducers/form'
import { getCurrentWork, requestData } from '../reducers/request'

class WorkDetector extends Component {
  constructor () {
    super()
    this.state = {
      identifier: '',
      selectedCategory: null
    }
  }
  onInputChange = ({ target: { value } }) => {
    this.setState({ identifier: value })
  }
  onOptionClick = ({ target: { value } }) => {
    this.props.assignForm({ work: { category: value } })
    this.setState({ selectedCategory: value })
  }
  onSearchClick = () => {
    const { identifier } = this.state
    this.props.requestData('PUT', `works/isbn:${identifier}`)
  }
  render () {
    const { identifier, selectedCategory } = this.state
    const { options, work } = this.props
    const isDisabled = identifier.trim() === ''
    return (
      <div className='work-detector p2'>
        {
          !work && <Select className='select mb2'
            defaultLabel='-- select a type --'
            onOptionClick={this.onOptionClick}
            options={options}
            value={selectedCategory}
          />
        }
        {
          selectedCategory && (
            <div className='mb2 sm-col-6 mx-auto'>
              <label className='block left-align mb1'>
                {
                  selectedCategory === 'book'
                    ? 'ISBN (203583418X for e.g.)'
                    : 'Identifiant'
                }
              </label>
              <div className='flex items-center'>
                <input className='input mr2 left-align'
                  onChange={this.onInputChange}
                  value={identifier}
                />
                <button className={classnames('button button--alive', {
                    'button--disabled': isDisabled
                  })}
                  disabled={isDisabled}
                  onClick={this.onSearchClick}
                >
                  Recherche
                </button>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

WorkDetector.defaultProps = {
  options: [
    { value: 'book', label: 'Book' },
    { value: 'theater', label: 'Theater' }
  ]
}

export default connect(
  state => ({ work: getCurrentWork(state) }),
  { assignForm, requestData }
)(WorkDetector)
