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
    group.innerHTML = `<span class="tour-search__active_name">${FILTER_GROUP_LABELS[name] || name}</span>`;

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
