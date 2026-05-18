import '@/js/layout/burger-menu.js';
import '@/js/layout/header-account-dropdown.js';
import '@/js/layout/header-scroll-state.js';
import '@/js/sections/main/hero-swiper.js';

import { initTourSelector } from '@/js/sections/tour-request/init-tour-selector.js';
import { initStrapiTourForm } from '@/js/sections/tour-request/init-strapi-tour-form.js';
import { initSelect, updateGuestValue } from '@/js/ui/custom-select.js';
import { initCounter } from '@/js/ui/counter.js';
import { updateDisabledState } from '@/js/ui/disabled-state.js';

document.addEventListener('DOMContentLoaded', async () => {
  void initStrapiTourForm();
  initTourSelector();
  initCounter();
  initSelect();

  document.querySelectorAll('[data-guests-selector]').forEach((guestSelect) => {
    updateGuestValue(guestSelect);
  });

  updateDisabledState();
});
