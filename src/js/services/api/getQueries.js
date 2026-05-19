import { API_URL } from './constants.js';

const tourSearchForm = document.querySelector('[data-tour-search-form]')
export const getFilterState = () => {
  const checkedDirection = tourSearchForm.querySelector('[data-tour-search-field]');
  const checkedHotelAccomondation = tourSearchForm.querySelectorAll('input[name="accommodation"]:checked');
  const checkedMeal = tourSearchForm.querySelectorAll('input[name="meal"]:checked');
  const checkedTourComposition = tourSearchForm.querySelectorAll('input[name="tourComposition"]:checked');
  const checkedDepartureCity = tourSearchForm.querySelectorAll('input[name="departureCity"]:checked');
  const checkedRegion = tourSearchForm.querySelectorAll('input[name="region"]:checked');
  const state = {
    direction: checkedDirection?.value || '',
    accomondation: Array.from(checkedHotelAccomondation).map(input => input.value),
    meal: Array.from(checkedMeal).map(input => input.value),
    tourComposition: Array.from(checkedTourComposition).map(input => input.value),
    departureCity: Array.from(checkedDepartureCity).map(input => input.value),
    regions: Array.from(checkedRegion).map(input => input.value),
    price: {
      min: Number(tourSearchForm.querySelector('[data-tour-search-price-min]')?.value || 200),
      max: Number(tourSearchForm.querySelector('[data-tour-search-price-max]')?.value || 3000),
    }
  };

  return state;
}

tourSearchForm.addEventListener('input', (e) => {
  e.preventDefault();
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {

    const currentState = getFilterState();

    const urlParams = new URLSearchParams();

    if(currentState.direction) urlParams.set('direction', currentState.direction);
    urlParams.set('priceMin', currentState.price.min);
    urlParams.set('priceMax', currentState.price.max);

    if(currentState.accomondation.length) urlParams.set('accommodation', currentState.accomondation.join(','));
    if(currentState.meal.length) urlParams.set('meal', currentState.meal.join(','));
    if(currentState.tourComposition.length) urlParams.set('tourComposition', currentState.tourComposition.join(','));
    if(currentState.departureCity.length) urlParams.set('departureCity', currentState.departureCity.join(','));
    if(currentState.regions.length) urlParams.set('region', currentState.regions.join(','));

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, '', newUrl);

    console.log('Фильтр изменился! Текущее состояние:', currentState);
    // window.location.href = `/club-travel/pages/search-result.html?${urlParams.toString()}`;

    // const strapiQuery = convertStateToStrapiQuery(currentState);
    // const finalStrapiUrl = `${API_URL}v2-hotels?${strapiQuery}`
    // console.log('Строка запроса для Strapi:', finalStrapiUrl);
  }
})

tourSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const currentState = getFilterState();
  window.location.href = `/club-travel/search-result.html?${new URLSearchParams(currentState).toString()}`
})

