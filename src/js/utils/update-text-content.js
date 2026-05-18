export const updateTextContent = (container,selector, value) => {
  const el = container.querySelector(selector);
  if (el) el.textContent = value ?? '';
}