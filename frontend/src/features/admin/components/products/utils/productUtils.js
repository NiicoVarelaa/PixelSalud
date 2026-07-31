export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ENDPOINTS = {
  PRODUCTOS: {
    LIST: `${API_BASE_URL}/productos`,
    CREATE: `${API_BASE_URL}/productos/crear`,
    UPDATE: (id) => `${API_BASE_URL}/productos/actualizar/${id}`,
    TOGGLE_ACTIVE: (id) => `${API_BASE_URL}/productos/actualizar/activo/${id}`,
  },
};

export const EXCLUDED_CATEGORY_KEYWORDS = [
  "cyber",
  "black friday",
  "oferta",
  "descuento",
  "promo",
];

export const ITEMS_PER_PAGE = 7;

export const MOBILE_BREAKPOINT = 768;

export const filterValidCategories = (categorias) => {
  return categorias.filter((cat) => {
    const catLower = cat.toLowerCase();
    return !EXCLUDED_CATEGORY_KEYWORDS.some((keyword) =>
      catLower.includes(keyword),
    );
  });
};

export { formatPrice, cleanAndParsePrice as cleanPrice } from "@utils/formatMoneda";

export const detectAndCleanPrice = (precioRaw) => {
  if (precioRaw.includes(",")) {
    return precioRaw
      .replace(/\$/g, "")
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
  } else {
    return precioRaw.replace(/\$/g, "").replace(/\s/g, "");
  }
};
