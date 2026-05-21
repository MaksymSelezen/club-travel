import { API_URL } from './constants.js';

export const findHotels = async strapiQueryString => {
  try {
    const finalBackUrl = `${API_URL}v2-hotels?${strapiQueryString}`;
    const response = await fetch(finalBackUrl);
    if (!response.ok)
      throw new Error(`Ошибка сервера. Статус: ${response.status}`);
    const { data } = await response.json();
    console.log(finalBackUrl);
    console.log(data);
    return data;
  } catch (error) {
    console.error('Ошибка при получении данных от Strapi:', error);
    return [];
  }
};
