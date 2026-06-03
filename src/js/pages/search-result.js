import '@/js/layout/burger-menu.js';
import '@/js/layout/header-account-dropdown.js';
import '@/js/layout/header-scroll-state.js';
import '@/js/sections/main/hero-swiper.js';
import { tourSearchReady } from '@/js/components/tour-search.js';

import { initSelect } from '@/js/ui/custom-select.js';
import { renderHotelCards } from '@/js/sections/search-result/render-hotel-cards.js';
import { dynamicUrl } from '@/js/components/dynamic-url.js';
import { syncFilterQueryString } from '@/js/services/api/getQueries.js';

const updateSearchUrl = queryString => {
  const nextUrl = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;

  window.history.replaceState({}, '', nextUrl);
};

document.addEventListener('DOMContentLoaded', async () => {
  initSelect();

  await tourSearchReady;
  updateSearchUrl(syncFilterQueryString());

  document.addEventListener('tour-search:change', event => {
    updateSearchUrl(event.detail.queryString);
    renderHotelCards();
  });

  await renderHotelCards();

  dynamicUrl();
});
