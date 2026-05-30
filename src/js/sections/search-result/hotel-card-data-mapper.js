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

function formatBeachInfo(offers, dataBeach) {
  if (dataBeach) return dataBeach;

  if (!Array.isArray(offers) || offers.length === 0) return "Пляж: песок, —";
  const distances = offers
    .map(offer => Number(offer.beachDistance))
    .filter(dist => !isNaN(dist) && dist > 0);

  if (distances.length === 0) return "Пляж: песок, —";
  const minDistance = Math.min(...distances);
  return `Пляж: песок, <${minDistance} м`;
}

export function hotelCardDataMapper(data) {
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
    const nights = Number(offer.duration || offer.daysDuration || offer.nights) || 0;
    const rawRoom = offer.type || offer.room;

    return {
      id: offer.id || "",
      date: offer.date ? (offer.date.includes('-') ? formatIsoDateToRu(offer.date) : offer.date) : "",
      nights: nights > 0 ? `${nights} ${getNightsWord(nights)}` : "—",
      meal: formatMealType(offer.mealType || offer.meal),
      room: rawRoom ? rawRoom.charAt(0).toUpperCase() + rawRoom.slice(1) : "—",
      seats: offer.seatsOnThePlane ? String(offer.seatsOnThePlane) : (offer.seats || "10+"),
      price: offer.price ? (String(offer.price).includes('€') ? offer.price : `${formatMoney(offer.price)}€`) : "0€",
      rawPrice: Number(String(offer.price).replace(/[^\d]/g, '')) || 0
    };
  });

  let cheapestOffer = null;
  if (formattedOffers.length > 0) {
    cheapestOffer = formattedOffers.reduce((min, current) => {
      return (current.rawPrice < min.rawPrice) ? current : min;
    }, formattedOffers[0]);
  }

  const minPriceText = cheapestOffer
    ? cheapestOffer.price
    : (data.priceForPerson ? `${formatMoney(data.priceForPerson)}€` : "0€");

  const finalDaysDuration = cheapestOffer
    ? cheapestOffer.nights
    : (Number(data.daysDuration) > 0 ? `${data.daysDuration} ${getNightsWord(Number(data.daysDuration))}` : "—");

  const finalMeal = cheapestOffer
    ? cheapestOffer.meal
    : (data.typeOfMeal ? formatMealType(data.typeOfMeal) : "—");

  const finalLineup = cheapestOffer
    ? cheapestOffer.room
    : (data.tourLineup || "—");

  return {
    id: data.id || "",
    hotelName: data.hotelName || "",
    stars: Number(data.stars) || 0,
    gallery: formattedGallery,
    desc: data.hotelDescription?.[0]?.description || data.desc || "",
    location: data.location || location,
    lineup: finalLineup,
    meal: finalMeal,
    daysDuration: finalDaysDuration,
    beach: formatBeachInfo(rawOffers, data.beach),

    offersNumber: rawOffers.length > 0 ? `${rawOffers.length} ${getOfferWord(rawOffers.length)}` : "0 предложений",
    minPrice: minPriceText,
    offers: formattedOffers,
  };
}
