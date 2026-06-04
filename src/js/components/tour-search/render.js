import {
  ACTIVE_FILTERS_LABEL,
  CHECKBOX_SVG_FALLBACK,
  FILTER_GROUP_LABELS,
  FILTER_GROUPS_ORDER,
  FILTER_LABELS,
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

  container.innerHTML = ACTIVE_FILTERS_LABEL;

  if (!checked.length) return;

  const groups = new Map();

  checked.forEach(input => {
    const list = groups.get(input.name) || [];
    list.push(input);
    groups.set(input.name, list);
  });

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

    items.forEach(input => {
      const tag = document.createElement('button');

      tag.type = 'button';
      tag.className = 'tour-search__tag';
      tag.dataset.tourSearchTagName = input.name;
      tag.dataset.tourSearchTag = input.value;
      tag.textContent = getFilterLabel(input);

      group.append(tag);
    });

    container.append(group);
  });
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
