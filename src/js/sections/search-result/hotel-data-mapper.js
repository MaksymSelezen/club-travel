import { formatMoney } from '@/js/utils/format-money.js';
import { formatIsoDateToRu } from '@/js/utils/format-date-to-ru.js';

const MEALS_TRANSLATION_MAP = {
  'no-meal': 'Без питания',
  'breakfast': 'Завтрак',
  'breakfast-dinner': 'Завтрак и ужин',
  'breakfast-lunch-dinner': 'Завтрак, обед, ужин',
  'all-inclusive': 'Всё включено',
  'ultra-all-inclusive': 'Ультра: всё включено'
};

function formatMealType(mealType) {
  const raw = MEALS_TRANSLATION_MAP[mealType] || mealType || "—";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function getOfferWord(count) {
  const rule = new Intl.PluralRules('ru-RU').select(count);
  if (rule === 'one') return 'предложение';
  if (rule === 'few') return 'предложения';
  return 'предложений';
}

function getNightsWord(count) {
  const rule = new Intl.PluralRules('ru-RU').select(count);
  if (rule === 'one') return 'ночь';
  if (rule === 'few') return 'ночи';
  return 'ночей';
}

function formatBeachInfo(offers) {
  if (!Array.isArray(offers) || offers.length === 0) return "Пляж: песок, —";

  const distances = offers
    .map(offer => Number(offer.beachDistance))
    .filter(dist => !isNaN(dist) && dist > 0);

  if (distances.length === 0) return "Пляж: песок, —";

  const minDistance = Math.min(...distances);

  return `Пляж: песок, <${minDistance} м`;
}

export function hotelDataMapper(data) {
  if (!data) return {};

  const location = [data.country?.name, data.region?.name].filter(Boolean).join(', ');

  const formattedGallery = Array.isArray(data.gallery)
    ? data.gallery.map(img => ({
      id: img.id,
      url: img.url || "",
      alternativeText: img.alternativeText || data.hotelName || "Hotel image"
    }))
    : [];

  const rawOffers = data.offers ?? [];

  const formattedOffers = rawOffers.map(offer => {
    const nights = Number(offer.duration) || 0;
    const rawRoom = offer.type;

    return {
      id: offer.id || "",
      date: formatIsoDateToRu(offer.date),
      nights: nights > 0 ? `${nights} ${getNightsWord(nights)}` : "—",
      meal: formatMealType(offer.mealType),
      room: rawRoom ? rawRoom.charAt(0).toUpperCase() + rawRoom.slice(1) : "—",
      seats: offer.seatsOnThePlane ? String(offer.seatsOnThePlane) : "10+",
      price: offer.price ? `${formatMoney(offer.price)}€` : "0€",
      rawPrice: Number(offer.price) || 0
    };
  });

  const prices = formattedOffers.map(o => o.rawPrice).filter(p => p > 0);
  const minPriceValue = prices.length > 0 ? Math.min(...prices) : 0;

  return {
    id: data.id || "",
    hotelName: data.hotelName || "",
    stars: Number(data.stars) || 0,
    gallery: formattedGallery,
    desc: data.hotelDescription[0]?.description || "",
    location: location,
    lineup: data.tourLineup || "",
    meal: data.typeOfMeal || "",
    daysDuration: Number(data.daysDuration) > 0 ? `${data.daysDuration} ${getNightsWord(Number(data.daysDuration))}` : "—",
    beach: formatBeachInfo(rawOffers),

    offersNumber: rawOffers.length > 0 ? `${rawOffers.length} ${getOfferWord(rawOffers.length)}` : "0 предложений",
    minPrice: minPriceValue > 0 ? `${formatMoney(minPriceValue)}€` : "0€",
    offers: formattedOffers,
  };
}