import { getCountries, getRegions } from '../services/api/getDirection.js';
import {
  getFilterState,
  syncFilterQueryString,
} from '../services/api/getQueries.js';
import { initDatePicker } from './tour-search/calendar.js';
import {
  PRICE_DEFAULT_MAX,
  PRICE_DEFAULT_MIN,
} from './tour-search/constants.js';
import { initPriceRange } from './tour-search/price-range.js';
import {
  getCheckboxSvgMarkup,
  renderActiveFilters,
  renderDirections,
  renderRegions,
} from './tour-search/render.js';
import {
  getCountryValue,
  getRegionCountryValue,
  getSavedValues,
} from './tour-search/utils.js';

export const tourSearchReady = Promise.all(
  [...document.querySelectorAll('[data-tour-search]')].map(initTourSearch),
);

async function initTourSearch(root) {
  const activeFilters = root.querySelector('[data-tour-search-active]');
  const priceBlock = root.querySelector('[data-tour-search-price]');
  const directionField = root.querySelector('[name="direction"]');
  const regionList = root.querySelector('[data-tour-search-region-list]');
  const form = root.querySelector('[data-tour-search-form]');
  const shouldRestoreFromUrl =
    document.body.classList.contains('search-result');
  const urlParams = shouldRestoreFromUrl
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  const checkboxSvgMarkup = getCheckboxSvgMarkup(root);

  let allRegions = [];
  let priceRange = null;

  const isAllDirectionsState = selectedDirection => !selectedDirection;

  const getRegionsForDirection = selectedDirection => {
    if (isAllDirectionsState(selectedDirection)) {
      return allRegions;
    }

    return allRegions.filter(
      region => getRegionCountryValue(region) === selectedDirection,
    );
  };

  const renderRegionsForDirection = selectedDirection => {
    renderRegions(
      regionList,
      getRegionsForDirection(selectedDirection),
      checkboxSvgMarkup,
    );
  };

  const restoreFilters = () => {
    if (!form) return;

    const applyCheckboxes = (paramName, inputName) => {
      const savedValues = getSavedValues(urlParams, paramName);

      if (!savedValues.length) return;

      form.querySelectorAll(`input[name="${inputName}"]`).forEach(checkbox => {
        checkbox.checked = savedValues.includes(checkbox.value);
      });
    };

    const minPriceInput = form.querySelector('[data-tour-search-price-min]');
    const maxPriceInput = form.querySelector('[data-tour-search-price-max]');
    const durationInput = form.querySelector('select[name="duration"]');

    if (durationInput && urlParams.has('duration')) {
      const requestedDuration = urlParams.get('duration') || '';
      const hasDurationOption = [...durationInput.options].some(
        option => option.value === requestedDuration,
      );

      if (hasDurationOption) {
        durationInput.value = requestedDuration;
      }
    }

    if (
      minPriceInput &&
      maxPriceInput &&
      (urlParams.has('priceMin') || urlParams.has('priceMax'))
    ) {
      const priceMin = Number(urlParams.get('priceMin'));
      const priceMax = Number(urlParams.get('priceMax'));
      const minLimit = Number(minPriceInput.min);
      const maxLimit = Number(maxPriceInput.max);
      const hasValidPriceRange =
        Number.isFinite(priceMin) &&
        Number.isFinite(priceMax) &&
        priceMin >= minLimit &&
        priceMax <= maxLimit &&
        priceMin < priceMax;

      minPriceInput.value = String(
        hasValidPriceRange ? priceMin : PRICE_DEFAULT_MIN,
      );
      maxPriceInput.value = String(
        hasValidPriceRange ? priceMax : PRICE_DEFAULT_MAX,
      );
    }

    applyCheckboxes('accommodation', 'accommodation');
    applyCheckboxes('apartmentType', 'apartmentType');
    applyCheckboxes('meal', 'meal');
    applyCheckboxes('tourComposition', 'tourComposition');
    applyCheckboxes('departureCity', 'departureCity');
    applyCheckboxes('season', 'season');
  };

  const restoreRegions = selectedDirection => {
    const regionInputs = [
      ...root.querySelectorAll('[data-tour-search-filter][name="region"]'),
    ];

    const savedRegions = getSavedValues(urlParams, 'regions');

    regionInputs.forEach(input => {
      const isAllowed =
        isAllDirectionsState(selectedDirection) ||
        input.dataset.tourSearchRegionCountry === selectedDirection;

      input.checked = isAllowed && savedRegions.includes(input.value);
    });
  };

  const emitFilterChange = () => {
    const state = getFilterState();
    const queryString = syncFilterQueryString(state);

    root.dispatchEvent(
      new CustomEvent('tour-search:change', {
        bubbles: true,
        detail: { state, queryString, form, root },
      }),
    );
  };

  const syncRegionsForDirection = selectedDirection => {
    renderRegionsForDirection(selectedDirection);

    if (!isAllDirectionsState(selectedDirection)) {
      root
        .querySelectorAll('[data-tour-search-filter][name="region"]')
        .forEach(input => {
          if (input.dataset.tourSearchRegionCountry !== selectedDirection) {
            input.checked = false;
          }
        });
    }

    renderActiveFilters(root, activeFilters);
    emitFilterChange();
  };

  const syncPriceFilterView = () => {
    renderActiveFilters(root, activeFilters);
    syncFilterQueryString(getFilterState());
  };

  if (directionField) {
    const [countries, regions] = await Promise.all([
      getCountries(),
      getRegions(),
    ]);

    renderDirections(directionField, countries);

    allRegions = regions;

    restoreFilters();

    if (urlParams.has('direction')) {
      const requestedDirection = urlParams.get('direction') || '';
      const validCountryValues = new Set(countries.map(getCountryValue));

      directionField.value = validCountryValues.has(requestedDirection)
        ? requestedDirection
        : '';
    }

    renderRegionsForDirection(directionField.value);
    restoreRegions(directionField.value);

    directionField.addEventListener('change', event => {
      syncRegionsForDirection(event.target.value);
    });
  }

  root
    .querySelector('[data-tour-search-toggle]')
    ?.addEventListener('click', () =>
      root.classList.add('tour-search_expanded'),
    );

  root
    .querySelector('[data-tour-search-close]')
    ?.addEventListener('click', () =>
      root.classList.remove('tour-search_expanded'),
    );

  root.addEventListener('change', event => {
    if (
      event.target.matches(
        '[data-tour-search-filter], [data-tour-search-field], [data-tour-search-price-min], [data-tour-search-price-max]',
      )
    ) {
      if (event.target === directionField) return;

      renderActiveFilters(root, activeFilters);
      emitFilterChange();
    }
  });

  activeFilters?.addEventListener('click', event => {
    const tag = event.target.closest('[data-tour-search-tag]');

    if (!tag) return;

    if (tag.dataset.tourSearchTagName === 'price') {
      priceRange?.reset();
      renderActiveFilters(root, activeFilters);
      emitFilterChange();
      return;
    }

    const selector = `[data-tour-search-filter][name="${tag.dataset.tourSearchTagName}"][value="${tag.dataset.tourSearchTag}"]`;
    const input = root.querySelector(selector);

    if (!input) return;

    input.checked = false;

    renderActiveFilters(root, activeFilters);
    emitFilterChange();
  });

  form?.addEventListener('reset', () => {
    requestAnimationFrame(() => {
      priceRange?.reset();
      renderActiveFilters(root, activeFilters);
      emitFilterChange();
    });
  });

  initDatePicker(root);
  priceRange = initPriceRange(priceBlock, {
    onInput: syncPriceFilterView,
  });
  renderActiveFilters(root, activeFilters);
  root.dispatchEvent(
    new CustomEvent('tour-search:ready', {
      bubbles: true,
      detail: {
        state: getFilterState(),
        queryString: syncFilterQueryString(),
        form,
        root,
      },
    }),
  );
}
