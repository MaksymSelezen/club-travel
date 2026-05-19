import { API_URL } from '../services/api/constants';

export const convertStateToStrapiQuery = (state) => {

  const strapiParams = new URLSearchParams();

  if(state.direction) {
    strapiParams.set('populate', 'country');
    strapiParams.set('filters[country][slug][$eq]', state.direction);
  }

  strapiParams.set('filters[priceForPerson][$gte]', state.price.min);
  strapiParams.set('filters[priceForPerson][$lte]', state.price.max);

  const appendStrapiArray = (path, arrayData) => {
    arrayData.forEach((value, index) => {
      strapiParams.set(`filters${path}[$in][${index}]`, value);
    })
  };

  // if(state.accomondation.length) appendStrapiArray('accommodation', state.accomondation);
  // if(state.meal.length) appendStrapiArray('meal', state.meal);
  // if(state.tourComposition.length) appendStrapiArray('tourComposition', state.tourComposition);
  // if(state.departureCity.length) appendStrapiArray('departureCity', state.departureCity);
  if(state.regions.length) appendStrapiArray('[region][slug]', state.regions);
  
  return strapiParams.toString();
}

