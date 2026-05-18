export function renderSlides(gallery) {

  const swiperContainer = document.querySelector('[data-swiper-thumbs-container]');
  const mainWrap = swiperContainer.querySelector('[data-main-wrap]');
  const listWrap = swiperContainer.querySelector('[data-list-wrap]');

  const mainSlide = swiperContainer.querySelector(
    '[data-template="main-slide"]',
  )?.content.querySelector('[data-main-slide]');
  const listSlide = swiperContainer.querySelector(
    '[data-template="list-slide"]',
  )?.content.querySelector('[data-list-slide]');

  if (!mainWrap || !listWrap || !mainSlide || !listSlide) return;

  const mainFragment = document.createDocumentFragment();
  const listFragment = document.createDocumentFragment();

  gallery.forEach(item => {
    const mainClone = mainSlide.cloneNode(true);
    const listClone = listSlide.cloneNode(true);

    const mainImg = mainClone.querySelector('[data-img]');
    const listImg = listClone.querySelector('[data-img]');

    mainImg.alt = item.alt.trim();
    mainImg.src = item.mainSrc;

    listImg.alt = item.alt;
    listImg.src = item.thumbSrc;

    mainFragment.appendChild(mainClone);
    listFragment.appendChild(listClone);
  });
  mainWrap.append(mainFragment);
  listWrap.append(listFragment);
}
