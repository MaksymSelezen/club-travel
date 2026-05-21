import { getCountries, getRegions } from '../services/api/getDirection.js';
import { getFilterState } from '../services/api/getQueries.js';
import { findHotels } from '../services/api/findHotels.js';
import { convertStateToStrapiQuery } from '../utils/format-query-to-strapi-req.js';

const FILTER_GROUPS_ORDER = [
  'accommodation',
  'meal',
  'tourComposition',
  'departureCity',
  'region',
  'apartmentType',
];

const FILTER_GROUP_LABELS = {
  accommodation: 'Категория размещения отеля',
  meal: 'Питание',
  tourComposition: 'Состав тура',
  departureCity: 'Вылет из',
  region: 'Регионы',
  apartmentType: 'Тип размещения',
};

const FILTER_LABELS = {
  accommodation: {
    2: '2 звезды',
    3: '3 звезды',
    4: '4 звезды',
    5: '5 звезд',
  },
  apartmentType: {
    apartments: 'Апартаменты',
  },
  meal: {
    'no-meal': 'Без питания',
    breakfast: 'Завтрак',
    'breakfast-dinner': 'Завтрак и ужин',
    'breakfast-lunch-dinner': 'Завтрак, обед, ужин',
    'all-inclusive': 'Всё включено',
    'ultra-all-inclusive': 'Ультра: всё включено',
  },
  tourComposition: {
    package: 'Туристический пакет',
    'flight-only': 'Только перелет',
  },
  departureCity: {
    tallinn: 'Таллин',
    riga: 'Рига',
    vilnius: 'Вильнюс',
  },
};

const MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

const MONTH_TITLES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

const ACTIVE_FILTERS_LABEL =
  '<span class="tour-search__active_label">Активные фильтры:</span>';

const CHECKBOX_SVG_FALLBACK =
  '<svg class="tour-search__checkbox_svg"><use href="#check-circle"></use></svg>';

document.querySelectorAll('[data-tour-search]').forEach(initTourSearch);

function getCountryValue(country) {
  return (
    country.slug ||
    country.documentId ||
    String(country.id || country.name || '')
  );
}

function getRegionCountryValue(region) {
  const country = region.country;

  return country
    ? country.slug ||
        country.documentId ||
        String(country.id || country.name || '')
    : '';
}

function getRegionValue(region) {
  return region.slug || region.documentId || String(region.id || '');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function getCheckboxSvgMarkup(root) {
  const checkboxSvg = root.querySelector('.tour-search__checkbox_svg');

  return checkboxSvg?.outerHTML || CHECKBOX_SVG_FALLBACK;
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

function normalizeAccommodationValue(value) {
  const trimmed = String(value || '').trim();
  const legacyMatch = trimmed.match(/^(\d+)-stars$/);

  if (legacyMatch) return legacyMatch[1];

  return trimmed;
}

function isValidAccommodationStar(value) {
  return /^[1-5]$/.test(String(value || '').trim());
}

function getSavedValues(urlParams, paramName) {
  const values = (urlParams.get(paramName) || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  if (paramName === 'accommodation') {
    return values
      .map(normalizeAccommodationValue)
      .filter(isValidAccommodationStar);
  }

  return values;
}

async function initTourSearch(root) {
  const activeFilters = root.querySelector('[data-tour-search-active]');
  const priceBlock = root.querySelector('[data-tour-search-price]');
  const directionField = root.querySelector('[name="direction"]');
  const regionList = root.querySelector('[data-tour-search-region-list]');
  const form = root.querySelector('[data-tour-search-form]');
  const urlParams = new URLSearchParams(window.location.search);
  const checkboxSvgMarkup = getCheckboxSvgMarkup(root);

  let allRegions = [];

  const renderRegions = selectedDirection => {
    if (!regionList) return;

    if (!selectedDirection) {
      regionList.innerHTML = '';
      return;
    }

    const filteredRegions = allRegions.filter(
      region => getRegionCountryValue(region) === selectedDirection,
    );

    regionList.innerHTML = filteredRegions
      .map(region => createRegionItemMarkup(region, checkboxSvgMarkup))
      .join('');
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

    if (minPriceInput && urlParams.has('priceMin')) {
      minPriceInput.value = urlParams.get('priceMin') || minPriceInput.value;
    }

    if (maxPriceInput && urlParams.has('priceMax')) {
      maxPriceInput.value = urlParams.get('priceMax') || maxPriceInput.value;
    }

    applyCheckboxes('accommodation', 'accommodation');
    applyCheckboxes('apartmentType', 'apartmentType');
    applyCheckboxes('meal', 'meal');
    applyCheckboxes('tourComposition', 'tourComposition');
    applyCheckboxes('departureCity', 'departureCity');
  };

  const restoreRegions = selectedDirection => {
    const regionInputs = [
      ...root.querySelectorAll('[data-tour-search-filter][name="region"]'),
    ];

    const savedRegions = getSavedValues(urlParams, 'regions');

    regionInputs.forEach(input => {
      const isAllowed =
        input.dataset.tourSearchRegionCountry === selectedDirection;

      input.checked = isAllowed && savedRegions.includes(input.value);
    });
  };

  const syncQueryAndApi = () => {
    if (!form) return;

    const state = getFilterState();
    const clean = new URLSearchParams();

    if (state.direction) {
      clean.set('direction', state.direction);
    }

    if (state.price?.min !== undefined) {
      clean.set('priceMin', String(state.price.min));
    }

    if (state.price?.max !== undefined) {
      clean.set('priceMax', String(state.price.max));
    }

    if (state.accomondation?.length) {
      clean.set('accommodation', state.accomondation.join(','));
    }

    if (state.meal?.length) {
      clean.set('meal', state.meal.join(','));
    }

    if (state.apartmentType?.length) {
      clean.set('apartmentType', state.apartmentType.join(','));
    }

    if (state.tourComposition?.length) {
      clean.set('tourComposition', state.tourComposition.join(','));
    }

    if (state.departureCity?.length) {
      clean.set('departureCity', state.departureCity.join(','));
    }

    if (state.regions?.length) {
      clean.set('regions', state.regions.join(','));
    }

    const nextUrl = clean.toString()
      ? `${window.location.pathname}?${clean.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', nextUrl);

    const strapiQuery = convertStateToStrapiQuery(state);

    void findHotels(strapiQuery);
  };

  const syncRegionsForDirection = selectedDirection => {
    renderRegions(selectedDirection);

    root
      .querySelectorAll('[data-tour-search-filter][name="region"]')
      .forEach(input => {
        if (input.dataset.tourSearchRegionCountry !== selectedDirection) {
          input.checked = false;
        }
      });

    renderActiveFilters(root, activeFilters);
    syncQueryAndApi();
  };

  if (directionField) {
    const [countries, regions] = await Promise.all([
      getCountries(),
      getRegions(),
    ]);

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

    allRegions = regions;

    restoreFilters();

    if (urlParams.has('direction')) {
      const requestedDirection = urlParams.get('direction') || '';
      const validCountryValues = new Set(countries.map(getCountryValue));

      directionField.value = validCountryValues.has(requestedDirection)
        ? requestedDirection
        : '';
    }

    renderRegions(directionField.value);
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
      renderActiveFilters(root, activeFilters);
      syncQueryAndApi();
    }
  });

  activeFilters?.addEventListener('click', event => {
    const tag = event.target.closest('[data-tour-search-tag]');

    if (!tag) return;

    const selector = `[data-tour-search-filter][name="${tag.dataset.tourSearchTagName}"][value="${tag.dataset.tourSearchTag}"]`;
    const input = root.querySelector(selector);

    if (!input) return;

    input.checked = false;

    renderActiveFilters(root, activeFilters);
    syncQueryAndApi();
  });

  initDatePicker(root);
  initPriceRange(priceBlock);
  renderActiveFilters(root, activeFilters);
  syncQueryAndApi();
}

function renderActiveFilters(root, container) {
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

function initDatePicker(root) {
  const dateField = root.querySelector('[data-tour-search-date]');
  const dateBox = root.querySelector('[data-tour-search-date-box]');
  const dateInput = root.querySelector('[data-tour-search-date-input]');
  const calendar = root.querySelector('[data-tour-search-calendar]');

  if (!dateField || !dateBox || !dateInput || !calendar) return;

  let selectedDate = getTodayDate();
  let viewDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  );

  const closeCalendar = () => {
    calendar.hidden = true;
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const emptyDays = (new Date(year, month, 1).getDay() + 6) % 7;
    const selectedIso = formatIsoDate(selectedDate);
    const todayIso = formatIsoDate(getTodayDate());

    const emptyCells =
      '<span class="tour-search__calendar_day_empty"></span>'.repeat(emptyDays);

    const dayCells = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const iso = formatIsoDate(new Date(year, month, day));
      const classes = ['tour-search__calendar_day'];

      if (iso === selectedIso) {
        classes.push('tour-search__calendar_day_selected');
      }

      if (iso === todayIso) {
        classes.push('tour-search__calendar_day_today');
      }

      return `<button class="${classes.join(
        ' ',
      )}" type="button" data-tour-search-calendar-day="${iso}">${day}</button>`;
    }).join('');

    calendar.innerHTML = `
      <div class="tour-search__calendar_header">
        <button class="tour-search__calendar_nav" type="button" data-tour-search-calendar-prev>‹</button>
        <span class="tour-search__calendar_month">${MONTH_TITLES[month]} ${year}</span>
        <button class="tour-search__calendar_nav" type="button" data-tour-search-calendar-next>›</button>
      </div>

      <div class="tour-search__calendar_weekdays">
        ${WEEKDAYS.map(
          day => `<span class="tour-search__calendar_weekday">${day}</span>`,
        ).join('')}
      </div>

      <div class="tour-search__calendar_grid">
        ${emptyCells}
        ${dayCells}
      </div>
    `;
  };

  const syncInput = () => {
    dateInput.value = formatInputDate(selectedDate);
    dateInput.dataset.date = formatIsoDate(selectedDate);
  };

  dateBox.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    calendar.hidden = !calendar.hidden;

    if (!calendar.hidden) {
      renderCalendar();
    }
  });

  calendar.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    if (event.target.closest('[data-tour-search-calendar-prev]')) {
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
      renderCalendar();
      return;
    }

    if (event.target.closest('[data-tour-search-calendar-next]')) {
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
      renderCalendar();
      return;
    }

    const dayButton = event.target.closest('[data-tour-search-calendar-day]');

    if (!dayButton) return;

    selectedDate = parseIsoDate(dayButton.dataset.tourSearchCalendarDay);
    viewDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

    syncInput();
    renderCalendar();
    closeCalendar();
  });

  document.addEventListener('click', event => {
    if (!dateField.contains(event.target)) {
      closeCalendar();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeCalendar();
    }
  });

  syncInput();
  renderCalendar();
}

function initPriceRange(priceBlock) {
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

function getTodayDate() {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function parseIsoDate(value) {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function formatIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatInputDate(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
