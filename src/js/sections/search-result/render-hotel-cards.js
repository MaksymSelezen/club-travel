import { findHotels } from '@/js/services/api/findHotels.js';
import { getFilterState } from '@/js/services/api/getQueries.js';
import { convertStateToStrapiQuery } from '@/js/utils/format-query-to-strapi-req.js';
import { updateTextContent } from '@/js/utils/update-text-content.js';
import { initCardsSwiper } from '@/js/components/cards-swiper.js';
import { initAccordion } from '@/js/sections/search-result/init-accordion.js';
import { hotelCardDataMapper } from '@/js/sections/search-result/hotel-card-data-mapper.js';
import { initSortInCard } from '@/js/sections/search-result/init-sort-in-card.js';

let allCardsData = [];
let currentRenderedCount = 0;
const CHUNK_SIZE = 5;

export const renderHotelCards = async () => {
  const state =  getFilterState();
  const strapiQueryString = convertStateToStrapiQuery(state);
  const rawData = await findHotels(strapiQueryString);
  console.log(rawData);

  allCardsData = rawData.map(hotelCardDataMapper);
  console.log("cardsData", allCardsData);

  const container = document.querySelector('[data-card-container]');
  // const templateEl = container.querySelector('[data-card-template]');
  // const cardEl=templateEl.content.querySelector('[data-hotel-card]');

  container.querySelectorAll('[data-hotel-card]').forEach(card => card.remove());

  currentRenderedCount = 0;
  const loadMoreBtn = document.querySelector('[data-btn-more]');
  if (loadMoreBtn) {
    loadMoreBtn.onclick = renderNextChunk; // При клике вызываем функцию отрисовки следующей порции
  }
  renderNextChunk();
}

function renderNextChunk() {
  const container = document.querySelector('[data-card-container]');
  const templateEl = container.querySelector('[data-card-template]');
  const cardEl = templateEl.content.querySelector('[data-hotel-card]');
  const loadMoreBtn = document.querySelector('[data-btn-more]');

  const nextChunk = allCardsData.slice(currentRenderedCount, currentRenderedCount + CHUNK_SIZE);
  const blockFragment = document.createDocumentFragment();

  nextChunk.forEach(hotel => {
    const clonCard = cardEl.cloneNode(true);
    renderAboutHotel(clonCard, hotel);
    renderCardSwiper(clonCard, hotel.gallery);
    renderOffers(clonCard, hotel.offers);
    initAccordion(clonCard);
    blockFragment.append(clonCard);
  });

  container.append(blockFragment);

  currentRenderedCount += nextChunk.length;

  if (loadMoreBtn) {
    if (currentRenderedCount >= allCardsData.length) {
      loadMoreBtn.classList.add('is-hidden');
    } else {
      loadMoreBtn.classList.remove('is-hidden');
    }
  }
}

function renderAboutHotel(clonCard,hotel){
  const descriptionEl  = clonCard.querySelector('[data-hotel-description]');
  const titleEl  = clonCard.querySelector('[data-hotel-title]');
  const locationList  = clonCard.querySelectorAll('[data-hotel-location]');
  const offersNumberEl = clonCard.querySelector('[data-hotel-offers-number]');
  const minPriceEl = clonCard.querySelector('[data-hotel-price]');
  const hotelLinkList = clonCard.querySelectorAll('[data-hotel-link');

  const nightsHeadEl = clonCard.querySelector('[data-hotel-summary-nights]');
  const mealHeadEl = clonCard.querySelector('[data-hotel-summary-meal]');
  const roomHeadEl = clonCard.querySelector('[data-hotel-summary-room]');
  const beachHeadEl = clonCard.querySelector('[data-hotel-summary-beach]');
  const starsListEl = clonCard.querySelectorAll('[data-rating] svg');


  updateTextContent(descriptionEl, hotel.desc);
  updateTextContent(titleEl, hotel.hotelName);
  locationList.forEach(location => {
    updateTextContent(location, hotel.location);
  });
  updateTextContent(offersNumberEl, hotel.offersNumber);
  updateTextContent(minPriceEl, hotel.minPrice);

  hotelLinkList.forEach(link => {
    link.dataset.params=`id=${hotel.id}`;
  })

  updateTextContent(nightsHeadEl, hotel.daysDuration);
  updateTextContent(mealHeadEl, hotel.meal);
  updateTextContent(roomHeadEl, hotel.lineup);
  updateTextContent(beachHeadEl, hotel.beach);

  for (let i = 0; i < hotel.stars; i++) {
    if (starsListEl[i]) starsListEl[i].classList.add('is-true');
  }
}

function renderCardSwiper(clonCard,gallery) {
  const swiperWrapper= clonCard.querySelector('[data-swiper-wrapper]');
  const templateSwiperEl = clonCard.querySelector('[data-swiper-template]');
  const slideEl = templateSwiperEl.content.querySelector('[data-swiper-slide]');

  const swiperFragment = document.createDocumentFragment();
  gallery.forEach(img => {
    const cloneSlide = slideEl.cloneNode(true);
    const slideImg =cloneSlide.querySelector('img');

    slideImg.src = img.url;
    slideImg.alt= img.alternativeText;

    swiperFragment.append(cloneSlide);
  });

  swiperWrapper.append(swiperFragment);
  initCardsSwiper(clonCard,1);
}

function renderOffers(clonCard,offers){
  if (!offers || !offers.length) { return}

  const offersContainer = clonCard.querySelector('[data-hotel-offer-body]');
  const offersNone = offersContainer.querySelector('[data-offers-empty]');
  offersNone.classList.add('is-hidden');

  const offersTemplateEl = offersContainer.querySelector('[data-hotel-offer-template]');
  const offerRow = offersTemplateEl.content.querySelector('[data-hotel-offer-row]');

  const offersFragment = document.createDocumentFragment();
  offers.forEach(offer => {
    const cloneRow = offerRow.cloneNode(true);
    const dateEl = cloneRow.querySelector('[data-offer-date]');
    const nightsEl = cloneRow.querySelector('[data-offer-nights]');
    const mealEl = cloneRow.querySelector('[data-offer-meal]');
    const roomEl = cloneRow.querySelector('[data-offer-room]');
    const seatsEl = cloneRow.querySelector('[data-offer-flight-seats]');
    const priceEl = cloneRow.querySelector('[data-offer-price]');
    const linkEl = cloneRow.querySelector('[data-offer-link]');

    updateTextContent(dateEl,offer.date);
    updateTextContent(nightsEl,offer.nights);
    updateTextContent(mealEl,offer.meal);
    updateTextContent(roomEl, offer.room);
    updateTextContent(seatsEl,offer.seats);
    updateTextContent(priceEl,offer.price);
    linkEl.dataset.params=`id=${offer.id}`;

    offersFragment.append(cloneRow);
  });
  offersContainer.append(offersFragment);
  initSortInCard(clonCard);
}