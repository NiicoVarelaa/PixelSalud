import { Edit2, Trash2, RotateCcw } from "lucide-react";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

const palette = {
  edit: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500",
  remove: "bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500",
  activate:
    "bg-primary-100 text-primary-700 hover:bg-primary-200 focus-visible:ring-primary-500",
};

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
          className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl text-sm font-semibold active:scale-95 focus-visible:ring-offset-2 ${palette.edit} ${baseBtn}`}
          aria-label={`Editar descuento de ${producto.nombreProducto}`}
        >
          <Edit2 size={15} aria-hidden="true" />
          Editar
        </button>
        <button
          type="button"
          onClick={() => onCambiarOferta(producto, false)}
          className={`flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold active:scale-95 focus-visible:ring-offset-2 ${palette.remove} ${baseBtn}`}
          aria-label={`Desactivar oferta de ${producto.nombreProducto}`}
        >
          <Trash2 size={15} aria-hidden="true" />
          Quitar
        </button>
      </>
    ) : (
      <>
        <button
          type="button"
          onClick={() => onEstablecerDescuento(producto)}
          className={`h-7 px-3 rounded-lg text-xs font-semibold whitespace-nowrap active:scale-95 focus-visible:ring-offset-1 ${palette.edit} ${baseBtn}`}
          aria-label={`Editar descuento de ${producto.nombreProducto}`}
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onCambiarOferta(producto, false)}
          className={`h-7 whitespace-nowrap rounded-lg px-3 text-xs font-semibold active:scale-95 focus-visible:ring-offset-1 ${palette.remove} ${baseBtn}`}
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
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold text-xs active:scale-95 focus-visible:ring-offset-2 ${palette.activate} ${baseBtn} ${
        isMobile ? "flex-1 h-10" : "h-7 px-3 whitespace-nowrap"
      }`}
      aria-label={`Activar oferta en ${producto.nombreProducto}`}
    >
      <RotateCcw size={14} aria-hidden="true" />
      Activar oferta
    </button>
  );
};
