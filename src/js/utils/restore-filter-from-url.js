const tourSearchForm = document.querySelector('[data-tour-search-form]');

export const restoreFilterFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  

  if ([...urlParams].length === 0) return;

  const directionInput = tourSearchForm.querySelector('select[name="direction"]');
  if (directionInput && urlParams.has('direction')) {
    directionInput.value = urlParams.get('direction');
  }

  const durationInput = tourSearchForm.querySelector('select[name="duration"]');
  if (durationInput && urlParams.has('duration')) {
    durationInput.value = urlParams.get('duration');
  }

  const minPriceInput = tourSearchForm.querySelector('[data-tour-search-price-min]');
  const maxPriceInput = tourSearchForm.querySelector('[data-tour-search-price-max]');
  if (minPriceInput && urlParams.has('priceMin')) minPriceInput.value = urlParams.get('priceMin');
  if (maxPriceInput && urlParams.has('priceMax')) maxPriceInput.value = urlParams.get('priceMax');

  const restoreCheckboxesFromURL = (paramName, inputName) => {
    const rawValue = urlParams.get(paramName); 
    if (!rawValue) return;

    const savedValues = rawValue.split(','); 
    const checkboxes = tourSearchForm.querySelectorAll(`input[name="${inputName}"]`);
    
    checkboxes.forEach(cb => {
      cb.checked = savedValues.includes(cb.value);
    });
  };

  restoreCheckboxesFromURL('accommodation', 'accommodation');
  restoreCheckboxesFromURL('meal', 'meal');
  restoreCheckboxesFromURL('tourComposition', 'tourComposition');
  restoreCheckboxesFromURL('departureCity', 'departureCity');
  restoreCheckboxesFromURL('regions', 'region');
};

restoreFilterFromURL();
