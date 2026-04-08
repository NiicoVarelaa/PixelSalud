// ─────────────────────────────────────────────
// ProductActions.jsx
// ─────────────────────────────────────────────
import { Edit2, XCircle, CheckCircle } from "lucide-react";

export const ProductActions = ({
  producto,
  enCampana,
  tieneOferta,
  onEstablecerDescuento,
  onCambiarOferta,
  isMobile = false,
}) => {
  if (enCampana) {
    return isMobile ? (
      <p className="w-full rounded-xl border border-orange-200 bg-orange-50 py-3 text-center text-xs font-semibold text-orange-700">
        En campaña activa
      </p>
    ) : (
      <span className="whitespace-nowrap text-xs font-medium text-orange-700">
        En campaña
      </span>
    );
  }

  if (tieneOferta) {
    return isMobile ? (
      <>
        <button
          type="button"
          onClick={() => onEstablecerDescuento(producto)}
          className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
          aria-label={`Editar descuento de ${producto.nombreProducto}`}
        >
          <Edit2 size={15} aria-hidden="true" />
          Editar
        </button>
        <button
          type="button"
          onClick={() => onCambiarOferta(producto, false)}
          className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-4 text-sm font-semibold text-orange-700 transition-all hover:bg-orange-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
          aria-label={`Desactivar oferta de ${producto.nombreProducto}`}
        >
          <XCircle size={15} aria-hidden="true" />
          Quitar
        </button>
      </>
    ) : (
      <>
        <button
          type="button"
          onClick={() => onEstablecerDescuento(producto)}
          className="h-7 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-semibold whitespace-nowrap cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1"
          aria-label={`Editar descuento de ${producto.nombreProducto}`}
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onCambiarOferta(producto, false)}
          className="h-7 cursor-pointer whitespace-nowrap rounded-lg border border-orange-200 bg-orange-50 px-3 text-xs font-semibold text-orange-700 transition-all hover:bg-orange-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1"
          aria-label={`Quitar oferta de ${producto.nombreProducto}`}
        >
          Quitar
        </button>
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onEstablecerDescuento(producto)}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-green-600 hover:bg-green-700 active:scale-95 text-white font-semibold text-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
        isMobile ? "flex-1 h-10" : "h-7 px-3 whitespace-nowrap"
      }`}
      aria-label={`Activar oferta en ${producto.nombreProducto}`}
    >
      <CheckCircle size={14} aria-hidden="true" />
      Activar oferta
    </button>
  );
};
