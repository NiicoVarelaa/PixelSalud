import { Percent } from "lucide-react";

export const ProductStatus = ({
  tieneOferta,
  porcentajeDescuento,
  enCampana,
  isMobile = false,
}) => {
  const size = isMobile ? "text-sm px-3 py-1.5" : "text-xs px-2 py-0.5";
  const descuento = Number(porcentajeDescuento);
  const badgeTone = (() => {
    if (descuento >= 20) {
      return "bg-red-50 border-red-200 text-red-700";
    }
    if (descuento >= 15) {
      return "bg-amber-50 border-amber-200 text-amber-700";
    }
    if (descuento >= 10) {
      return "bg-emerald-50 border-emerald-200 text-emerald-700";
    }
    return "bg-orange-50 border-orange-200 text-orange-700";
  })();

  return (
    <div
      className={`flex ${isMobile ? "flex-wrap" : "flex-col"} items-center gap-1`}
    >
      {enCampana && (
        <span
          className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-orange-200 bg-orange-50 font-semibold text-orange-700 ${size}`}
        >
          En campaña
        </span>
      )}
      {tieneOferta ? (
        <span
          className={`inline-flex items-center gap-1 rounded-lg border font-bold whitespace-nowrap ${badgeTone} ${size}`}
        >
          <Percent size={isMobile ? 14 : 11} aria-hidden="true" />
          {porcentajeDescuento}% OFF
        </span>
      ) : (
        <span
          className={`inline-flex items-center rounded-lg bg-gray-100 text-gray-500 font-medium whitespace-nowrap ${size}`}
        >
          Sin oferta
        </span>
      )}
    </div>
  );
};
