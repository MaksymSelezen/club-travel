import {
  PRICE_DEFAULT_MAX,
  PRICE_DEFAULT_MIN,
} from '@/js/components/tour-search/constants.js';

const tourSearchForm = document.querySelector('[data-tour-search-form]');

let currentFilterQueryString = '';

const getNumericPrice = (selector, fallback) => {
  const value = Number(tourSearchForm?.querySelector(selector)?.value);

  return Number.isFinite(value) ? value : fallback;
};

export const getFilterState = () => {
  if (!tourSearchForm) {
    return {
      direction: '',
      accomondation: [],
      meal: [],
      tourComposition: [],
      departureCity: [],
      regions: [],
      price: { min: PRICE_DEFAULT_MIN, max: PRICE_DEFAULT_MAX },
      duration: '',
      date: '',
    };
  }

  const checkedDirection = tourSearchForm.querySelector(
    'select[name="direction"]',
  );
  const selectedDuration = tourSearchForm.querySelector(
    'select[name="duration"]',
  );
  const selectedDate = tourSearchForm.querySelector(
    'input[name="departureDate"]',
  );
  const checkedHotelAccomondation = tourSearchForm.querySelectorAll(
    'input[name="accommodation"]:checked',
  );
  const checkedMeal = tourSearchForm.querySelectorAll(
    'input[name="meal"]:checked',
  );
  const checkedTourComposition = tourSearchForm.querySelectorAll(
    'input[name="tourComposition"]:checked',
  );
  const checkedDepartureCity = tourSearchForm.querySelectorAll(
    'input[name="departureCity"]:checked',
  );
  const checkedRegion = tourSearchForm.querySelectorAll(
    'input[name="region"]:checked',
  );

  return {
    direction: checkedDirection?.value || '',
    duration: selectedDuration?.value || '',
    date: selectedDate?.value || '',
    accomondation: Array.from(checkedHotelAccomondation).map(
      input => input.value,
    ),
    meal: Array.from(checkedMeal).map(input => input.value),
    tourComposition: Array.from(checkedTourComposition).map(
      input => input.value,
    ),
    departureCity: Array.from(checkedDepartureCity).map(input => input.value),
    regions: Array.from(checkedRegion).map(input => input.value),
    price: {
      min: getNumericPrice('[data-tour-search-price-min]', PRICE_DEFAULT_MIN),
      max: getNumericPrice('[data-tour-search-price-max]', PRICE_DEFAULT_MAX),
    },
  };
};

export const getFilterParams = (currentState = getFilterState()) => {
  const urlParams = new URLSearchParams();

  if (currentState.direction)
    urlParams.set('direction', currentState.direction);
  if (currentState.duration) urlParams.set('duration', currentState.duration);
  urlParams.set('priceMin', currentState.price.min);
  urlParams.set('priceMax', currentState.price.max);

  if (currentState.accomondation.length)
    urlParams.set('accommodation', currentState.accomondation.join(','));
  if (currentState.meal.length)
    urlParams.set('meal', currentState.meal.join(','));
  if (currentState.tourComposition.length)
    urlParams.set('tourComposition', currentState.tourComposition.join(','));
  if (currentState.departureCity.length)
    urlParams.set('departureCity', currentState.departureCity.join(','));
  if (currentState.regions.length)
    urlParams.set('regions', currentState.regions.join(','));
  return urlParams;
};

export const getFilterQueryString = (state = getFilterState()) =>
  getFilterParams(state).toString();

export const syncFilterQueryString = (state = getFilterState()) => {
  currentFilterQueryString = getFilterQueryString(state);

  return currentFilterQueryString;
};

export const getCurrentFilterQueryString = () => currentFilterQueryString;

const updateFilterQueryString = e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
    syncFilterQueryString();
  }
};

tourSearchForm?.addEventListener('input', updateFilterQueryString);
tourSearchForm?.addEventListener('change', updateFilterQueryString);

tourSearchForm?.addEventListener('submit', e => {
  e.preventDefault();
  const queryString = syncFilterQueryString();
  const searchUrl = queryString
    ? `/club-travel/search-result.html?${queryString}`
    : '/club-travel/search-result.html';

  window.location.href = searchUrl;
});
