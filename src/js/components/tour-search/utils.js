export function getCountryValue(country) {
  return (
    country.slug ||
    country.documentId ||
    String(country.id || country.name || '')
  );
}

export function getRegionCountryValue(region) {
  const country = region.country;

  return country
    ? country.slug ||
        country.documentId ||
        String(country.id || country.name || '')
    : '';
}

export function getRegionValue(region) {
  return region.slug || region.documentId || String(region.id || '');
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function normalizeAccommodationValue(value) {
  const trimmed = String(value || '').trim();
  const legacyMatch = trimmed.match(/^(\d+)-stars$/);

  if (legacyMatch) return legacyMatch[1];

  return trimmed;
}

function isValidAccommodationStar(value) {
  return /^[1-5]$/.test(String(value || '').trim());
}

export function getSavedValues(urlParams, paramName) {
  const values = (urlParams.get(paramName) || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  if (paramName === 'accommodation') {
    return values
      .map(normalizeAccommodationValue)
      .filter(isValidAccommodationStar);
  }

  return values;
}
