// const PRICE_VALUE_SELECTOR = '.tour-search__price_value';

// function toNumber(value, fallback) {
//   const number = Number(value);

//   return Number.isFinite(number) ? number : fallback;
// }

// function clamp(value, min, max) {
//   return Math.min(Math.max(value, min), max);
// }

// function getQueryNumber(urlParams, name) {
//   const value = Number(urlParams.get(name));

//   return Number.isFinite(value) ? value : null;
// }

// function getPriceElements(priceBlock) {
//   if (!priceBlock) return null;

//   const minInput = priceBlock.querySelector('[data-tour-search-price-min]');
//   const maxInput = priceBlock.querySelector('[data-tour-search-price-max]');
//   const [minValueText, maxValueText] =
//     priceBlock.querySelectorAll(PRICE_VALUE_SELECTOR);

//   if (!minInput || !maxInput || !minValueText || !maxValueText) return null;

//   const minLimit = toNumber(minInput.min, 0);
//   const maxLimit = toNumber(maxInput.max, minLimit);
//   const minGap = toNumber(minInput.step, 1) || 1;
//   const defaultMin = clamp(
//     toNumber(minInput.defaultValue || minInput.value, minLimit),
//     minLimit,
//     maxLimit,
//   );
//   const defaultMax = clamp(
//     toNumber(maxInput.defaultValue || maxInput.value, maxLimit),
//     minLimit,
//     maxLimit,
//   );

//   return {
//     minInput,
//     maxInput,
//     minValueText,
//     maxValueText,
//     minLimit,
//     maxLimit,
//     minGap,
//     defaultMin,
//     defaultMax,
//   };
// }

// function normalizePriceValues(elements) {
//   const normalizedMaxLimit = Math.max(elements.minLimit, elements.maxLimit);
//   const normalizedMinLimit = Math.min(elements.minLimit, elements.maxLimit);
//   const maxWithGap = Math.max(
//     normalizedMinLimit,
//     normalizedMaxLimit - elements.minGap,
//   );
//   const minWithGap = Math.min(
//     normalizedMaxLimit,
//     normalizedMinLimit + elements.minGap,
//   );

//   const minValue = clamp(
//     toNumber(elements.minInput.value, elements.defaultMin),
//     normalizedMinLimit,
//     maxWithGap,
//   );
//   const maxValue = clamp(
//     toNumber(elements.maxInput.value, elements.defaultMax),
//     minWithGap,
//     normalizedMaxLimit,
//   );

//   if (minValue <= maxValue - elements.minGap) {
//     return { min: minValue, max: maxValue };
//   }

//   const defaultMin = clamp(elements.defaultMin, normalizedMinLimit, maxWithGap);
//   const defaultMax = clamp(elements.defaultMax, minWithGap, normalizedMaxLimit);

//   if (defaultMin <= defaultMax - elements.minGap) {
//     return { min: defaultMin, max: defaultMax };
//   }

//   return {
//     min: normalizedMinLimit,
//     max: normalizedMaxLimit,
//   };
// }

// function setPriceValues(elements, min, max) {
//   elements.minInput.value = String(min);
//   elements.maxInput.value = String(max);
// }

// function getPercent(value, elements) {
//   const range = elements.maxLimit - elements.minLimit;

//   if (!range) return 0;

//   return ((value - elements.minLimit) / range) * 100;
// }

// function syncPriceView(priceBlock, elements) {
//   const { min, max } = normalizePriceValues(elements);

//   setPriceValues(elements, min, max);

//   elements.minValueText.textContent = `${min}€`;
//   elements.maxValueText.textContent = `${max}€`;

//   priceBlock.style.setProperty(
//     '--price-min-position',
//     `${getPercent(min, elements)}%`,
//   );

//   priceBlock.style.setProperty(
//     '--price-max-position',
//     `${getPercent(max, elements)}%`,
//   );

//   return { min, max };
// }

// export function getPriceRangeState(root) {
//   const priceBlock = root?.matches?.('[data-tour-search-price]')
//     ? root
//     : root?.querySelector?.('[data-tour-search-price]');
//   const elements = getPriceElements(priceBlock);

//   if (!elements) return null;

//   const { min, max } = normalizePriceValues(elements);

//   return {
//     min,
//     max,
//     defaultMin: elements.defaultMin,
//     defaultMax: elements.defaultMax,
//   };
// }

// export function isPriceRangeDefault(state) {
//   return (
//     !state || (state.min === state.defaultMin && state.max === state.defaultMax)
//   );
// }

// export function applyPriceQueryParams(form, urlParams) {
//   const priceBlock = form?.querySelector('[data-tour-search-price]');
//   const elements = getPriceElements(priceBlock);

//   if (!elements) return;

//   const minValue = getQueryNumber(urlParams, 'priceMin');
//   const maxValue = getQueryNumber(urlParams, 'priceMax');

//   if (minValue !== null) {
//     elements.minInput.value = String(minValue);
//   }

//   if (maxValue !== null) {
//     elements.maxInput.value = String(maxValue);
//   }

//   const { min, max } = normalizePriceValues(elements);
//   setPriceValues(elements, min, max);
// }

// export function initPriceRange(priceBlock, onChange) {
//   const elements = getPriceElements(priceBlock);

//   if (!elements) return null;

//   const notifyChange = () => {
//     if (typeof onChange === 'function') {
//       onChange(getPriceRangeState(priceBlock));
//     }
//   };

//   const sync = () => syncPriceView(priceBlock, elements);

//   elements.minInput.addEventListener('input', () => {
//     const nextValue = Math.min(
//       Number(elements.minInput.value),
//       Number(elements.maxInput.value) - elements.minGap,
//     );

//     elements.minInput.value = String(nextValue);
//     sync();
//     notifyChange();
//   });

//   elements.maxInput.addEventListener('input', () => {
//     const nextValue = Math.max(
//       Number(elements.maxInput.value),
//       Number(elements.minInput.value) + elements.minGap,
//     );

//     elements.maxInput.value = String(nextValue);
//     sync();
//     notifyChange();
//   });

//   sync();

//   return {
//     reset() {
//       setPriceValues(elements, elements.defaultMin, elements.defaultMax);
//       sync();
//     },
//     sync,
//   };
// }

import { PRICE_DEFAULT_MAX, PRICE_DEFAULT_MIN } from './constants.js';

export function initPriceRange(priceBlock, options = {}) {
  if (!priceBlock) return null;

  const minInput = priceBlock.querySelector('[data-tour-search-price-min]');
  const maxInput = priceBlock.querySelector('[data-tour-search-price-max]');
  const [minValueText, maxValueText] = priceBlock.querySelectorAll(
    '.tour-search__price_value',
  );

  if (!minInput || !maxInput || !minValueText || !maxValueText) return null;

  const minLimit = Number(minInput.min);
  const maxLimit = Number(maxInput.max);
  const minGap = Number(minInput.step) || 1;

  const getPercent = value =>
    ((value - minLimit) / (maxLimit - minLimit)) * 100;

  const clampPrice = value =>
    Math.min(Math.max(Number(value), minLimit), maxLimit);

  const setPriceValues = (minValue, maxValue) => {
    minInput.value = String(minValue);
    maxInput.value = String(maxValue);
  };

  const normalizeValues = () => {
    const minValue = clampPrice(minInput.value);
    const maxValue = clampPrice(maxInput.value);

    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
      setPriceValues(PRICE_DEFAULT_MIN, PRICE_DEFAULT_MAX);
      return;
    }

    if (minValue >= maxValue) {
      setPriceValues(PRICE_DEFAULT_MIN, PRICE_DEFAULT_MAX);
      return;
    }

    setPriceValues(minValue, maxValue);
  };

  const syncPriceView = () => {
    normalizeValues();

    const minValue = Number(minInput.value);
    const maxValue = Number(maxInput.value);

    minValueText.textContent = `${minValue}€`;
    maxValueText.textContent = `${maxValue}€`;

    priceBlock.style.setProperty(
      '--price-min-position',
      `${getPercent(minValue)}%`,
    );

    priceBlock.style.setProperty(
      '--price-max-position',
      `${getPercent(maxValue)}%`,
    );
  };

  const notifyInput = () => {
    options.onInput?.();
  };

  const reset = () => {
    setPriceValues(PRICE_DEFAULT_MIN, PRICE_DEFAULT_MAX);
    syncPriceView();
  };

  minInput.addEventListener('input', () => {
    const nextValue = Math.min(
      Number(minInput.value),
      Number(maxInput.value) - minGap,
    );

    minInput.value = String(nextValue);
    syncPriceView();
    notifyInput();
  });

  maxInput.addEventListener('input', () => {
    const nextValue = Math.max(
      Number(maxInput.value),
      Number(minInput.value) + minGap,
    );

    maxInput.value = String(nextValue);
    syncPriceView();
    notifyInput();
  });

  syncPriceView();

  return {
    reset,
    sync: syncPriceView,
  };
}
