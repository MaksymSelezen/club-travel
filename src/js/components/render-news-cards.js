import { getNews } from '@/js/services/api/getNews.js';
import { updateTextContent } from '@/js/utils/update-text-content.js';
import { formatMoney } from '@/js/utils/format-money.js';

function newsCardMapper(data) {
  return {
    id: data.id || '',
    title: data.title || '',
    image: data.image || '',
    countryName: data.countryName || '',
    altText: data.title || data.countryName || '',
    date: data.date || '',
    price: data.price ? `от ${formatMoney(data.price)}€` : '',
    hasPrice: Boolean(data.price),
    hasDate: Boolean(data.date),
  };
}

export const renderNewsCards = async (className, maxCards) => {
  const rawData = await getNews(maxCards);
  const cardsData = (rawData || []).map(newsCardMapper);

  const container = document.querySelector(className);
  if (!container) return;
  const templateWrapper = container.querySelector('[data-template]');
  const templateCard = templateWrapper.content.querySelector('[data-card]');
  const cardsWrapper = container.querySelector('[data-wrapper]');

  const blockFragment = document.createDocumentFragment();
  const cardsToRender = Math.min(maxCards || cardsData.length, cardsData.length);
  cardsWrapper.innerHTML = '';

  for (let i = 0; i < cardsToRender; i++) {
    const news = cardsData[i];
    const card = templateCard.cloneNode(true);
    // card.dataset.id=news.id
    card.dataset.params=`id=${news.id}`;

    if (container.querySelector('.swiper')) card.classList.add('swiper-slide');

    const imgEl = card.querySelector('[data-card-img]');
    const priceWrap = card.querySelector('[data-badge]');
    const dateWrap = card.querySelector('[data-card-date]');
    const titleEl = card.querySelector('[data-card-title]');

    if (imgEl && news.image) {
      imgEl.src = news.image;
      imgEl.alt = news.title || news.countryName;
    }

    updateTextContent(titleEl, news.title);

    if (priceWrap && news.price) {
      const priceEl = priceWrap.querySelector('span');
      updateTextContent(priceEl, news.price);
      priceWrap.classList.add('has-price');
    } else if (priceWrap) {
      priceWrap.classList.remove('has-price');
    }

    if (dateWrap && news.date) {
      const dateEl = dateWrap.querySelector('span');
      updateTextContent(dateEl, news.date);
      dateWrap.classList.add('has-date');
    } else if (dateWrap) {
      dateWrap.classList.remove('has-date');
    }

    blockFragment.append(card);
  }
  cardsWrapper.append(blockFragment);
};
