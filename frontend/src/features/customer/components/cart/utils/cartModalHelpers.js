export const parseNumericPrice = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
  }

  return Number(value) || 0;
};

export const formatPrice = (price) => {
  const numericPrice = parseNumericPrice(price);

  return new Intl.NumberFormat("es-AR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

export const getProductUnitPrice = (product) => {
  const priceToUse =
    product.precioFinal || product.precioRegular || product.precio || 0;
  return parseNumericPrice(priceToUse);
};

export const getProductSubtotal = (product) => {
  const subtotalItem = Number(product.subtotalItem);

  if (Number.isFinite(subtotalItem) && subtotalItem > 0) {
    return subtotalItem;
  }

  return getProductUnitPrice(product) * (product.cantidad || 0);
};

export const hasRealDiscount = (product) => {
  const esDosPorUno =
    Boolean(product.promo2x1Activa) ||
    String(product.tipoPromocion || "").toUpperCase() === "2X1";

  if (esDosPorUno) return true;

  const hasDiscount =
    product.enOferta &&
    product.porcentajeDescuento &&
    product.porcentajeDescuento > 0;

  const hasPriceDifference =
    product.precioRegular &&
    product.precioFinal &&
    product.precioFinal < product.precioRegular;

  return hasDiscount || hasPriceDifference;
};
