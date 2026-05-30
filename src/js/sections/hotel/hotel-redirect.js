import { hotelDataMapper } from './hotel-data-mapper.js';

export async function HotelRedirect() {
  const hotelData = await hotelDataMapper();

  if (!hotelData) {
    const currentUrl = window.location.href;
    const parts = currentUrl.split('hotel');

    window.location.href=parts[0] + "search-result.html";
    return null;
  }

  return hotelData;
}
