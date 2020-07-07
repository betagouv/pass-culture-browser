import NoItems from '../../../layout/NoItems/NoItems'
import Teaser from '../../../layout/Teaser/TeaserContainer'
import React, { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import LoaderContainer from '../../../layout/Loader/LoaderContainer'

const MyFavoritesList = ({ myFavorites, loadMyFavorites, persistDeleteFavorites }) => {
  let [isLoading, setIsLoading] = useState(false)
  let [hasError, setHasError] = useState(false)
  let [isEditMode, setIsEditMode] = useState(false)
  let [offerIds, setOfferIds] = useState([])

  useEffect(() => {
    loadMyFavorites(handleFail, handleSuccess)
  }, [])

  const handleFail = () => {
    setHasError(true)
    setIsLoading(true)
  }

  const handleSuccess = () => {
    setIsLoading(false)
  }

  const showFailModal = () => {
    toast.error('La suppression d’un favori a échoué, réessaie plus tard.')
  }

  function deleteFavorites() {
    persistDeleteFavorites(showFailModal, offerIds)
    setOfferIds([])
  }

  function handleEditMode() {
    setIsEditMode(!isEditMode)
    setOfferIds([])
  }

  function onToggle(offerId) {
    let newOfferIdsToDelete = []
    newOfferIdsToDelete = newOfferIdsToDelete.concat(offerIds)

    if (newOfferIdsToDelete.includes(offerId)) {
      newOfferIdsToDelete.splice(newOfferIdsToDelete.indexOf(offerId), 1)
    } else {
      newOfferIdsToDelete.push(offerId)
    }

    setOfferIds(newOfferIdsToDelete)
  }

  const hasNoFavorite = myFavorites.length === 0
  const disabledButtonWhenNoFavoritesSelected = offerIds.length === 0 ? 'disabled' : ''

  return (
    <Fragment>
      {isLoading && <LoaderContainer
        hasError={hasError}
        isLoading={isLoading}
                    />}

      {!isLoading && (
        <main className="teaser-page">
          <h1 className="teaser-main-title">
            {'Favoris'}
          </h1>
          {hasNoFavorite ? (
            <NoItems sentence="Dès que tu auras ajouté une offre à tes favoris, tu la retrouveras ici." />
          ) : (
            <section>
              {isEditMode ? (
                <div className="mf-edit">
                  <button
                    className="mf-delete-btn"
                    disabled={disabledButtonWhenNoFavoritesSelected}
                    onClick={deleteFavorites}
                    type="button"
                  >
                    {'Supprimer la sélection'}
                  </button>
                  <button
                    className="mf-done-btn"
                    onClick={handleEditMode}
                    type="button"
                  >
                    {'Terminer'}
                  </button>
                </div>
              ) : (
                <div className="mf-done">
                  <button
                    className="mf-edit-btn"
                    onClick={handleEditMode}
                    type="button"
                  >
                    {'Modifier'}
                  </button>
                </div>
              )}
              <ul>
                {myFavorites.map(myFavorite => (
                  <Teaser
                    handleToggleTeaser={onToggle}
                    isEditMode={isEditMode}
                    item={myFavorite}
                    key={myFavorite.id}
                  />
                ))}
              </ul>
            </section>
          )}
        </main>
      )}
    </Fragment>
  )
}

MyFavoritesList.defaultProps = {
  myFavorites: [],
}

MyFavoritesList.propTypes = {
  loadMyFavorites: PropTypes.func.isRequired,
  myFavorites: PropTypes.arrayOf(PropTypes.shape()),
  persistDeleteFavorites: PropTypes.func.isRequired,
}

export default MyFavoritesList
