  import Swiper from 'swiper';
  import { Navigation, Autoplay } from 'swiper/modules';
  // import Swiper, { Navigation, Autoplay } from 'swiper';

  export function initCardsSwiper(className, desktopSlides) {
    // const sliderContainer = document.querySelector(className);
    const sliderContainer = typeof className === 'string' ? document.querySelector(className) : className;
    if (!sliderContainer) return;
    const sliderEl = sliderContainer.querySelector('.swiper');
    const slidesWrap = sliderContainer.querySelector('.swiper-wrapper');
    const slides = sliderContainer.querySelectorAll('.swiper-slide');
    const btnNext = sliderContainer.querySelector('[data-btn-next]');
    const btnPrev = sliderContainer.querySelector('[data-btn-prev]');

    if (!desktopSlides) desktopSlides = 1;
    if (slides.length < 6) {
      slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        slidesWrap.appendChild(clone);
      });
    }

    const breakpoints ={};
    if (desktopSlides === 4) {
      breakpoints[450] = { slidesPerView: 1.5 };
      breakpoints[600] = { slidesPerView: 2 };
      breakpoints[750] = { slidesPerView: 2.5 };
      breakpoints[1024] = { slidesPerView: 3 };
      breakpoints[1200] = { slidesPerView: 4 };
    }
    else if (desktopSlides === 3) {
      breakpoints[450] = { slidesPerView: 1.5 };
      breakpoints[600] = { slidesPerView: 2 };
      breakpoints[750] = { slidesPerView: 2.5 };
      breakpoints[1200] = { slidesPerView: 3 };
  }

    if (sliderEl.swiper) return;
    if (sliderEl) {
      new Swiper(sliderEl, {
        modules: [Navigation, Autoplay],

        slidesPerView: 1,
        spaceBetween: 30,
        grabCursor: true,
        loop: slides.length > 1,
        loopAdditionalSlides: 2,
        lazy: {
          loadPrevNext: true,
          loadOnTransitionStart: true,
        },

        pauseOnMouseEnter: true,
        preventInteractionOnTransition: false,

        // observer:true,
        // observeParents: true,
        // speed: 1500,
        // autoplay: {
        //   delay: 4000,
        //   disableOnInteraction: false,
        // },

        navigation: {
          nextEl: btnNext,
          prevEl: btnPrev,
        },

        breakpoints: breakpoints,
      });
    }
  }
