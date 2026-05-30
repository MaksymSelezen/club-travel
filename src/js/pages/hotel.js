import '@/js/layout/burger-menu.js';
import '@/js/layout/header-account-dropdown.js';
import '@/js/layout/header-scroll-state.js';
import '@/js/sections/main/hero-swiper.js';

import { initSelect, updateGuestValue } from '@/js/ui/custom-select.js';
import { initCounter } from '@/js/ui/counter.js';

// import { hotelDataMapper } from '@/js/sections/hotel/hotel-data-mapper.js';
import { renderSlides } from '@/js/sections/hotel/render-swiper-thumbs.js';
import { innitSwiperThumbs } from '@/js/sections/hotel/swiper-tumbs.js';
import { renderInfoHotel } from '@/js/sections/hotel/render-info-hotel.js';
import { renderBadgeHotel } from '@/js/sections/hotel/render-badge-hotel.js';
import { renderSelectedTour } from '@/js/sections/hotel/render-selected-tour.js';

import { renderHotCards } from '@/js/components/render-hot-cards.js';
import { initCardsSwiper } from '@/js/components/cards-swiper.js';
import { dynamicUrl } from '@/js/components/dynamic-url.js';
import { HotelRedirect } from '@/js/sections/hotel/hotel-redirect.js';

document.addEventListener('DOMContentLoaded', async () => {
  const hotelData = await HotelRedirect();
  console.log(hotelData);
  if (!hotelData) return;

  // const hotelDataPromise = hotelDataMapper();

  initSelect();
  initCounter();

  document.querySelectorAll('[data-guests-selector]').forEach(guestSelect => {
    updateGuestValue(guestSelect);
  });

  // const hotelData = await hotelDataPromise;
  renderSlides(hotelData.gallery);
  requestAnimationFrame(() => {
    innitSwiperThumbs('[data-swiper-thumbs]');
  });

  renderInfoHotel(hotelData.info);
  renderBadgeHotel(hotelData.badge);
  renderSelectedTour(hotelData.bookingCard);

  await renderHotCards('.hotel-page__promo-tours', 5);
  requestAnimationFrame(() => {
    initCardsSwiper('.hotel-page__promo-tours', 3);
  });

  dynamicUrl();
});
