/**
 * Utilidades para manejo de strings
 */

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string}
 */
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convierte un string a slug (URL friendly)
 * @param {string} str - String a convertir
 * @returns {string}
 */
const slugify = (str) => {
  return str
    .toString()
    .normalize("NFD") // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/[^\w\-]+/g, "") // Elimina caracteres especiales
    .replace(/\-\-+/g, "-"); // Múltiples guiones a uno solo
};

/**
 * Trunca un string a una longitud específica
 * @param {string} str - String a truncar
 * @param {number} length - Longitud máxima
 * @param {string} suffix - Sufijo a agregar (default: '...')
 * @returns {string}
 */
const truncate = (str, length, suffix = "...") => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length).trim() + suffix;
};

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Genera un string aleatorio
 * @param {number} length - Longitud del string
 * @returns {string}
 */
const randomString = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = {
  capitalize,
  slugify,
  truncate,
  isValidEmail,
  randomString,
};
