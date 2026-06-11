export const FILTER_GROUPS_ORDER = [
  'accommodation',
  'meal',
  'tourComposition',
  'departureCity',
  'season',
  'price',
  'region',
  'apartmentType',
];

export const FILTER_GROUP_LABELS = {
  accommodation: 'Категория размещения отеля',
  meal: 'Питание',
  tourComposition: 'Состав тура',
  departureCity: 'Вылет из',
  season: 'Сезон',
  price: 'Цена',
  region: 'Регионы',
  apartmentType: 'Тип размещения',
};

export const FILTER_LABELS = {
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
  season: {
    summer: 'Лето',
    winter: 'Зима',
  },
};

export const MONTHS = [
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

export const MONTH_TITLES = [
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

export const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

export const ACTIVE_FILTERS_LABEL =
  '<span class="tour-search__active_label">Активные фильтры:</span>';

export const CHECKBOX_SVG_FALLBACK =
  '<svg class="tour-search__checkbox_svg"><use href="#check-circle"></use></svg>';

export const PRICE_DEFAULT_MIN = 200;
export const PRICE_DEFAULT_MAX = 2000;
