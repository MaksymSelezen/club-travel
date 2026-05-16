import { getNews } from '@/js/services/api/getNews.js';
import { updateTextContent } from '@/js/utils/update-text-content.js';
import { formatMoney } from '@/js/utils/format-money.js';

export const renderNewsCards = async (className, maxCards) => {
  const cardsData = await getNews(maxCards);

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
    const cardPriceWrap = card.querySelector('[data-badge]');
    const cardDateWrap = card.querySelector('[data-card-date]');

    if (cardImg && cardsData[i].image) {
      cardImg.src = cardsData[i].image;
      cardImg.alt = cardsData[i].title || cardsData[i].countryName;
    }

    updateTextContent(card, '[data-card-title]', cardsData[i].title);

    if (cardPriceWrap && cardsData[i].price) {
      updateTextContent(cardPriceWrap, 'span', `от ${formatMoney(cardsData[i].price)}€`);
      cardPriceWrap.classList.add('has-price');
    } else cardPriceWrap.classList.remove('has-price');

    if (cardDateWrap && cardsData[i].date) {
      updateTextContent(cardDateWrap, 'span', cardsData[i].date);
      cardDateWrap.classList.add('has-date');
    } else cardDateWrap.classList.remove('has-date');

    cardsList.push(card);
  }
  cardsWrapper.append(...cardsList);
};
