import React from 'react'

import Icon from './Icon'
import withSelectors from '../hocs/withSelectors'
import { API_URL } from '../utils/config'

const OfferCard = ({ bargainPrices,
  id,
  name,
  sellersFavorites,
  sortedPrices,
  work
}) => {
  return (
    <div className='offer-card'>
      <img alt=''
        className='offerPicture'
        src={`${API_URL}/thumbs/${work.id}`} />
      {
        sellersFavorites && sellersFavorites.length > 0 &&
        <Icon name='favorite-outline' />
      }
      {
        bargainPrices && bargainPrices.length > 0 &&
        <Icon name='error' />
      }
      { sortedPrices && sortedPrices[0].value }&nbsp;€&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; à {(20-id)*15}m
      <div className='offerName'>
        { name || work.name }
      </div>
    </div>
  )
}

export default withSelectors({
  bargainPrices: [
    ownProps => ownProps.prices,
    prices => prices.filter(p => p.groupSize>1)
  ],
  sortedPrices: [
    ownProps => ownProps.prices,
    prices => prices.sort((p1, p2) => p1.value > p2.value)
  ]
})(OfferCard)
