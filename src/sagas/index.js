import {
  watchDataActions,
  watchErrorsActions,
  watchModalActions,
  watchUserActions,
} from 'pass-culture-shared'
import { all } from 'redux-saga/effects'

import { API_URL } from '../utils/config'

function* rootSaga() {
  yield all([
    watchModalActions(),
    watchDataActions({ timeout: 5000, url: API_URL }),
    watchErrorsActions(),
    watchUserActions(),
  ])
}

export default rootSaga
