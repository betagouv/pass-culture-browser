import React from 'react'

const InvalidLink = () => (
  <main
    role="main"
    id="activation-link-error-page"
    className="pc-main padded-2x flex-rows flex-center"
  >
    <div className="flex-center flex-row">
      <p className="fs20">Le lien sur lequel vous avez cliqué est invalide.</p>
    </div>
    <div className="flex-center flex-row padded">
      <a
        className="no-background border-all rd4 py12 px18 is-inline-block is-white-text text-center fs16"
        href="/connexion"
      >
        <span>Me connecter</span>
      </a>
    </div>
  </main>
)
export default InvalidLink
