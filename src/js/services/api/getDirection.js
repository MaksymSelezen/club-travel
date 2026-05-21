import { API_URL } from './constants.js';

export const getFilters = async () => {
  try {
    const res = await fetch(`${API_URL}v2-countries?fields=slug,name`);
    const data = await res.json();
    const filters = data.data.map(country => {
      return {
        id: country.slug,
        label: country.name,
        country: country.name,
      };
    });
    return filters;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// export const getDirections = async () => {
//   try {
//     const res = await fetch(`${API_URL}v2-hotels?pagination[pageSize]=100&populate[country][populate][regions][populate]=cover`);
//     const data = await res.json();

//     const regions = data.data.map(hotel => {
//       const departureDate = new Date(hotel.dateOfDeparture);
//       const daysToAdd = hotel.daysDuration || 0;
//       departureDate.setDate(departureDate.getDate() + daysToAdd);

//       return hotel.country.regions.map(region => {
//           return {
//             id: region.id,
//             image: region.cover?.url || null,
//             imageAlt: region.name || null,
//             city: region.name || null,
//             country: hotel.country.name,
//             priceFrom: hotel.priceForPerson || null,
//             offersCount: null || 1,
//             dates:
//               [
//                 hotel.dateOfDeparture ? new Date(hotel.dateOfDeparture).toLocaleDateString('ru-RU', {
//                   day: 'numeric',
//                   month: 'long',
//                   year: 'numeric',
//                 }).replace(/\s*г\.?$/, '')
//                 : null,
//                 hotel.dateOfDeparture ? departureDate.toLocaleDateString('ru-RU', {
//                   day: 'numeric',
//                   month: 'long',
//                   year: 'numeric',
//                 }).replace(/\s*г\.?$/, '')
//                 : null,
//               ],
//             href: `/tours/${region.slug || region.id}`
//           };
//       });
//     }).flat();
//     const uniqueRegions = new Set(regions.map(region => JSON.stringify(region)));
//     const filteredRegions = Array.from(uniqueRegions).map(region => JSON.parse(region));
//     console.log(filteredRegions, filteredRegions.length);

//     return regions;
//   }
//   catch (error) {
//     console.error(error);
//     return [];
//   }
// }

export const getDirections = async () => {
  try {
    const res = await fetch(
      `${API_URL}v2-hotels?pagination[pageSize]=100&populate[country][populate][regions][populate]=cover`,
    );
    const data = await res.json();

    const seenRegionIds = new Set();
    const uniqueRegions = [];

    const formatDate = dateStr => {
      if (!dateStr) return null;
      return new Date(dateStr)
        .toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
        .replace(/\s*г\.?$/, '');
    };

    data.data.forEach(hotel => {
      if (!hotel.country || !hotel.country.regions) return;

      const departureDate = new Date(hotel.dateOfDeparture);
      const daysToAdd = hotel.daysDuration || 0;
      departureDate.setDate(departureDate.getDate() + daysToAdd);

      hotel.country.regions.forEach(region => {
        if (seenRegionIds.has(region.id)) return;

        seenRegionIds.add(region.id);

        uniqueRegions.push({
          id: region.id,
          image: region.cover?.url || null,
          imageAlt: region.name || null,
          city: region.name || null,
          country: hotel.country.name,
          priceFrom: hotel.priceForPerson || null,
          offersCount: 1,
          dates: [formatDate(hotel.dateOfDeparture), formatDate(departureDate)],
          href: `/tours/${region.slug || region.id}`,
        });
      });
    });

    return uniqueRegions;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getRegions = async () => {
  try {
    const res = await fetch(
      `${API_URL}v2-regions?fields=name,slug&pagination[pageSize]=100&populate[country][fields]=name,slug`,
    );
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getCountries = async () => {
  try {
    const res = await fetch(
      `${API_URL}v2-countries?fields=name,slug&pagination[pageSize]=100`,
    );
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
