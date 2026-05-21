import '@/js/layout/burger-menu.js';
import '@/js/layout/header-account-dropdown.js';
import '@/js/layout/header-scroll-state.js';
import '@/js/sections/main/hero-swiper.js';
import '@/js/utils/restore-filter-from-url.js';
import '@/js/components/tour-search.js';


import { initSelect } from '@/js/ui/custom-select.js';
import { initCardsSwiper } from '@/js/components/cards-swiper.js';
import { initAccordion } from '@/js/sections/search-result/init-accordion.js';
import { initSortInCard } from '@/js/sections/search-result/init-sort-in-card.js';
import { renderHotelCards } from '@/js/sections/search-result/render-hotel-cards.js';




document.addEventListener('DOMContentLoaded', async () => {
  initSelect();

  await renderHotelCards()

  // initSortInCard();
});



