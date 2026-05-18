import '@/js/layout/burger-menu.js';
import '@/js/layout/header-account-dropdown.js';
import '@/js/layout/header-scroll-state.js';
import '@/js/sections/main/hero-swiper.js';
import '@/js/components/tour-search.js';


import { initSelect } from '@/js/ui/custom-select.js';
import { initCardsSwiper } from '@/js/components/cards-swiper.js';

document.addEventListener('DOMContentLoaded', async () => {
  initSelect();
  initCardsSwiper('.hotel-summary');
});

