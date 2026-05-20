export const initAccordion=() =>{
  const hotelCardList = document.querySelectorAll('[data-hotel-card]');
  hotelCardList.forEach(card => {
    const toggleBtnEl = card.querySelector('[data-hotel-card-toggle]');
    toggleBtnEl.addEventListener('click', () => {
      card.classList.toggle('is-open');
    });
  });

  window.addEventListener('resize', () => {
    hotelCardList.forEach(card => {
      card.classList.remove('is-open');
    });
  });
}