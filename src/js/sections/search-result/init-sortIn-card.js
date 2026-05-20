export function initSortInCard(){
  const hotelCardList = document.querySelectorAll('[data-hotel-card]');
  hotelCardList.forEach(card => {
    sortInCard(card);
  });
}


function sortInCard(card) {
  const sortBtnWrap = card.querySelector('.hotel-offers__head-btn-wrap');
  const sortBtn = sortBtnWrap.querySelector('[data-column-sort="period"]');

  const valueSelectWrap = card.querySelector('[data-select="valueSort"]');
  const directionSelectWrap = card.querySelector('[data-select="directionSort"]');
  const valueInputEl = valueSelectWrap.querySelector('[data-select-input]');
  const directionInputEl = directionSelectWrap.querySelector('[data-select-input]');

  directionInputEl.addEventListener('change', (e) => {
    sortRow(valueInputEl.value,directionInputEl.value)
  })

  valueInputEl.addEventListener('change', (e) => {
    sortRow(valueInputEl.value,directionInputEl.value)
  })

  sortBtn.addEventListener('click', () => {
    changeArial()
    sortRow()
  });

  function changeArial() {
    const currentArial = sortBtnWrap.getAttribute('aria-sort');
    switch (currentArial) {
      case 'none':
        sortBtnWrap.setAttribute('aria-sort', 'desc');
        break;
      case 'desc':
        sortBtnWrap.setAttribute('aria-sort', 'asc');
        break;
      case 'asc':
        sortBtnWrap.setAttribute('aria-sort', 'desc');
        break;
      default:
        sortBtnWrap.setAttribute('aria-sort', 'desc');
    }
  }

  function sortRow(value, direction) {
    if (!direction) {
      direction = sortBtnWrap.getAttribute('aria-sort');
    }
    if (!value) {
      value = valueInputEl?.value || 'period';
    }

    const labelTranslation = {
      'date': 'Дата',
      'period': 'Период',
      'places': 'Мест',
      'price': 'Стоимость',
    };

    const russianLabel = labelTranslation[value] || value;

    const rowsBodyEl = card.querySelector('[data-hotel-offer-body]');
    const rowsArr = Array.from(card.querySelectorAll('[data-hotel-offer-row]'));
    rowsArr.sort((a, b) => {
      const aText = a.querySelector(`[data-label="${russianLabel}"]`).textContent.trim();
      const bText = b.querySelector(`[data-label="${russianLabel}"]`).textContent.trim();

      const aNum = parseInt(aText.replace(/\D/g, ''), 10);
      const bNum = parseInt(bText.replace(/\D/g, ''), 10);
      switch (direction){
        case 'asc': return aNum - bNum;
        case 'desc': return bNum - aNum;
        default:
          return 0;
      }
    });
    rowsArr.forEach(row => rowsBodyEl.appendChild(row));
  }
}