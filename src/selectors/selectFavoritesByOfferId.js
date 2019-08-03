import createCachedSelector from 're-reselect'

function mapArgsToCacheKey(state, offerId) {
  return offerId || ''
}

export const selectFavoritesById = createCachedSelector(
  state => state.data.favorites,
  (state, offerId) => offerId,
  (favorites, offerId) => favorites.filter(favorite =>
    favorite.offerId === offerId)
)(mapArgsToCacheKey)

export default selectFavoritesById
