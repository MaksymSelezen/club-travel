import { getHotelById } from '@/js/services/api/get-hotel-by-id.js';
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
  return {
    location: [country, region].filter(Boolean).join(', ') || "",
    stars: hotel.stars || 0,
    hotelName: hotel.hotelName || ""
  };
}

function mapBookingCard(hotel = {}, activeOffer = null) {
  const city = hotel.departureCity;

  if (activeOffer) {
    const period = [activeOffer.date, activeOffer.nights].filter(Boolean).join(' / ');

    const cleanPrice = String(activeOffer.price).replace(/[^\d]/g, '');
    const formattedPrice = cleanPrice ? `€${formatMoney(Number(cleanPrice))}` : "0,00 €";

    return {
      period: period || "",
      departureCity: city ? `Вылет: ${city}` : "",
      typeOfMeal: activeOffer.meal || "—",
      tourLineup: activeOffer.room || "—", // Выведет тип номера из оффера вместо "Туристический пакет"
      priceForPerson: formattedPrice,
    };
  }

  const lineup = hotel.tourLineup || "—";
  const rawDate = hotel.dateOfDeparture;
  let dateText = "";
  if (rawDate) {
    dateText = new Date(rawDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  const days = Number(hotel.daysDuration) || 0;
  const durationText = days > 0 ? `${days} ночей` : "";

  return {
    period: [dateText, durationText].filter(Boolean).join(' / ') || "",
    departureCity: city ? `Вылет: ${city}` : "",
    typeOfMeal: hotel.typeOfMeal || "—",
    tourLineup: lineup,
    priceForPerson: hotel.priceForPerson ? `€${formatMoney(Number(hotel.priceForPerson))}` : "0,00 €",
  };
}

function getHotelIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

export async function hotelDataMapper() {
  const urlId = getHotelIdFromUrl();
  if (!urlId) return null;

  const hotel = await getHotelById(urlId);
  if (!hotel) return null;

  let activeOffer = null;
  const hasOffers = Array.isArray(hotel.offers) && hotel.offers.length > 0;

  if (hasOffers) {
    activeOffer = hotel.offers.find(o => String(o.id) === String(urlId));

    if (!activeOffer) {
      activeOffer = hotel.offers.reduce((min, current) => {
        const minPrice = Number(min.rawPrice) || Infinity;
        const currentPrice = Number(current.rawPrice) || Infinity;
        return currentPrice < minPrice ? current : min;
      }, hotel.offers[0]);

      // console.log(`%c[MAPPER] Совпадений по ID нет. Автоматически выбран минимальный оффер с ценой: ${activeOffer.price}`, 'color: #ff9800; font-weight: bold;');
    }
  }

  // console.group(`%c[MAPPER OUT] Данные для рендеринга страницы отеля`, 'color: #4caf50; font-weight: bold;');
  // console.log("Итоговый bookingCard:", mapBookingCard(hotel, activeOffer));
  // console.groupEnd();

  return {
    gallery: mapGallery(hotel.gallery),
    info: mapInfo(hotel),
    features: hotel.hotelFeatures || [],
    badge: mapBadge(hotel),
    bookingCard: mapBookingCard(hotel, activeOffer),
  };
}
