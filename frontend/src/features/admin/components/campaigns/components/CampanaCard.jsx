import { motion } from "framer-motion";
import { Calendar, Package, Edit2, Power, Trash2, Percent } from "lucide-react";
import { formatearFecha } from "../utils/formatters";

const TipoBadge = ({ tipo }) => (
  <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
    {tipo}
  </span>
);

const EstadoBadge = ({ esActiva }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
      esActiva
        ? "bg-green-50 text-green-700 border border-green-200"
        : "bg-gray-100 text-gray-500 border border-gray-200"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${esActiva ? "bg-green-500" : "bg-gray-400"}`}
      aria-hidden="true"
    />
    {esActiva ? "Activa" : "Inactiva"}
  </span>
);

export const CampanaCard = ({
  campana,
  index,
  onEditar,
  onToggleActiva,
  onEliminar,
}) => {
  const esDosPorUno = String(campana.tipo || "").toUpperCase() === "2X1";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition-shadow hover:shadow-md"
      aria-label={`Campaña: ${campana.nombreCampana}`}
    >
      <div
        className={`h-1 w-full ${campana.esActiva ? "bg-green-500" : "bg-gray-200"}`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {campana.nombreCampana}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <TipoBadge tipo={campana.tipo} />
            <EstadoBadge esActiva={campana.esActiva} />
          </div>
        </div>

        <div className="shrink-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center min-w-[52px]">
          {esDosPorUno ? (
            <span className="text-base font-bold text-gray-800">2x1</span>
          ) : (
            <span className="flex items-center gap-0.5 text-base font-bold text-orange-600">
              <Percent size={12} aria-hidden="true" />
              {campana.porcentajeDescuento}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-2 px-4 pb-3">
        {campana.descripcion && (
          <p className="line-clamp-2 text-xs text-gray-500">
            {campana.descripcion}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={13} aria-hidden="true" />
          <span>
            {formatearFecha(campana.fechaInicio)} →{" "}
            {formatearFecha(campana.fechaFin)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Package size={13} aria-hidden="true" />
          <span>{campana.cantidadProductos || 0} productos</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-t border-gray-100 bg-gray-50 px-4 py-2.5">
        <button
          type="button"
          onClick={() => onEditar(campana)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg h-8 text-xs font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          aria-label={`Editar campaña ${campana.nombreCampana}`}
        >
          <Edit2 size={13} aria-hidden="true" />
          Editar
        </button>

        <button
          type="button"
          onClick={() => onToggleActiva(campana)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg h-8 text-xs font-medium border active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 ${
            campana.esActiva
              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-400"
              : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 focus-visible:ring-green-500"
          }`}
          aria-label={`${campana.esActiva ? "Desactivar" : "Activar"} campaña ${campana.nombreCampana}`}
        >
          <Power size={13} aria-hidden="true" />
          {campana.esActiva ? "Desactivar" : "Activar"}
        </button>

        <button
          type="button"
          onClick={() => onEliminar(campana)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          aria-label={`Eliminar campaña ${campana.nombreCampana}`}
        >
          <Trash2 size={14} aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
};
