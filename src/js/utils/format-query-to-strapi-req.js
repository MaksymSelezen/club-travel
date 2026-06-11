import { API_URL } from '../services/api/constants';
import {
  PRICE_DEFAULT_MAX,
  PRICE_DEFAULT_MIN,
} from '@/js/components/tour-search/constants.js';

export const convertStateToStrapiQuery = state => {
  const strapiParams = new URLSearchParams();

  strapiParams.set('populate[hotelDescription][populate]', '*');
  strapiParams.set('populate[hotelFeatures][populate]', '*');

  strapiParams.set('populate[country][fields][0]', 'name');
  strapiParams.set('populate[country][fields][1]', 'slug');

  strapiParams.set('populate[region][fields][0]', 'name');

  strapiParams.set('populate[gallery][fields][0]', 'url');
  strapiParams.set('populate[gallery][fields][1]', 'alternativeText');

  strapiParams.set('populate[offers][fields][0]', 'price');
  strapiParams.set('populate[offers][fields][1]', 'mealType');
  strapiParams.set('populate[offers][fields][2]', 'tourComposition');
  strapiParams.set('populate[offers][fields][3]', 'departureCitySlug');
  strapiParams.set('populate[offers][fields][4]', 'duration');
  strapiParams.set('populate[offers][fields][6]', 'beachDistance');
  strapiParams.set('populate[offers][fields][7]', 'date');
  strapiParams.set('populate[offers][fields][8]', 'type');
  strapiParams.set('populate[offers][fields][9]', 'seatsOnThePlane');

  if (state.direction) {
    strapiParams.set('filters[country][slug][$eq]', state.direction);
  }

  if (state.duration) {
    const targetDuration = Number(state.duration);

    const tolerance = 2;
    const minDays = Math.max(1, targetDuration - tolerance);
    const maxDays = targetDuration + tolerance;

    strapiParams.set('filters[offers][duration][$gte]', minDays.toString());
    strapiParams.set('filters[offers][duration][$lte]', maxDays.toString());

    strapiParams.set(
      'populate[offers][filters][duration][$gte]',
      minDays.toString(),
    );
    strapiParams.set(
      'populate[offers][filters][duration][$lte]',
      maxDays.toString(),
    );
  }

  const priceMin = Number(state.price?.min);
  const priceMax = Number(state.price?.max);

  strapiParams.set(
    'filters[priceForPerson][$gte]',
    Number.isFinite(priceMin) ? priceMin : PRICE_DEFAULT_MIN,
  );
  strapiParams.set(
    'filters[priceForPerson][$lte]',
    Number.isFinite(priceMax) ? priceMax : PRICE_DEFAULT_MAX,
  );

  const appendStrapiHotelsArray = (path, arrayData) => {
    arrayData.forEach((value, index) => {
      strapiParams.set(`filters${path}[$in][${index}]`, value);
    });
  };
  const appendStrapiOffersArray = (field, arrayData) => {
    arrayData.forEach((value, index) => {
      strapiParams.set(`filters[offers][${field}][$in][${index}]`, value);
      strapiParams.set(
        `populate[offers][filters][${field}][$in][${index}]`,
        value,
      );
    });
  };

  if (state.meal.length) appendStrapiOffersArray('mealType', state.meal);
  if (state.tourComposition.length)
    appendStrapiOffersArray('tourComposition', state.tourComposition);
  if (state.departureCity.length)
    appendStrapiOffersArray('departureCitySlug', state.departureCity);
  if (state.regions.length)
    appendStrapiHotelsArray('[region][slug]', state.regions);

  return strapiParams.toString();
};
