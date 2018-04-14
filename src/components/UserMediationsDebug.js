import React from 'react'
import { connect } from 'react-redux'

const UserMediationsDebug = ({ afterLimit,
  aroundIndex,
  beforeLimit,
  countAfterSync,
  countBeforeSync,
  isLoadingAfter,
  isLoadingBefore,
  userMediations
}) => {
  return (
    <div className='user-mediations-debug absolute left-0 ml2 p2'>
        ({isLoadingBefore ? '?' : ' '}{beforeLimit + 1}) {aroundIndex + 1}{' '}
        ({afterLimit + 1} {isLoadingAfter ? '?' : ' '}) / {userMediations && userMediations.length + 2}
    </div>
  )
}

export default connect(
  state => ({ userMediations: state.data.userMediations })
)(UserMediationsDebug)
