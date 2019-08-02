import getAreDetailsVisible from './getAreDetailsVisible'

const getRemovedDetailsUrl = (location, match) => {
  const areDetailsVisible = getAreDetailsVisible(match)
  const { pathname, search } = location

  if (areDetailsVisible) {
    return `${pathname.split('/details')[0]}${search}`
  }
}

export default getRemovedDetailsUrl
