// src/utils/dateFormatter.js

/**
 * Convierte un string de fecha (como el ISO de Supabase) a un formato local legible (DD/MM/AAAA).
 * @param {string} isoString - Fecha en formato ISO o string convertible.
 * @returns {string} Ejemplo: "2026-07-15T16:58:54..." -> "15/07/2026"
 */
export const formatToLocalDate = (isoString) => {
  if (!isoString) return 'No disponible';
  try {
    const fecha = new Date(isoString);
    // Verificamos si la fecha es válida
    if (isNaN(fecha.getTime())) return 'Fecha inválida';

    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    return 'Error en fecha';
  }
};