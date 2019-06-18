import { combineReducers } from 'redux'
import { modals } from 'redux-react-modals'

import data from './data'
import geolocation from './geolocation'
import { menu } from './menu'
import { share } from './share'
import splash from './splash'
import card from './card'
import { overlay } from './overlay'
import token from './token'
import { lastRecommendationsRequestTimestamp } from './logs'

const rootReducer = combineReducers({
  card,
  data,
  geolocation,
  lastRecommendationsRequestTimestamp,
  menu,
  modals,
  overlay,
  share,
  splash,
  token,
})

export default rootReducer
