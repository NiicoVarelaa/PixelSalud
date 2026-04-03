import { Award, RotateCcw, Shield, Truck } from "lucide-react";

export const CURRENCY_FORMATTER = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export const TRUST_BADGES = [
  { icon: Shield, label: "Pago seguro" },
  { icon: Truck, label: "Envio en el dia" },
  { icon: RotateCcw, label: "Devolucion gratis" },
  { icon: Award, label: "Calidad garantizada" },
];

export const formatCurrency = (number) => CURRENCY_FORMATTER.format(number);

export const cleanAndParsePrice = (price) => {
  if (typeof price === "number") return price;
  if (typeof price !== "string") return 0;

  let cleaned = price.replace(/[^0-9,.]/g, "");
  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  }

  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const getProductPricing = ({
  precio,
  precioOriginal,
  promo2x1Activa,
  tipoPromocion,
}) => {
  const currentPrice = cleanAndParsePrice(precio);
  const originalPrice = precioOriginal ? cleanAndParsePrice(precioOriginal) : 0;

  const discountPct =
    originalPrice > 0 && originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  return {
    esDosPorUno:
      Boolean(promo2x1Activa) ||
      String(tipoPromocion || "").toUpperCase() === "2X1",
    currentPrice,
    originalPrice,
    discountPct,
    savings: Math.max(0, originalPrice - currentPrice),
  };
};
