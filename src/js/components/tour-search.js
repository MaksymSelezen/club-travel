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

const tourSearchBlocks = document.querySelectorAll('[data-tour-search]');

tourSearchBlocks.forEach(tourSearch => {
  const openButton = tourSearch.querySelector('[data-tour-search-toggle]');
  const closeButton = tourSearch.querySelector('[data-tour-search-close]');
  const priceBlock = tourSearch.querySelector('[data-tour-search-price]');
  const activeFilters = tourSearch.querySelector('[data-tour-search-active]');
  const filterCheckboxes = tourSearch.querySelectorAll(
    '[data-tour-search-filter]',
  );

  const openAdvancedSearch = () => {
    tourSearch.classList.add('tour-search_expanded');
  };

  const closeAdvancedSearch = () => {
    tourSearch.classList.remove('tour-search_expanded');
  };

  openButton?.addEventListener('click', openAdvancedSearch);
  closeButton?.addEventListener('click', closeAdvancedSearch);

  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      renderActiveFilters(tourSearch);
    });
  });

  activeFilters?.addEventListener('click', event => {
    const tagButton = event.target.closest('[data-tour-search-tag]');

    if (!tagButton) {
      return;
    }

    const filterName = tagButton.dataset.tourSearchTagName;
    const filterValue = tagButton.dataset.tourSearchTag;

    const targetCheckbox = [...filterCheckboxes].find(checkbox => {
      return checkbox.name === filterName && checkbox.value === filterValue;
    });

    if (!targetCheckbox) {
      return;
    }

    targetCheckbox.checked = false;
    renderActiveFilters(tourSearch);
  });

  if (priceBlock) {
    initPriceRange(priceBlock);
  }

  renderActiveFilters(tourSearch);
});

function renderActiveFilters(tourSearch) {
  const activeFilters = tourSearch.querySelector('[data-tour-search-active]');
  const checkedFilters = [
    ...tourSearch.querySelectorAll('[data-tour-search-filter]:checked'),
  ];

  if (!activeFilters) {
    return;
  }

  activeFilters.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'tour-search__active_label';
  label.textContent = 'Активные фильтры:';

  activeFilters.append(label);

  if (checkedFilters.length === 0) {
    return;
  }

  const groupedFilters = checkedFilters.reduce((acc, checkbox) => {
    if (!acc[checkbox.name]) {
      acc[checkbox.name] = [];
    }

    acc[checkbox.name].push(checkbox);

    return acc;
  }, {});

  FILTER_GROUPS_ORDER.forEach(groupName => {
    const groupItems = groupedFilters[groupName];

    if (!groupItems || groupItems.length === 0) {
      return;
    }

    const group = document.createElement('div');
    group.className = 'tour-search__active_group';

    const groupTitle = document.createElement('span');
    groupTitle.className = 'tour-search__active_name';
    groupTitle.textContent = FILTER_GROUP_LABELS[groupName] || groupName;

    group.append(groupTitle);

    groupItems.forEach(checkbox => {
      const tag = document.createElement('button');
      tag.className = 'tour-search__tag';
      tag.type = 'button';
      tag.dataset.tourSearchTagName = checkbox.name;
      tag.dataset.tourSearchTag = checkbox.value;
      tag.textContent = getFilterLabel(checkbox);

      group.append(tag);
    });

    activeFilters.append(group);
  });
}

function getFilterLabel(checkbox) {
  const labelFromMap = FILTER_LABELS[checkbox.name]?.[checkbox.value];

  if (labelFromMap) {
    return labelFromMap;
  }

  const textElement = checkbox
    .closest('.tour-search__option')
    ?.querySelector('.tour-search__option_text');

  return textElement?.textContent.trim() || checkbox.value;
}

function initPriceRange(priceBlock) {
  const minInput = priceBlock.querySelector('[data-tour-search-price-min]');
  const maxInput = priceBlock.querySelector('[data-tour-search-price-max]');
  const priceValues = priceBlock.querySelectorAll('.tour-search__price_value');

  if (!minInput || !maxInput || priceValues.length < 2) {
    return;
  }

  const minValueText = priceValues[0];
  const maxValueText = priceValues[1];

  const minLimit = Number(minInput.min);
  const maxLimit = Number(maxInput.max);
  const minGap = Number(minInput.step) || 1;

  const getPercent = value => {
    return ((value - minLimit) / (maxLimit - minLimit)) * 100;
  };

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

  const handleMinInput = () => {
    const minValue = Number(minInput.value);
    const maxValue = Number(maxInput.value);

    if (minValue > maxValue - minGap) {
      minInput.value = maxValue - minGap;
    }

    updatePriceView();
  };

  const handleMaxInput = () => {
    const minValue = Number(minInput.value);
    const maxValue = Number(maxInput.value);

    if (maxValue < minValue + minGap) {
      maxInput.value = minValue + minGap;
    }

    updatePriceView();
  };

  minInput.addEventListener('input', handleMinInput);
  maxInput.addEventListener('input', handleMaxInput);

  updatePriceView();
}
