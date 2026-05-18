import { API_URL } from "./constants.js";

export const getFilters = async () => {
  try {
    const res = await fetch(`${API_URL}v2-countries`);
    const data = await res.json();
    const filters = data.data.map(country => {
      return {
        id: country.slug,
        label: country.name,
        country: country.name
      };
    });
    console.log(filters);
    return filters;
  }
  catch (error) {    
    console.error(error);
    return [];
  }
}

export const getDirections = async () => {
  try {
    const res = await fetch(`${API_URL}v2-hotels?populate[country][populate][regions][populate]=cover`);
    const data = await res.json();
    
    const regions = data.data.map(hotel => {
      const departureDate = new Date(hotel.dateOfDeparture);
      const daysToAdd = hotel.daysDuration || 0;
      departureDate.setDate(departureDate.getDate() + daysToAdd);
      
      return hotel.country.regions.map(region => {
          return {
            id: region.id,
            image: region.cover?.url || null,
            imageAlt: region.name || null,
            city: region.name || null,
            country: hotel.country.name,
            priceFrom: hotel.priceForPerson || null,
            offersCount: null || 1,
            dates: 
              [
                hotel.dateOfDeparture ? new Date(hotel.dateOfDeparture).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).replace(/\s*г\.?$/, '')
                : null,
                hotel.dateOfDeparture ? departureDate.toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).replace(/\s*г\.?$/, '')
                : null,
              ],
            href: `/tours/${region.slug || region.id}`
          };
      });
    }).flat();
    console.log(regions);
    return regions;
  }
  catch (error) {    
    console.error(error);
    return [];
  }
}
