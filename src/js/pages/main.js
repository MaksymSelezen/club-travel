import '@/js/layout/burger-menu.js';
import '@/js/layout/header-account-dropdown.js';
import '@/js/layout/header-scroll-state.js';
import '@/js/sections/main/hero-swiper.js';
import '@/js/components/tour-search.js';

import { renderNewsCards } from '@/js/components/render-news-cards.js';
import { renderHotCards } from '@/js/components/render-hot-cards.js';
import { renderSeasonCards } from '@/js/sections/main/render-season-cards.js';
import { initCardsSwiper } from '@/js/components/cards-swiper.js';

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    renderNewsCards('.promo-company').then(() =>
      initCardsSwiper('.promo-company', 3),
    ),
    renderHotCards('.promo-offers').then(() =>
      initCardsSwiper('.promo-offers', 3),
    ),
    renderSeasonCards('winter', '.promo-winter-tours').then(() =>
      initCardsSwiper('.promo-winter-tours', 4),
    ),
    renderSeasonCards('summer', '.promo-summer-tours').then(() =>
      initCardsSwiper('.promo-summer-tours', 4),
    ),
  ]);
});
