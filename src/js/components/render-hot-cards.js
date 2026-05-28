import { getHotOffers } from '@/js/services/api/getHotOffers.js';
import { updateTextContent } from '@/js/utils/update-text-content.js';
import { formatMoney } from '@/js/utils/format-money.js';

function hotCardMapper(data){
  const location = [data.country, data.region].filter(Boolean).join(', ');

  return {
    id: data.id || '',
    hotelName: data.hotelName || '',
    date: data.date || '',
    coverImage: data.coverImage || '',
    stars: Number(data.stars || 0),
    location: location || data.country || '',
    price: data.price ? `${formatMoney(data.price)}€` : '0€',
    oldPrice: data.oldPrice ? `${formatMoney(data.oldPrice)}€/чел` : '',
    discount: data.discount ? `-${data.discount}%` : '',
    hasDiscount: Boolean(data.discount),
    hasOldPrice: Boolean(data.oldPrice),
  }
}

export const renderHotCards = async (className, maxCards) => {
  const rawData = (await getHotOffers(maxCards)) || [];
  const cardsData = rawData.map(hotCardMapper);

  const container = document.querySelector(className);
  if (!container) return;

  const templateWrapper = container.querySelector('[data-template]');
  const templateCard = templateWrapper.content.querySelector('[data-card]');
  const cardsWrapper = container.querySelector('[data-wrapper]');


  const blockFragment = document.createDocumentFragment();
  const cardsToRender = Math.min(maxCards || cardsData.length, cardsData.length);
  cardsWrapper.innerHTML = '';


  for (let i = 0; i < cardsToRender; i++) {
    const offer = cardsData[i];
    const card = templateCard.cloneNode(true);
    card.dataset.paramsId=offer.id;

    if (container.querySelector('.swiper')) card.classList.add('swiper-slide');

    const cardImg = card.querySelector('[data-card-img]');
    const cardOldPrice = card.querySelector('[data-card-old-price]');
    const cardDiscountWrap = card.querySelector('[data-badge]');
    const cardRating = card.querySelector('[data-rating]');
    const starsList = cardRating?.querySelectorAll('svg') || [];
    const hotelEl = card.querySelector('[data-card-hotel]');
    const dateEl = card.querySelector('[data-card-date]');
    const locationEl = card.querySelector('[data-card-location]');
    const priceEl = card.querySelector('[data-card-price]');

    if (cardImg && offer.coverImage) {
      cardImg.src = offer.coverImage;
      cardImg.alt = offer.hotelName || offer.location;
    }

    updateTextContent(hotelEl, offer.hotelName);
    updateTextContent(dateEl, offer.date);
    updateTextContent(locationEl, offer.location);


    if (offer.hasDiscount && cardDiscountWrap) {
      const discountEl = cardDiscountWrap.querySelector('span');
      updateTextContent(discountEl, offer.discount);
      cardDiscountWrap.classList.add('is-true');
    }

    if (offer.hasOldPrice && cardOldPrice) {
      const oldPriceEl = card.querySelector('[data-card-old-price]');
      updateTextContent(oldPriceEl, offer.oldPrice);
      cardOldPrice.classList.add('is-true');
    }

    updateTextContent(priceEl, offer.price);

    if (cardRating && offer.stars) {
      for (let j = 0; j < offer.stars; j++) {
        if (starsList[j]) starsList[j].classList.add('is-true');
      }
    }

    blockFragment.append(card);
  }
  cardsWrapper.append(blockFragment);
};
