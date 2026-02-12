/**
 * Utilidades para manejo de fechas
 */

/**
 * Formatea una fecha a formato SQL (YYYY-MM-DD)
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha en formato SQL
 */
const toSQLDate = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

/**
 * Formatea una fecha y hora a formato SQL (YYYY-MM-DD HH:MM:SS)
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha y hora en formato SQL
 */
const toSQLDateTime = (date = new Date()) => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {Date} date1 - Primera fecha
 * @param {Date} date2 - Segunda fecha
 * @returns {number} Diferencia en días
 */
const daysDifference = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Verifica si una fecha está en el rango especificado
 * @param {Date} date - Fecha a verificar
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} endDate - Fecha de fin
 * @returns {boolean}
 */
const isDateInRange = (date, startDate, endDate) => {
  return date >= startDate && date <= endDate;
};

module.exports = {
  toSQLDate,
  toSQLDateTime,
  daysDifference,
  isDateInRange,
};
