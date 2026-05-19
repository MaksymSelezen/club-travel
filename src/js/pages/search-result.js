import '@/js/layout/burger-menu.js';
import '@/js/layout/header-account-dropdown.js';
import '@/js/layout/header-scroll-state.js';
import '@/js/sections/main/hero-swiper.js';
import '@/js/utils/restore-filter-from-url.js';
import '@/js/components/tour-search.js';

import { initSelect } from '@/js/ui/custom-select.js';
import { initCardsSwiper } from '@/js/components/cards-swiper.js';
import { initAccordion } from '@/js/sections/search-result/init-accordion.js';

document.addEventListener('DOMContentLoaded', async () => {
  initSelect();

  document.querySelectorAll('.hotel-summary').forEach(card => {
    initCardsSwiper(card); // Передаємо сам елемент, без унікальних id чи класів!
  });

  initAccordion();
});



document.querySelectorAll('[data-hotel-card]').forEach(card => {});
const hotelCardList = document.querySelectorAll('[data-hotel-card]');
hotelCardList.forEach(card => {
  sortInCard(card);
});

function sortInCard(card) {
  const sortBtnWrap = card.querySelector('.hotel-offers__head-btn-wrap');
  const sortBtn = sortBtnWrap.querySelector('[data-column-sort="period"]');

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

  function sortRow() {
    const currentArial = sortBtnWrap.getAttribute('aria-sort');

    const rowsBodyEl = card.querySelector('[data-hotel-offer-body]');
    const rowsArr = Array.from(card.querySelectorAll('[data-hotel-offer-row]'));
    rowsArr.sort((a, b) => {
      const aText = a.querySelector('[data-label="Период"]').textContent.trim();
      const bText = b.querySelector('[data-label="Период"]').textContent.trim();

      const aNum = parseInt(aText, 10);
      const bNum = parseInt(bText, 10);
      switch (currentArial){
        case 'asc': return aNum - bNum;
        case 'desc': return bNum - aNum;
        default:
          return 0;
      }

    });
    rowsArr.forEach(row => rowsBodyEl.appendChild(row));
  }
}
