export function initPriceRange(priceBlock) {
  if (!priceBlock) return;

  const minInput = priceBlock.querySelector('[data-tour-search-price-min]');
  const maxInput = priceBlock.querySelector('[data-tour-search-price-max]');
  const [minValueText, maxValueText] = priceBlock.querySelectorAll(
    '.tour-search__price_value',
  );

  if (!minInput || !maxInput || !minValueText || !maxValueText) return;

  const minLimit = Number(minInput.min);
  const maxLimit = Number(maxInput.max);
  const minGap = Number(minInput.step) || 1;

  const getPercent = value =>
    ((value - minLimit) / (maxLimit - minLimit)) * 100;

  const syncPriceView = () => {
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

  minInput.addEventListener('input', () => {
    const nextValue = Math.min(
      Number(minInput.value),
      Number(maxInput.value) - minGap,
    );

    minInput.value = String(nextValue);
    syncPriceView();
  });

  maxInput.addEventListener('input', () => {
    const nextValue = Math.max(
      Number(maxInput.value),
      Number(minInput.value) + minGap,
    );

    maxInput.value = String(nextValue);
    syncPriceView();
  });

  syncPriceView();
}
