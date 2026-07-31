import { parsePriceFromString, formatPrice } from "@utils/formatMoneda";

export { parsePriceFromString as parseNumericPrice, formatPrice };

const esProducto2x1 = (product) =>
  Boolean(product.promo2x1Activa) ||
  String(product.tipoPromocion || "").toUpperCase() === "2X1";

export const getProductUnitPrice = (product) => {
  if (esProducto2x1(product)) {
    return parsePriceFromString(product.precioRegular || product.precio || 0);
  }

  const priceToUse =
    product.precioFinal || product.precioRegular || product.precio || 0;
  return parsePriceFromString(priceToUse);
};

export const getProductSubtotal = (product) => {
  const subtotalItem = Number(product.subtotalItem);

  if (Number.isFinite(subtotalItem) && subtotalItem > 0) {
    return subtotalItem;
  }

  if (esProducto2x1(product)) {
    const unitPrice = parsePriceFromString(
      product.precioRegular || product.precio || 0,
    );
    return unitPrice * Math.ceil((product.cantidad || 0) / 2);
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
