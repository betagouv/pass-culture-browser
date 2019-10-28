import * as Sentry from '@sentry/browser'

import { ENVIRONMENT_NAME, SENTRY_SERVER_URL_FOR_WEBAPP, APP_VERSION } from './config'

const initSentry = () => {
  Sentry.init({
    dsn: SENTRY_SERVER_URL_FOR_WEBAPP,
    environment: ENVIRONMENT_NAME,
    release: APP_VERSION,
  })
}

export default initSentry
