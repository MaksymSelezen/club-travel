import { API_URL } from './constants.js';
import { formatMoney } from '@/js/utils/format-money.js';

const MEALS_TRANSLATION_MAP = {
  'no-meal': 'Без питания',
  'breakfast': 'Завтрак',
  'breakfast-dinner': 'Завтрак и ужин',
  'breakfast-lunch-dinner': 'Завтрак, обед, ужин',
  'all-inclusive': 'Всё включено',
  'ultra-all-inclusive': 'Ультра: всё включено'
};

function getNightsWord(count) {
  const rule = new Intl.PluralRules('ru-RU').select(count);
  if (rule === 'one') return 'ночь';
  if (rule === 'few') return 'ночи';
  return 'ночей';
}

const getMediaUrl = media => {
  const data = media?.data || media;
  const item = Array.isArray(data) ? data[0] : data;
  const attrs = item?.attributes || item || {};
  const formats = attrs.formats || {};
  return formats.large?.url || formats.medium?.url || formats.small?.url || attrs.url || null;
};

const normalizeMediaList = media => {
  const data = media?.data || media || [];
  const list = Array.isArray(data) ? data : [data];
  return list.filter(Boolean).map(item => {
    const attrs = item.attributes || item;
    return {
      id: item.documentId || item.id,
      name: attrs.name || null,
      alternativeText: attrs.alternativeText || null,
      caption: attrs.caption || null,
      url: getMediaUrl(attrs),
      formats: attrs.formats || null,
    };
  });
};

const richTextToLines = value => {
  const blocks = Array.isArray(value) ? value : [];
  return blocks.map(block => {
    const children = Array.isArray(block.children) ? block.children : [];
    return children.map(child => child.text || '').join('').trim();
  }).filter(Boolean);
};

const normalizeHotelFeatures = features => {
  const list = Array.isArray(features) ? features : [];
  return list.map(feature => ({
    id: feature.id || null,
    title: feature.title || null,
    entries: richTextToLines(feature.entries),
  }));
};

const normalizeHotelDescription = descriptions => {
  const list = Array.isArray(descriptions) ? descriptions : [];
  return list.map(description => ({
    id: description.id || null,
    component: description.__component || null,
    mainDescription: richTextToLines(description.mainDescription),
    description: description.description || null,
  }));
};

const normalizeOffersList = (offers) => {
  const list = Array.isArray(offers) ? offers : [];
  return list.map(offer => {
    const rawNights = Number(offer.duration || offer.daysDuration || String(offer.nights).replace(/[^\d]/g, '')) || 0;
    const nightsText = offer.nights && typeof offer.nights === 'string' && offer.nights.includes('ноч')
      ? offer.nights
      : (rawNights > 0 ? `${rawNights} ${getNightsWord(rawNights)}` : "—");

    const rawMeal = offer.mealType || offer.meal || "";
    const mealText = MEALS_TRANSLATION_MAP[rawMeal] || rawMeal || "—";
    const formattedMeal = mealText.charAt(0).toUpperCase() + mealText.slice(1);

    const rawRoom = offer.type || offer.room || "—";
    const roomText = rawRoom ? rawRoom.charAt(0).toUpperCase() + rawRoom.slice(1) : "—";

    const rawPrice = Number(offer.price && typeof offer.price === 'number' ? offer.price : String(offer.price || offer.priceForPerson || 0).replace(/[^\d]/g, '')) || 0;
    const priceText = rawPrice > 0 ? `${formatMoney(rawPrice)}€` : "0€";

    return {
      id: offer.id || "",
      date: offer.date || "",
      nights: nightsText,
      meal: formattedMeal,
      room: roomText,
      seats: offer.seatsOnThePlane ? String(offer.seatsOnThePlane) : (offer.seats || "10+"),
      price: priceText,
      rawPrice: rawPrice
    };
  });
};

const normalizeV2HotelDetails = hotel => {
  if (!hotel) return null;
  const attrs = hotel.attributes || hotel;
  const country = attrs.country?.data?.attributes || attrs.country || null;
  const region = attrs.region?.data?.attributes || attrs.region || null;

  return {
    id: hotel.documentId || hotel.id,
    hotelName: attrs.hotelName || null,
    stars: attrs.stars || null,
    departureCity: attrs.departureCity || null,
    dateOfDeparture: attrs.dateOfDeparture || null,
    season: attrs.season || null,
    isHot: attrs.isHot || false,
    typeOfMeal: attrs.typeOfMeal || null,
    priceForPerson: attrs.priceForPerson || null,
    oldPrice: attrs.oldPrice || null,
    discount: attrs.discount || null,
    tourLineup: attrs.tourLineup || null,
    daysDuration: attrs.daysDuration || null,
    class: attrs.class || null,
    createdAt: attrs.createdAt || null,
    updatedAt: attrs.updatedAt || null,
    publishedAt: attrs.publishedAt || null,
    country,
    region,
    gallery: normalizeMediaList(attrs.gallery),
    hotelFeatures: normalizeHotelFeatures(attrs.hotelFeatures),
    hotelDescription: normalizeHotelDescription(attrs.hotelDescription),
    offers: normalizeOffersList(attrs.offers || attrs.rawOffers),
  };
};

export const getHotelById = async (id) => {
  if (!id) return null;

  try {
    const queryDirect = `filters[id][$eq]=${id}&populate=*`;
    const responseDirect = await fetch(`${API_URL}v2-hotels?${queryDirect}`);

    if (responseDirect.ok) {
      const jsonDirect = await responseDirect.json();
      if (jsonDirect?.data && jsonDirect.data.length > 0) {
        return normalizeV2HotelDetails(jsonDirect.data[0]);
      }
    }

    const queryByOffer = `filters[offers][id][$eq]=${id}&populate=*`;
    const responseByOffer = await fetch(`${API_URL}v2-hotels?${queryByOffer}`);

    if (!responseByOffer.ok) throw new Error(`HTTP ${responseByOffer.status}`);

    const jsonByOffer = await responseByOffer.json();
    const hotelData = jsonByOffer?.data?.[0];

    return hotelData ? normalizeV2HotelDetails(hotelData) : null;

  } catch (error) {

    return null;
  }
};
