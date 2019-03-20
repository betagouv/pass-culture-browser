/* eslint
  react/jsx-one-expression-per-line: 0 */
import PropTypes from 'prop-types'
import React from 'react'

import { withCurrentUser } from '../../hocs'
import { ROOT_PATH } from '../../../utils/config'

import NavigationFooter from '../../layout/NavigationFooter'
import PageHeader from '../../layout/PageHeader'
import MesInformations from './MesInformations'
import MonAvatar from './MonAvatar'
import MonPassCulture from './MonPassCulture'

const BACKGROUND_IMAGE = `url('${ROOT_PATH}/mosaic-k.png')`

export const RawProfileMainView = ({ config, currentUser }) => (
  <div
    id="profile-page-main-view"
    className="pc-page-view pc-theme-default flex-rows"
  >
    <PageHeader useClose theme="red" title="Mon profil" />
    <main
      role="main"
      className="pc-main is-clipped is-relative"
      style={{ backgroundImage: BACKGROUND_IMAGE }}
    >
      <div className="pc-scroll-container">
        {currentUser && <MonAvatar />}
        <div id="profile-page-user-passculture">
          <h3 className="dotted-bottom-primary pb8 px12">
            <span className="is-italic is-uppercase is-primary-text">
              MON PASS CULTURE
            </span>
          </h3>
          <div className="mt12 px12">{currentUser && <MonPassCulture />}</div>
        </div>
        <MesInformations fields={config} />
      </div>
    </main>
    <NavigationFooter theme="white" className="dotted-top-red" />
  </div>
)

RawProfileMainView.propTypes = {
  config: PropTypes.array.isRequired,
  currentUser: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
    .isRequired,
}

export default withCurrentUser(RawProfileMainView)
