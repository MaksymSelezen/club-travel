import {formatStringDate} from "@/js/utils/format-string-date.js";

const LABEL_TRANSLATION = {
  date: 'Дата',
  period: 'Период',
  places: 'Мест',
  price: 'Стоимость',
};

const NEXT_SORT_STATE = {
  'none': 'descending',
  'descending': 'ascending',
  'ascending': 'descending'
};

export function initSortInCard(card) {
  sortInCard(card);
}

function sortInCard(card) {
  const sortBtnWrap = card.querySelector('.hotel-offers__head');
  const sortBtnList = sortBtnWrap.querySelectorAll('[data-column-sort]');

  const valueSelectWrap = card.querySelector('[data-select="valueSort"]');
  const directionSelectWrap = card.querySelector('[data-select="directionSort"]',);
  const valueInputEl = valueSelectWrap.querySelector('[data-select-input]');
  const directionInputEl = directionSelectWrap.querySelector('[data-select-input]',);

  directionInputEl.addEventListener('change', e => {
    sortRow(valueInputEl.value, directionInputEl.value);
  });

  valueInputEl.addEventListener('change', e => {
    sortRow(valueInputEl.value, directionInputEl.value);
  });

  sortBtnList.forEach(btn => {
    btn.addEventListener('click', () => {


      sortBtnList.forEach(el => {
        if (btn !== el) {
          const btnWrap = el.closest('[aria-sort]')?.setAttribute('aria-sort', 'none');
        }
      })

      changeArial(btn);

      const direction = btn.closest('[aria-sort]').getAttribute('aria-sort');
      const value = btn.closest('[aria-sort]').getAttribute('data-sort-wrapper');

      sortRow(value, direction);
    });
  });

  function changeArial(btn) {
    const btnWrap = btn.closest('[aria-sort]');
    const currentArial = btnWrap.getAttribute('aria-sort');

    btnWrap.setAttribute('aria-sort', NEXT_SORT_STATE[currentArial] || 'descending');
  }

  function sortRow(value, direction) {

    if (!direction || !value) {return}

    const russianLabel = LABEL_TRANSLATION[value] || value;

    const rowsBodyEl = card.querySelector('[data-hotel-offer-body]');
    const rowsArr = Array.from(card.querySelectorAll('[data-hotel-offer-row]'));

    rowsArr.sort((a, b) => {
      const textA = a
        .querySelector(`[data-label="${russianLabel}"]`)
        .textContent.trim();
      const textB = b
        .querySelector(`[data-label="${russianLabel}"]`)
        .textContent.trim();

      let itemA;
      let itemB;
      if (value==="date") {
        const formattedA = formatStringDate(textA);
        const formattedB = formatStringDate(textB);

        const [dayA, monthA, yearA] = formattedA.split('.');
        const [dayB, monthB, yearB] = formattedB.split('.');

        itemA = new Date(`${yearA}-${monthA}-${dayA}`);
        itemB = new Date(`${yearB}-${monthB}-${dayB}`);

      } else {
        itemA = parseInt(textA.replace(/\D/g, ''), 10);
        itemB = parseInt(textB.replace(/\D/g, ''), 10);
      }

      switch (direction) {
        case 'ascending':
          return itemA - itemB;
        case 'descending':
          return itemB - itemA;
        default:
          return 0;
      }
    });
    rowsArr.forEach(row => rowsBodyEl.appendChild(row));
  }
}
