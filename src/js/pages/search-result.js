import '@/js/layout/burger-menu.js';
import '@/js/layout/header-account-dropdown.js';
import '@/js/layout/header-scroll-state.js';
import '@/js/sections/main/hero-swiper.js';
import { tourSearchReady } from '@/js/components/tour-search.js';

import { initSelect } from '@/js/ui/custom-select.js';
import { renderHotelCards } from '@/js/sections/search-result/render-hotel-cards.js';
import { dynamicUrl } from '@/js/components/dynamic-url.js';

document.addEventListener('DOMContentLoaded', async () => {
  initSelect();

  await tourSearchReady;
  await renderHotelCards();

  document.addEventListener('tour-search:change', () => {
    renderHotelCards();
  });

  dynamicUrl();
});
