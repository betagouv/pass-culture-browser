import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import Icon from '../components/Icon'
import withSelectors from '../hocs/withSelectors'
import { requestData } from '../reducers/data'
import { API_URL } from '../utils/config'

class ClientOfferPage extends Component {
  componentWillMount = () => {
    const { requestData, offerId } = this.props;
    requestData('GET', 'offers/' + offerId)
  }

  render = () => {
    const { bargainPrices, offer, sortedPrices } = this.props;
    return (
      <main className='page client-offer-page flex flex-column'>
        {
        offer &&
          (
          <div>
            <h2>
              { offer.name || offer.work.name }
              {
                offer.sellersFavorites && offer.sellersFavorites.length > 0 &&
                <Icon name='favorite-outline' />
              }
              { bargainPrices && bargainPrices.length > 1 && <Icon name='error' /> }
            </h2>
            <img alt='' className='offerPicture' src={ API_URL+'/thumbs/'+offer.work.id } />
            { offer.description }
            <div className='clearfix' />
            <div className='sellerInfos'>
              <b>{ sortedPrices && sortedPrices[0].value }&nbsp;€</b><br/>
              { offer.work.type==="book" ? "À la librairie" : "À 20h au théatre" } Tartenshmoll<br/>
              2 rue des Lilas (à {(20-offer.id)*15}m)<br/>
              <img alt='' src='/map.png' /><br/>
              { offer.work.type==='book' ? <span>Ouvert jusqu&apos;à 19h aujourd&quot;hui<br/><a href=''>voir tous les horaires</a></span>
                                        : <span><br/>Dates&nbsp;:<br/><img alt='' src='/calendrier.png' /><br/></span> }
            </div>

            { offer.prices.length>1 &&
                (
                <div>
                  <h3>Tarifs Pass Culture</h3>
                  <ul className='prices'>
                    {
                      offer.prices.map(price => (
                         <li>
                            {price.value} €
                            {price.groupSize > 1 && ' si vous y allez avec '+(price.groupSize-1)+' amis !'}
                         </li>
                       ))
                    }
                  </ul>
                </div>
                )
            }
          </div>
          )
        }
      </main>
    )
  }
}

export default compose(
  withSelectors({
    bargainPrices: [
      ownProps => ownProps.prices,
      prices => prices.filter(p => p.groupSize>1)
    ],
    sortedPrices: [
      ownProps => ownProps.prices,
      prices => prices.sort((p1, p2) => p1.value > p2.value)
    ]
  }),
  connect(
    (state, ownProps) => ({
      offer: state.data['offers/'+ownProps.offerId] &&
        state.data['offers/'+ownProps.offerId][0]
    }),
    { requestData }
  )
)(ClientOfferPage)
