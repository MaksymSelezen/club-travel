import { getHotels } from '@/js/services/api/getHotels.js';
import { formatMoney } from '@/js/utils/format-money.js';

function mapGallery(gallery = []) {
  return gallery.map(img => ({
    alt: img.alternativeText || img.name,
    mainSrc: img.formats?.large?.url || img.url,
    thumbSrc: img.formats?.small?.url || img.url,
  }));
}

function mapInfo(hotel = {}) {
  const descBlock = hotel.hotelDescription?.[0] || {};

  return {
    description: descBlock.description || "",
    mainDescription: descBlock.mainDescription?.[0] || "",
    features: hotel.hotelFeatures || [],
  };
}

function mapBadge(hotel = {}) {
  const country = hotel.country?.name;
  const region = hotel.region?.name;
  const location = [country, region].filter(Boolean).join(', ');
  return {
    location: location || "",
    stars: hotel.stars || 0,
    hotelName: hotel.hotelName || ""
  };
}

function mapBookingCard(hotel = {}) {
  const rawDate = hotel.dateOfDeparture;
  const days = hotel.daysDuration;
  const city = hotel.departureCity;
  const price = hotel.priceForPerson;

  let dateText = "";
  if (rawDate) {
    const dateObj = new Date(rawDate);
    dateText = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  }
  const durationText = days ? `${days} ночей` : "";
  const period = [dateText, durationText].filter(Boolean).join(' / ');
  
  const formattedPrice = price ? `€${formatMoney(price)}` : "0,00 €";

  return {
    period: period || "",
    departureCity: city ? `Вылет: ${city}` : "",
    typeOfMeal: hotel.typeOfMeal || "",
    tourLineup: hotel.tourLineup || "",
    priceForPerson: formattedPrice,
  };
}

export async function hotelDataMapper() {
  const hotels = await getHotels();
  const hotel = hotels[2];
  console.log("sds", mapBookingCard(hotel));

  return {
    gallery: mapGallery(hotel.gallery),
    info: mapInfo(hotel),
    features: hotel.hotelFeatures || [],
    badge: mapBadge(hotel),
    bookingCard: mapBookingCard(hotel),
  };
}