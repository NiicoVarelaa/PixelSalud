/**
 * Utilidades de formateo para el módulo de clientes
 */

/**
 * Valida si un email tiene formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export const esEmailValido = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Valida si un DNI argentino es válido (7-8 dígitos)
 * @param {string} dni - DNI a validar
 * @returns {boolean}
 */
export const esDniValido = (dni) => {
  return /^\d{7,8}$/.test(dni);
};

/**
 * Formatea un nombre completo (capitaliza primera letra)
 * @param {string} nombre - Nombre a formatear
 * @returns {string}
 */
export const formatearNombre = (nombre) => {
  if (!nombre) return "";
  return nombre
    .trim()
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase(),
    )
    .join(" ");
};

/**
 * Obtiene las iniciales de un nombre completo
 * @param {string} nombre - Nombre
 * @param {string} apellido - Apellido
 * @returns {string}
 */
export const obtenerIniciales = (nombre, apellido) => {
  const inicialesNombre = nombre ? nombre.charAt(0).toUpperCase() : "";
  const inicialesApellido = apellido ? apellido.charAt(0).toUpperCase() : "";
  return `${inicialesNombre}${inicialesApellido}`;
};
