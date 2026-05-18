import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
// import 'swiper/css';

const heroSwiperElement = document.querySelector('.js-main-hero-swiper');
const desktopMediaQuery = window.matchMedia('(min-width: 1366px)');

let heroSwiper = null;

const initHeroSwiper = () => {
  if (!heroSwiperElement || heroSwiper) {
    return;
  }

  heroSwiper = new Swiper(heroSwiperElement, {
    modules: [Navigation],
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 600,
    loop: true,
    grabCursor: true,

    navigation: {
      prevEl: '.js-main-hero-prev',
      nextEl: '.js-main-hero-next',
    },
  });
};

const destroyHeroSwiper = () => {
  if (!heroSwiper) {
    return;
  }

  heroSwiper.destroy(true, true);
  heroSwiper = null;
};

const toggleHeroSwiper = () => {
  if (desktopMediaQuery.matches) {
    initHeroSwiper();
    return;
  }

  destroyHeroSwiper();
};

toggleHeroSwiper();

desktopMediaQuery.addEventListener('change', toggleHeroSwiper);
