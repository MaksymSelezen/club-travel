import { formatMoney } from '@/js/utils/format-money.js';
import { updateTextContent } from '@/js/ui/update-text-content.js';

const inputsTrackers = new WeakMap();

export function renderSelectedTour(tour) {
  const container = document.querySelector('[data-booking="container"]');
  if (!container) return;

  const elements ={
    period : container.querySelector('[data-booking="period"] span'),
    tour : container.querySelector('[data-booking="tour"] span'),
    departure : container.querySelector('[data-booking="departure"] span'),
    meal : container.querySelector('[data-booking="meal"] span'),
    price : container.querySelector('[data-booking="pricePerson"]'),
  }

  updateTextContent(elements.period,tour.period);
  updateTextContent(elements.tour,tour.tourLineup);
  updateTextContent(elements.departure,tour.departureCity);
  updateTextContent(elements.meal,tour.typeOfMeal);
  updateTextContent(elements.price,tour.priceForPerson);

  initGuestsListeners(container, tour);
}

function initGuestsListeners(container, tour) {
  const inputs = container.querySelectorAll('[data-guests-adults-input],[data-guests-children-input]');

  const handleUpdate = () => calcFinalValue(container, tour);

  inputs.forEach((input) => {
    const previousHandler = inputsTrackers.get(input);
    if (previousHandler) {
      input.removeEventListener('input', previousHandler);
    }

    input.addEventListener('input', handleUpdate);
    inputsTrackers.set(input, handleUpdate);
  })
  handleUpdate();
}

function calcFinalValue(container, tour) {
  // const wrapEl = container.querySelector('[data-guests-selector]');
  // if (!wrapEl) return;

  const elements ={
    finalPrice : container.querySelector('[data-booking="final-price"]'),
    adultInput : container.querySelector('[data-guests-adults-input]'),
    childrenInput : container.querySelector('[data-guests-children-input]'),
  }

  const priceValue = Number(tour.priceForPerson.replace(/[^\d.]/g, ''));
  const adultValue = Number(elements.adultInput?.value || 0);
  const childrenValue = Number(elements.childrenInput?.value || 0);
  const finalPrice = Math.round(priceValue * (adultValue + childrenValue*0.5));
  updateTextContent(elements.finalPrice, formatMoney(finalPrice) +"€");
}


