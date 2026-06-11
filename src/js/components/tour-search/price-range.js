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
