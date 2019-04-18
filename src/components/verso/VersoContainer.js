/* eslint
  semi: [2, "always"]
  react/jsx-one-expression-per-line: 0 */
import get from 'lodash.get';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { ROOT_PATH } from '../../utils/config';
import Verso from './Verso';
import { getHeaderColor } from '../../utils/colors';
import currentRecommendationSelector from '../../selectors/currentRecommendation';

const backgroundImage = `url('${ROOT_PATH}/mosaic-k.png')`;
export const getContentInlineStyle = (isTuto, backgroundColor) => {
  let result = { backgroundImage };
  if (isTuto && backgroundColor) result = { ...result, backgroundColor };
  return result;
};

export const checkIsTuto = recommendation => {
  const tutoIndex = get(recommendation, 'mediation.tutoIndex');
  const result = Boolean(typeof tutoIndex === 'number');
  return result;
};

export const getOfferVenue = recommendation =>
  get(recommendation, 'offer.venue.name', null);

export const getOfferName = recommendation =>
  get(recommendation, 'offer.name', null);

export const getBackgroundColor = recommendation => {
  const firstThumbDominantColor = get(recommendation, 'firstThumbDominantColor');
  const result = getHeaderColor(firstThumbDominantColor);
  return result;
};

export const mapStateToProps = (state, { match }) => {
  const { params } = match;
  const { mediationId, offerId } = params;

  const recommendation = currentRecommendationSelector(
    state,
    offerId,
    mediationId
  );

  const backgroundColor = getBackgroundColor(recommendation);
  const isTuto = checkIsTuto(recommendation);
  const offerVenue = getOfferVenue(recommendation);
  const offerName = getOfferName(recommendation);

  const contentInlineStyle = getContentInlineStyle(isTuto, backgroundColor);

  const draggable = get(state, 'card.draggable');
  const areDetailsVisible = get(state, 'card.areDetailsVisible');

  return {
    areDetailsVisible,
    backgroundColor,
    contentInlineStyle,
    draggable,
    isTuto,
    mediationId,
    offerName,
    offerVenue,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps)
  // NOTE a tester d'utiliser React.memo ici
  // en tant que HOC en plus de redux
)(Verso);
