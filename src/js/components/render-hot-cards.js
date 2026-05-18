import { getHotOffers } from '@/js/services/api/getHotOffers.js';
import { updateTextContent } from '@/js/utils/update-text-content.js';
import { formatMoney } from '@/js/utils/format-money.js';

export const renderHotCards = async (className, maxCards) => {
  const cardsData = (await getHotOffers(maxCards)) || [];
  const container = document.querySelector(className);
  if (!container) return;

  const templateWrapper = container.querySelector('[data-template]');
  const templateCard = templateWrapper.content.querySelector('[data-card]');
  const cardsWrapper = container.querySelector('[data-wrapper]');

  const cardsList = [];
  const cardsToRender = Math.min(maxCards || cardsData.length, cardsData.length);
  cardsWrapper.innerHTML = '';

  for (let i = 0; i < cardsToRender; i++) {
    const card = templateCard.cloneNode(true);
    if (container.querySelector('.swiper')) card.classList.add('swiper-slide');

    const cardImg = card.querySelector('[data-card-img]');
    const cardOldPrice = card.querySelector('[data-card-old-price]');
    const cardDiscountWrap = card.querySelector('[data-badge]');
    const cardRating = card.querySelector('[data-rating]');
    const starsList = cardRating?.querySelectorAll('svg') || [];
    const location = [cardsData[i].country, cardsData[i].region].filter(Boolean).join(', ');

    if (cardImg && cardsData[i].coverImage) {
      cardImg.src = cardsData[i].coverImage;
      cardImg.alt = cardsData[i].hotelName || location;
    }

    updateTextContent(card, '[data-card-hotel]', cardsData[i].hotelName);
    updateTextContent(card, '[data-card-date]', cardsData[i].date);
    updateTextContent(card, '[data-card-location]', location);


    if (cardsData[i].discount && cardDiscountWrap) {
      updateTextContent(cardDiscountWrap, 'span', `-${cardsData[i].discount}%`);
      cardDiscountWrap.classList.add('is-true');
    }

    if (cardsData[i].oldPrice && cardOldPrice) {
      updateTextContent(
        card, '[data-card-old-price]', `${formatMoney(cardsData[i].oldPrice)}€/чел`,
      );
      cardOldPrice.classList.add('is-true');
    }

    updateTextContent(card, '[data-card-price]', formatMoney(cardsData[i].price));

    if (cardRating && cardsData[i].stars) {
      for (let j = 0; j < Number(cardsData[i].stars); j++) {
        if (starsList[j]) starsList[j].classList.add('is-true');
      }
    }

    cardsList.push(card);
  }
  cardsWrapper.append(...cardsList);
};
