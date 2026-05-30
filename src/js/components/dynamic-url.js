export const dynamicUrl =()=>{
  document.addEventListener('click', e => {
    const paramEl = e.target.closest('[data-params]');
    const windowParamEl = e.target.closest('[data-params-window]');
    if (paramEl) {
      e.preventDefault();
      const originalUrl = paramEl.href;

      window.location.href=originalUrl + '?' + paramEl.dataset.params;
    }

    if (windowParamEl) {
      e.preventDefault();
      const originalUrl = windowParamEl.href;
      const windowUrl = window.location.href;
      const parts = windowUrl.split('?');

      window.location.href=originalUrl + '?' + parts[1];
    }
  });
}