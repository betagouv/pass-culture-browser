import classnames from 'classnames'
import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import Recto from './Recto'
import Verso from './Verso'

import selectHeaderColor from '../selectors/headerColor'

class Card extends Component {

  // TODO: handleSetRead

  // handleSetRead = props => {
  //   // unpack and check
  //   const { content,
  //     handleSetRead,
  //     item,
  //     readTimeout
  //   } = props
  //   const { isRead } = this.state
  //   if (!content || isRead) { return }
  //   // wait a bit to trigger the fact that we stay on the same card
  //   this.readTimeout = setTimeout(() => {
  //     // make sure we are not going to do it circularly
  //     this.setState({ isRead: true })
  //     // check that style is still current
  //     item === 0 && handleSetRead && handleSetRead(props)
  //   }, readTimeout)
  // }

  render () {
    const {
      userMediation,
      headerColor,
      position,
    } = this.props
    return (
      <div
        className={classnames({
          card: true,
          current: position === 'current',
        })}
        style={{
          transform: `translate(${get(userMediation, 'index') * 100}vw, 0)`,
        }}>
          <Recto {...userMediation} />
          <div className='gradient' style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%,${headerColor} 25%,${headerColor} 100%)`,
          }} />
          { position === 'current' &&  <Verso /> }
      </div>
    )
  }
}

Card.defaultProps = {
  isSetRead: true,
  readTimeout: 3000,
}

export default connect(
  state => ({
    isFlipped: state.verso.isFlipped,
    headerColor: selectHeaderColor(state),
  }))(Card)
