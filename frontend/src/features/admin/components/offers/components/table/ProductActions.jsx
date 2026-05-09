import { Edit2, Power, Percent, Loader2, Eye } from "lucide-react";
import { useOfertasStore } from "../../store/useOfertasStore";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

const palette = {
  edit: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500",
  remove:
    "bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500",
  activate:
    "bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500",
  detail:
    "bg-blue-100 text-blue-700 hover:bg-blue-200 focus-visible:ring-blue-500",
};

export const ProductActions = ({
  producto,
  enCampana,
  tieneOferta,
  onEstablecerDescuento,
  onCambiarOferta,
  onVerDetalle,
  isMobile = false,
}) => {
  const cargandoId = useOfertasStore((state) => state.cargandoId);
  const isLoading = cargandoId === producto.idProducto;

  if (enCampana) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-800">
        En campana
      </span>
    );
  }

  const btnClass = isMobile
    ? "flex items-center justify-center p-2.5 rounded-xl"
    : "flex items-center justify-center p-2 rounded-lg";

  if (tieneOferta) {
    return (
      <>
        <button
          type="button"
          onClick={() => onVerDetalle?.(producto)}
          className={`${btnClass} ${palette.detail} ${baseBtn}`}
          title="Ver detalle"
          aria-label={`Ver detalle de ${producto.nombreProducto}`}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={() => onEstablecerDescuento(producto)}
          className={`${btnClass} ${palette.edit} ${baseBtn}`}
          title="Editar descuento"
          aria-label={`Editar descuento de ${producto.nombreProducto}`}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Edit2 size={16} aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={() => onCambiarOferta(producto, false)}
          className={`${btnClass} ${palette.remove} ${baseBtn}`}
          title="Quitar oferta"
          aria-label={`Quitar oferta de ${producto.nombreProducto}`}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} aria-hidden="true" />}
        </button>
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onEstablecerDescuento(producto)}
      className={`${btnClass} ${palette.activate} ${baseBtn}`}
      title="Activar oferta"
      aria-label={`Activar oferta en ${producto.nombreProducto}`}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Percent size={16} aria-hidden="true" />}
    </button>
  );
};
