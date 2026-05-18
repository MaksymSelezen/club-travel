import '@/js/layout/burger-menu.js';
import '@/js/layout/header-account-dropdown.js';
import '@/js/layout/header-scroll-state.js';
import '@/js/sections/main/hero-swiper.js';

import { renderNewsCards } from '@/js/components/render-news-cards.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderNewsCards('.news');
});

