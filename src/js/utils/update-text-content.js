export const updateTextContent = (element, value) => {
  if (!element) return;

  element.textContent = String(value ?? '');
};