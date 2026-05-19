import { API_URL } from "./constants.js";
import { getFilterState } from "./getQueries.js";
import { restoreFilterFromURL } from "../../utils/restore-filter-from-url.js";
import { convertStateToStrapiQuery } from "../../utils/format-query-to-strapi-req.js";


export const findHotels = async (strapiQueryString) => {
  try {
    const finalBackUrl = `${API_URL}v2-hotels?${strapiQueryString}`;
    console.log('link:', finalBackUrl);

    const response = await fetch(finalBackUrl);
    if (!response.ok) throw new Error(`Ошибка сервера. Статус: ${response.status}`);
    const { data } = await response.json();
    return data;
  }

  catch(error) {
    console.error('Ошибка при получении данных от Strapi:', error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const currentState = getFilterState();
  const strapiQuery = convertStateToStrapiQuery(currentState);
  findHotels(strapiQuery);
});
