export const initAccordion=(card) =>{
  if (!card) return;

    const toggleBtnEl = card.querySelector('[data-hotel-card-toggle]');
    if (!toggleBtnEl)  return;

    if (toggleBtnEl.dataset.accordionInit) return;
    toggleBtnEl.dataset.accordionInit="true";

    toggleBtnEl.addEventListener('click', () => {
      card.classList.toggle('is-open');
      updateButtonState(card,toggleBtnEl);
    });
};

window.addEventListener('resize', () => {
  const hotelCardList = document.querySelectorAll('[data-hotel-card]');
  hotelCardList.forEach(card => {
    if (card.classList.contains('is-open')) {
      card.classList.remove('is-open');
      const btn = card.querySelector('[data-hotel-card-toggle]');
      if (btn) updateButtonState(card, btn);
    }
  });
});

function updateButtonState(card,btn) {
  const isOpen = card.classList.contains('is-open');
  btn.textContent = isOpen ? "закрыть" : "Открыть";
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  btn.classList.toggle('btn_orange', !isOpen);
  btn.classList.toggle('btn_bordered', isOpen);
}