import { API_URL } from '../services/api/constants';

export const convertStateToStrapiQuery = (state) => {

  const strapiParams = new URLSearchParams();
  strapiParams.set('populate[country][populate]', '*');

  if(state.direction) {
    strapiParams.set('filters[country][slug][$eq]', state.direction);
  }

  strapiParams.set('filters[priceForPerson][$gte]', state.price.min);
  strapiParams.set('filters[priceForPerson][$lte]', state.price.max);

  const appendStrapiHotelsArray = (path, arrayData) => {
    arrayData.forEach((value, index) => {
      strapiParams.set(`filters${path}[$in][${index}]`, value);
    })
  };

    const appendStrapiOffersArray = (path, arrayData) => {
    arrayData.forEach((value, index) => {
      strapiParams.set(`filters[offers]${path}[$in][${index}]`, value);
      strapiParams.set(`populate[offers][filters]${path}[$in][${index}]`, value);
    })
  };

  // if(state.accomondation.length) appendStrapiHotelsArray('[stars]', state.accomondation);
  if(state.meal.length) appendStrapiOffersArray('[mealType]', state.meal);
  if(state.tourComposition.length) appendStrapiOffersArray('[tourComposition]', state.tourComposition);
  if(state.departureCity.length) appendStrapiOffersArray('[departureCitySlug]', state.departureCity);
  if(state.regions.length) appendStrapiHotelsArray('[region][slug]', state.regions);
  
  return strapiParams.toString();
}

