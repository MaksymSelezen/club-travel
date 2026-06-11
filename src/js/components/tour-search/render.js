import {
  ACTIVE_FILTERS_LABEL,
  CHECKBOX_SVG_FALLBACK,
  FILTER_GROUP_LABELS,
  FILTER_GROUPS_ORDER,
  FILTER_LABELS,
  PRICE_DEFAULT_MAX,
  PRICE_DEFAULT_MIN,
} from './constants.js';
import {
  escapeHtml,
  getCountryValue,
  getRegionCountryValue,
  getRegionValue,
} from './utils.js';

export function getCheckboxSvgMarkup(root) {
  const checkboxSvg = root.querySelector('.tour-search__checkbox_svg');

  return checkboxSvg?.outerHTML || CHECKBOX_SVG_FALLBACK;
}

export function renderDirections(directionField, countries) {
  if (!directionField) return;

  directionField.insertAdjacentHTML(
    'beforeend',
    countries
      .map(country => {
        const value = getCountryValue(country);
        const label = country.name || value;

        return value
          ? `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`
          : '';
      })
      .filter(Boolean)
      .join(''),
  );
}

export function renderRegions(regionList, regions, checkboxSvgMarkup) {
  if (!regionList) return;

  regionList.innerHTML = regions
    .map(region => createRegionItemMarkup(region, checkboxSvgMarkup))
    .join('');
}

export function renderActiveFilters(root, container) {
  if (!container) return;

  const checked = [
    ...root.querySelectorAll('[data-tour-search-filter]:checked'),
  ];
  const priceFilter = getPriceFilter(root);

  container.innerHTML = ACTIVE_FILTERS_LABEL;

  if (!checked.length && !priceFilter) return;

  const groups = new Map();

  checked.forEach(input => {
    appendGroupItem(groups, input.name, {
      value: input.value,
      label: getFilterLabel(input),
    });
  });

  if (priceFilter) {
    appendGroupItem(groups, priceFilter.name, priceFilter);
  }

  const ordered = [
    ...FILTER_GROUPS_ORDER,
    ...[...groups.keys()].filter(name => !FILTER_GROUPS_ORDER.includes(name)),
  ];

  ordered.forEach(name => {
    const items = groups.get(name);

    if (!items?.length) return;

    const group = document.createElement('div');
    group.className = 'tour-search__active_group';
    group.innerHTML = `<span class="tour-search__active_name">${
      FILTER_GROUP_LABELS[name] || name
    }</span>`;

    items.forEach(item => {
      const tag = document.createElement('button');

      tag.type = 'button';
      tag.className = 'tour-search__tag';
      tag.dataset.tourSearchTagName = name;
      tag.dataset.tourSearchTag = item.value;
      tag.textContent = item.label;

      group.append(tag);
    });

    container.append(group);
  });
}

function appendGroupItem(groups, name, item) {
  const list = groups.get(name) || [];
  list.push(item);
  groups.set(name, list);
}

function getPriceFilter(root) {
  const minInput = root.querySelector('[data-tour-search-price-min]');
  const maxInput = root.querySelector('[data-tour-search-price-max]');

  if (!minInput || !maxInput) return null;

  const minValue = Number(minInput.value);
  const maxValue = Number(maxInput.value);

  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) return null;
  if (minValue === PRICE_DEFAULT_MIN && maxValue === PRICE_DEFAULT_MAX) {
    return null;
  }

  return {
    name: 'price',
    value: `${minValue}-${maxValue}`,
    label: `${minValue}€ - ${maxValue}€`,
  };
}

function createRegionItemMarkup(region, checkboxSvgMarkup) {
  const value = escapeHtml(getRegionValue(region));
  const label = escapeHtml(region.name || value);
  const countryValue = escapeHtml(getRegionCountryValue(region));

  return `
    <li class="tour-search__item">
      <label class="tour-search__option">
        <input
          class="tour-search__checkbox"
          type="checkbox"
          name="region"
          value="${value}"
          data-tour-search-filter
          data-tour-search-region-country="${countryValue}"
        />

        <span class="tour-search__checkbox_icon">
          ${checkboxSvgMarkup}
        </span>

        <span class="tour-search__option_text">${label}</span>
      </label>
    </li>
  `;
}

function getFilterLabel(input) {
  return (
    FILTER_LABELS[input.name]?.[input.value] ||
    input
      .closest('.tour-search__option')
      ?.querySelector('.tour-search__option_text')
      ?.textContent.trim() ||
    input.value
  );
}
