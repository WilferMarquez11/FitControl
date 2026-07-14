// utils/currencyFormatter.js

/**
 * Recibe un texto con cualquier formato, remueve lo que no sea número 
 * y lo devuelve formateado con puntos de miles (es-CO).
 * @param {string} text 
 * @returns {string} Ejemplo: "20000" -> "20.000"
 */
export const formatToMiles = (text) => {
  if (!text) return '';
  // Quitamos cualquier cosa que no sea un número entero
  const cleanNumber = text.toString().replace(/\D/g, '');
  if (!cleanNumber) return '';
  return Number(cleanNumber).toLocaleString('es-CO');
};

/**
 * Convierte un texto con puntos de miles a un número entero limpio para la BD.
 * @param {string} text 
 * @returns {number} Ejemplo: "20.000" -> 20000
 */
export const parseToRawNumber = (text) => {
  if (!text) return 0;
  const cleanNumber = text.toString().replace(/\D/g, '');
  return cleanNumber ? parseInt(cleanNumber, 10) : 0;
};