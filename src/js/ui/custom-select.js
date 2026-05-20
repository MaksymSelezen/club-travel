function selectClose() {
  document.querySelectorAll('[data-select].is-open').forEach(select => {
    const triggerEl = select.querySelector('[data-select-trigger]');
    if (!triggerEl) {
      return;
    }

    triggerEl.setAttribute('aria-expanded', 'false');
    select.classList.remove('is-open');
  });
}

window.addEventListener('resize', selectClose);

function selectOption(option) {
  const select = option.closest('[data-select]');
  if (!select) return;
  const allOptions = select.querySelectorAll('[data-select-option]');
  const label = select.querySelector('[data-select-value]');
  const input = select.querySelector('[data-select-input]');
  if (input && option.dataset.value) {
    input.value = option.dataset.value.trim();
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  if (label) label.textContent = option.textContent.trim();

  allOptions.forEach(opt => opt.setAttribute('aria-selected', 'false'));
  option.setAttribute('aria-selected', 'true');
  selectClose();
}


let isInit = false;
export function initSelect() {
  // updateGuestValue();
  if (isInit) return;
  isInit = true;

  document.addEventListener('click', e => {
    const triggerEl = e.target.closest('[data-select-trigger]');
    const option = e.target.closest('[data-select-option]');
    const isSelectClick = e.target.closest('[data-select]');

    if (option) {
      selectOption(option);
    } else if (triggerEl) {
      const select = triggerEl.closest('[data-select]');
      if (!select) return;
      const isOpen = select.classList.contains('is-open');

      selectClose();

      if (!isOpen) {
        select.classList.add('is-open');
        triggerEl.setAttribute('aria-expanded', 'true');
      }
    }  else if (!isSelectClick) selectClose();
  });
}

export function updateGuestValue(guestSelect) {
  const guestAdult = guestSelect.querySelector('[data-guests-adults]');
  const guestChildren = guestSelect.querySelector('[data-guests-children]');
  const guestAdultInput = guestSelect.querySelector(
    '[data-guests-adults-input]',
  );
  const guestChildrenInput = guestSelect.querySelector(
    '[data-guests-children-input]',
  );

  const guestDropdown = guestSelect.querySelector('[data-guests-dropdown]');
  const counterList = guestDropdown.querySelectorAll('[data-counter]');
  const chips = guestSelect.querySelector('[data-chips]');
  let adult = 0;
  let children = 0;

  counterList.forEach(item => {
    const value = Number(
      item.querySelector('[data-counter-value]').textContent,
    );
    const type = item.dataset.counter;

    if (chips) {
      const chip = chips.querySelector(`[data-chip="${type}"]`);
      if (chip) chip.querySelector('span').textContent = String(value);
    }

    if (type === 'adults') {
      adult = value;
    } else {
      children += value;
    }
  });

  if (guestAdult) guestAdult.textContent = String(adult);
  if (guestAdultInput) {
    guestAdultInput.value = String(adult);
    guestAdultInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
  if (guestChildren) guestChildren.textContent = String(children);
  if (guestChildrenInput) {
    guestChildrenInput.value = String(children);
    guestChildrenInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
