const tourSearchForm = document.querySelector('[data-tour-search-form]');

const restoreFilterFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  

  if ([...urlParams].length === 0) return;

  const directionInput = tourSearchForm.querySelector('[data-tour-search-field]');
  if (directionInput && urlParams.has('direction')) {
    directionInput.value = urlParams.get('direction');
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
  restoreCheckboxesFromURL('region', 'region');
};

restoreFilterFromURL();
