import { updateTextContent } from '@/js/ui/update-text-content.js';

export function renderBadgeHotel(badge) {
  // const features= info.features;
  const container = document.querySelector('[data-badge="container"]');
  if (!container) return;

  const elements ={
    title: container.querySelector('[data-badge="title"]'),
    location: container.querySelector('[data-badge="location"]'),
    stars: container.querySelectorAll('[data-rating] svg'),
  }

  updateTextContent(elements.title, badge.hotelName);
  updateTextContent(elements.location, badge.location);

  elements.stars.forEach((star, index) => {
    star.classList.toggle(
      'is-true',
      index < Number(badge.stars)
    );
  });
}
