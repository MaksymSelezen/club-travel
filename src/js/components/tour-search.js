import { getCountries, getRegions } from '../services/api/getDirection.js';
import '../services/api/getQueries.js';
import '../utils/format-query-to-strapi-req.js';
import '../services/api/findHotels.js';
import '../utils/restore-filter-from-url.js';

const FILTER_GROUPS_ORDER = [
  'accommodation',
  'meal',
  'tourComposition',
  'departureCity',
  'region',
];

const FILTER_GROUP_LABELS = {
  accommodation: 'Категория размещения отеля',
  meal: 'Питание',
  tourComposition: 'Состав тура',
  departureCity: 'Вылет из',
  region: 'Регионы',
};

const FILTER_LABELS = {
  accommodation: {
    '2-stars': '2 звезды',
    '3-stars': '3 звезды',
    '4-stars': '4 звезды',
    '5-stars': '5 звезд',
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
  region: {
    albena: 'Албена',
    bansko: 'Банско',
    burgas: 'Бургас',
    dunes: 'Дюны',
    elenite: 'Елените',
    'golden-sands': 'Золотые пески',
    kranevo: 'Кранево',
    nesebar: 'Несебр',
    obzor: 'Обзор',
    pomorie: 'Поморие',
    ravda: 'Равда',
    riviera: 'Ривьера',
    sarafovo: 'Сарафово',
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
  if (!country) return '';
  return (
    country.slug ||
    country.documentId ||
    String(country.id || country.name || '')
  );
}

function createRegionItemMarkup(region) {
  const value = region.slug || region.documentId || String(region.id || '');
  const label = region.name || value;
  const countryValue = getRegionCountryValue(region);
  return `<li class="tour-search__item"><label class="tour-search__option"><input class="tour-search__checkbox" type="checkbox" name="region" value="${value}" data-tour-search-filter data-tour-search-region-country="${countryValue}" /><span class="tour-search__checkbox_icon"><svg class="tour-search__checkbox_svg"><use href="#check-circle"></use></svg></span><span class="tour-search__option_text">${label}</span></label></li>`;
}

async function initTourSearch(root) {
  const activeFilters = root.querySelector('[data-tour-search-active]');
  const priceBlock = root.querySelector('[data-tour-search-price]');
  const directionField = root.querySelector('[name="direction"]');
  const regionList = root.querySelector('[data-tour-search-region-list]');
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
    regionList.innerHTML = filteredRegions.map(createRegionItemMarkup).join('');
  };

  const syncRegionsForDirection = selectedDirection => {
    const regionInputs = [
      ...root.querySelectorAll('[data-tour-search-filter][name="region"]'),
    ];
    regionInputs.forEach(input => {
      if (input.dataset.tourSearchRegionCountry !== selectedDirection) {
        input.checked = false;
      }
    });
    renderRegions(selectedDirection);
    renderActiveFilters(root, activeFilters);
  };

  if (directionField) {
    const [countries, regions] = await Promise.all([
      getCountries(),
      getRegions(),
    ]);
    const options = countries
      .map(country => {
        const value = getCountryValue(country);
        const label = country.name || value;
        return value ? `<option value="${value}">${label}</option>` : '';
      })
      .filter(Boolean)
      .join('');
    directionField.insertAdjacentHTML('beforeend', options);
    allRegions = regions;
    renderRegions(directionField.value);

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
    if (event.target.matches('[data-tour-search-filter]')) {
      renderActiveFilters(root, activeFilters);
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
  });

  initDatePicker(root);
  initPriceRange(priceBlock);
  renderActiveFilters(root, activeFilters);
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

  const orderedNames = [
    ...FILTER_GROUPS_ORDER,
    ...[...groups.keys()].filter(name => !FILTER_GROUPS_ORDER.includes(name)),
  ];

  orderedNames.forEach(name => {
    const items = groups.get(name);
    if (!items?.length) return;

    const group = document.createElement('div');
    group.className = 'tour-search__active_group';
    group.innerHTML = `<span class="tour-search__active_name">${FILTER_GROUP_LABELS[name] || name}</span>`;

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
      if (iso === selectedIso)
        classes.push('tour-search__calendar_day_selected');
      if (iso === todayIso) classes.push('tour-search__calendar_day_today');

      return `<button class="${classes.join(' ')}" type="button" data-tour-search-calendar-day="${iso}">${day}</button>`;
    }).join('');

    calendar.innerHTML = `
      <div class="tour-search__calendar_header">
        <button class="tour-search__calendar_nav" type="button" data-tour-search-calendar-prev>‹</button>
        <span class="tour-search__calendar_month">${MONTH_TITLES[month]} ${year}</span>
        <button class="tour-search__calendar_nav" type="button" data-tour-search-calendar-next>›</button>
      </div>
      <div class="tour-search__calendar_weekdays">
        ${WEEKDAYS.map(day => `<span class="tour-search__calendar_weekday">${day}</span>`).join('')}
      </div>
      <div class="tour-search__calendar_grid">${emptyCells}${dayCells}</div>
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
    if (!calendar.hidden) renderCalendar();
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
    if (!dateField.contains(event.target)) closeCalendar();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeCalendar();
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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatInputDate(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
