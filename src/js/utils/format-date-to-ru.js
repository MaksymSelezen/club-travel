export const formatIsoDateToRu = (isoDateString) => {
  if (!isoDateString) return "—";

  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) return isoDateString;

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).replace(' г.', '');
};