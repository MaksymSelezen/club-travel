export const initAccordion=() =>{
  const hotelCardList = document.querySelectorAll('[data-hotel-card]');
  hotelCardList.forEach(card => {
    const toggleBtnEl = card.querySelector('[data-hotel-card-toggle]');
    toggleBtnEl.addEventListener('click', () => {
      card.classList.toggle('is-open');
      updateButtonState(card,toggleBtnEl);
    });
  });

  window.addEventListener('resize', () => {
    hotelCardList.forEach(card => {
      card.classList.remove('is-open');
    });
  });
}

function updateButtonState(card,btn) {
  const isOpen = card.classList.contains('is-open');
  btn.textContent = isOpen ? "закрыть" : "Открыть";
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  btn.classList.toggle('btn_orange', !isOpen);
  btn.classList.toggle('btn_bordered', isOpen);
}