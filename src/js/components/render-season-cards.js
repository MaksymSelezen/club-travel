import { getSeasonTour } from '@/js/services/api/getSeasonTour.js';
import { updateTextContent } from '@/js/utils/update-text-content.js';

function seasonCardMapper(data) {
  const location = [data.country, data.region].filter(Boolean).join(', ');

  return {
    id: data.id || '',
    coverImage: data.coverImage || '',
    location: location || data.country || '',
    price: data.price ? `${data.price}€` : '0€',
  };
}

export const renderSeasonCards = async (season, className, maxCards) => {
  const rawData = await getSeasonTour(season, maxCards);
  const cardsData = (rawData || []).map(seasonCardMapper);

  const container = document.querySelector(className);
  if (!container) return;
  const templateWrapper = container.querySelector('[data-template]');
  const templateCard = templateWrapper.content.querySelector('[data-card]');
  const cardsWrapper = container.querySelector('[data-wrapper]');

  const blockFragment = document.createDocumentFragment();
  const cardsToRender = Math.min(maxCards || cardsData.length, cardsData.length);
  cardsWrapper.innerHTML = '';

  for (let i = 0; i < cardsToRender; i++) {
    const tour = cardsData[i];
    const card = templateCard.cloneNode(true);
    if (container.querySelector('.swiper')) card.classList.add('swiper-slide');

    const imgEl = card.querySelector('[data-card-img]');
    const locationEl = card.querySelector('[data-card-location]');
    const priceEl = card.querySelector('[data-card-price]');
    const btnEl = card.querySelector('[data-card-btn]');
    if (btnEl && tour.id) {
      btnEl.dataset.params = `id=${tour.id}`;
    }

    if (imgEl && tour.coverImage) {
      imgEl.src = tour.coverImage;
      imgEl.alt = tour.location;
    }

    updateTextContent(locationEl, tour.location);
    updateTextContent(priceEl, tour.price);

    blockFragment.append(card);
  }
  cardsWrapper.append(blockFragment);
};
