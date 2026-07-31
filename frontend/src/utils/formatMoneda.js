export const formatMoneda = (val) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return "$0";
  return `$${num.toLocaleString("es-AR")}`;
};

export const formatCurrency = (value) => {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

export const formatPrice = (price) => {
  const num = Number(price);
  if (!Number.isFinite(num)) return "$0";
  return `$${num.toLocaleString("es-AR")}`;
};

export const formatearMoneda = formatMoneda;
export const formatearPrecio = formatPrice;

export const cleanAndParsePrice = (price) => {
  if (typeof price === "number") return price;
  if (typeof price !== "string") return 0;

  let cleaned = price.replace(/[^0-9,.]/g, "");

  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const parsePriceFromString = (value) => {
  const priceToUse = value || 0;
  if (typeof priceToUse === "string") {
    return parseFloat(priceToUse.replace(/[^0-9.-]+/g, "")) || 0;
  }
  return Number(priceToUse) || 0;
};
