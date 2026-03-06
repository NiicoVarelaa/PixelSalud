// API Base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// Endpoints
export const ENDPOINTS = {
  PRODUCTOS: {
    LIST: `${API_BASE_URL}/productos`,
    CREATE: `${API_BASE_URL}/productos/crear`,
    UPDATE: (id) => `${API_BASE_URL}/productos/actualizar/${id}`,
    TOGGLE_ACTIVE: (id) => `${API_BASE_URL}/productos/actualizar/activo/${id}`,
  },
};

// Filtros de categorías excluidas
export const EXCLUDED_CATEGORY_KEYWORDS = [
  "cyber",
  "black friday",
  "oferta",
  "descuento",
  "promo",
];

// Configuración de paginación
export const ITEMS_PER_PAGE = 7;

// Breakpoint para vista móvil
export const MOBILE_BREAKPOINT = 768;

/**
 * Filtra categorías excluyendo las relacionadas con ofertas
 * @param {string[]} categorias - Array de categorías
 * @returns {string[]} Categorías filtradas
 */
export const filterValidCategories = (categorias) => {
  return categorias.filter((cat) => {
    const catLower = cat.toLowerCase();
    return !EXCLUDED_CATEGORY_KEYWORDS.some((keyword) =>
      catLower.includes(keyword),
    );
  });
};

/**
 * Formatea un precio a formato argentino
 * @param {number|string} precio - Precio a formatear
 * @returns {string} Precio formateado
 */
export const formatPrice = (precio) => {
  const precioLimpio = String(precio).replace(",", ".");
  const numero = Number(precioLimpio);

  if (isNaN(numero)) return "$0.00";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero);
};

/**
 * Convierte formato argentino (16.246,00) a formato internacional (16246.00)
 * @param {string} valor - Valor a limpiar
 * @returns {string} Valor limpio
 */
export const cleanPrice = (valor) => {
  if (!valor) return "";

  return String(valor)
    .replace(/\$/g, "") // Eliminar símbolo de moneda
    .replace(/\s/g, "") // Eliminar espacios
    .replace(/\./g, "") // Eliminar puntos (separadores de miles)
    .replace(",", "."); // Reemplazar coma por punto (decimal)
};

/**
 * Detecta el formato de precio y lo limpia adecuadamente
 * @param {string} precioRaw - Precio en formato raw
 * @returns {string} Precio limpio
 */
export const detectAndCleanPrice = (precioRaw) => {
  if (precioRaw.includes(",")) {
    // Formato argentino: "16.246,00" → "16246.00"
    return precioRaw
      .replace(/\$/g, "")
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
  } else {
    // Formato US o ya limpio: solo eliminar $ y espacios
    return precioRaw.replace(/\$/g, "").replace(/\s/g, "");
  }
};
