import { Award, RotateCcw, Shield, Truck } from "lucide-react";
import { cleanAndParsePrice, formatCurrency } from "@utils/formatMoneda";

export { cleanAndParsePrice, formatCurrency };

export const TRUST_BADGES = [
  { icon: Shield, label: "Pago seguro" },
  { icon: Truck, label: "Envio en el dia" },
  { icon: RotateCcw, label: "Devolucion gratis" },
  { icon: Award, label: "Calidad garantizada" },
];

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
