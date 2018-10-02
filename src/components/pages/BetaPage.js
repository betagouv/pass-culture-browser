/* eslint
  react/jsx-one-expression-per-line: 0 */
import React from 'react'
import { Link } from 'react-router-dom'

const BetaPage = () => (
  <div id="beta-page" className="page pc-theme-gradient flex-rows ">
    <main role="main" className="pc-main padded flex-rows flex-center flex-0">
      <h1 className="text-left fs32">
        <span className="is-bold is-italic is-block">Bienvenue</span>
        <span className="is-italic is-block is-semi-bold">
          dans la version beta
        </span>
        <span className="is-italic is-block">du Pass Culture</span>
      </h1>
      <p className="text-left is-italic is-medium mt36 fs22">
        <span className="is-block">
          Et merci de votre participation pour nous aider à
          l&apos;améliorer&nbsp;!
        </span>
      </p>
    </main>
    <footer role="navigation" className="pc-footer flex-columns flex-end">
      <Link to="/inscription" className="flex-center items-center">
        <span className="fs32 is-italic is-semi-bold mr7">
          C&apos;est par là
        </span>
        <span
          aria-hidden="true"
          className="pc-icon icon-ico-next"
          title="C&apos;est par là"
        />
      </Link>
    </footer>
  </div>
)

export default BetaPage
