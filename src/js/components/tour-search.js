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

const MONTHS_TITLE = [
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

document.querySelectorAll('[data-tour-search]').forEach(tourSearch => {
  const activeFilters = tourSearch.querySelector('[data-tour-search-active]');
  const priceBlock = tourSearch.querySelector('[data-tour-search-price]');

  tourSearch
    .querySelector('[data-tour-search-toggle]')
    ?.addEventListener('click', () =>
      tourSearch.classList.add('tour-search_expanded'),
    );

  tourSearch
    .querySelector('[data-tour-search-close]')
    ?.addEventListener('click', () =>
      tourSearch.classList.remove('tour-search_expanded'),
    );

  tourSearch.addEventListener('change', event => {
    if (event.target.matches('[data-tour-search-filter]')) {
      renderActiveFilters(tourSearch, activeFilters);
    }
  });

  activeFilters?.addEventListener('click', event => {
    const tag = event.target.closest('[data-tour-search-tag]');
    if (!tag) return;

    const input = tourSearch.querySelector(
      `[data-tour-search-filter][name="${tag.dataset.tourSearchTagName}"][value="${tag.dataset.tourSearchTag}"]`,
    );

    if (!input) return;

    input.checked = false;
    renderActiveFilters(tourSearch, activeFilters);
  });

  initDatePicker(tourSearch);

  if (priceBlock) initPriceRange(priceBlock);

  renderActiveFilters(tourSearch, activeFilters);
});

function renderActiveFilters(tourSearch, activeFilters) {
  if (!activeFilters) return;

  const checked = [
    ...tourSearch.querySelectorAll('[data-tour-search-filter]:checked'),
  ];

  activeFilters.innerHTML =
    '<span class="tour-search__active_label">Активные фильтры:</span>';

  if (!checked.length) return;

  const groups = checked.reduce((acc, input) => {
    (acc[input.name] ||= []).push(input);
    return acc;
  }, {});

  [...FILTER_GROUPS_ORDER, ...Object.keys(groups)].forEach(name => {
    const items = groups[name];
    if (!items || !items.length) return;

    const group = document.createElement('div');
    group.className = 'tour-search__active_group';
    group.innerHTML = `<span class="tour-search__active_name">${
      FILTER_GROUP_LABELS[name] || name
    }</span>`;

    items.forEach(input => {
      const tag = document.createElement('button');
      tag.className = 'tour-search__tag';
      tag.type = 'button';
      tag.dataset.tourSearchTagName = input.name;
      tag.dataset.tourSearchTag = input.value;
      tag.textContent = getFilterLabel(input);
      group.append(tag);
    });

    activeFilters.append(group);
    delete groups[name];
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

function initDatePicker(tourSearch) {
  const dateField = tourSearch.querySelector('[data-tour-search-date]');
  const dateBox = tourSearch.querySelector('[data-tour-search-date-box]');
  const dateInput = tourSearch.querySelector('[data-tour-search-date-input]');
  const calendar = tourSearch.querySelector('[data-tour-search-calendar]');

  if (!dateField || !dateBox || !dateInput || !calendar) return;

  let selectedDate = getTodayDate();
  let viewDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  );

  const openCalendar = () => {
    calendar.hidden = false;
    renderCalendar();
  };

  const closeCalendar = () => {
    calendar.hidden = true;
  };

  const toggleCalendar = () => {
    if (calendar.hidden) {
      openCalendar();
      return;
    }

    closeCalendar();
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const emptyDays = firstDay === 0 ? 6 : firstDay - 1;

    const selectedIso = formatIsoDate(selectedDate);
    const todayIso = formatIsoDate(getTodayDate());

    const emptyCells = Array.from({ length: emptyDays })
      .map(() => '<span class="tour-search__calendar_day_empty"></span>')
      .join('');

    const dayCells = Array.from({ length: daysInMonth })
      .map((_, index) => {
        const day = index + 1;
        const date = new Date(year, month, day);
        const iso = formatIsoDate(date);

        const classes = [
          'tour-search__calendar_day',
          iso === selectedIso ? 'tour-search__calendar_day_selected' : '',
          iso === todayIso ? 'tour-search__calendar_day_today' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return `
          <button class="${classes}" type="button" data-tour-search-calendar-day="${iso}">
            ${day}
          </button>
        `;
      })
      .join('');

    calendar.innerHTML = `
      <div class="tour-search__calendar_header">
        <button class="tour-search__calendar_nav" type="button" data-tour-search-calendar-prev>‹</button>
        <span class="tour-search__calendar_month">${MONTHS_TITLE[month]} ${year}</span>
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

  const updateInputDate = () => {
    dateInput.value = formatInputDate(selectedDate);
    dateInput.dataset.date = formatIsoDate(selectedDate);
  };

  dateBox.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    toggleCalendar();
  });

  calendar.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    const prevButton = event.target.closest('[data-tour-search-calendar-prev]');
    const nextButton = event.target.closest('[data-tour-search-calendar-next]');
    const dayButton = event.target.closest('[data-tour-search-calendar-day]');

    if (prevButton) {
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
      renderCalendar();
      return;
    }

    if (nextButton) {
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
      renderCalendar();
      return;
    }

    if (!dayButton) return;

    selectedDate = parseIsoDate(dayButton.dataset.tourSearchCalendarDay);
    viewDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

    updateInputDate();
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

  updateInputDate();
  renderCalendar();
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

function initPriceRange(priceBlock) {
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

  const updatePriceView = () => {
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
    if (Number(minInput.value) > Number(maxInput.value) - minGap) {
      minInput.value = Number(maxInput.value) - minGap;
    }

    updatePriceView();
  });

  maxInput.addEventListener('input', () => {
    if (Number(maxInput.value) < Number(minInput.value) + minGap) {
      maxInput.value = Number(minInput.value) + minGap;
    }

    updatePriceView();
  });

  updatePriceView();
}
