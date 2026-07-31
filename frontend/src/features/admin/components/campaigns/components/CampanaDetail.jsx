import { AnimatePresence, motion } from "framer-motion";
import { X, Tag, Calendar, Percent, Users, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";

const TIPO_LABEL = {
  DESCUENTO: "Descuento",
  "2X1": "2x1",
  EVENTO: "Evento",
  LIQUIDACION: "Liquidación",
  TEMPORADA: "Temporada",
};

const getEstadoBadge = (esActiva) => {
  if (esActiva) return { icon: CheckCircle2, cls: "bg-green-100 text-green-800" };
  return { icon: XCircle, cls: "bg-gray-100 text-gray-700" };
};

const DetailRow = ({ Icon, label, value }) => {
  const IconEl = Icon;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-b-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <IconEl size={14} className="text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
};

export const CampanaDetail = ({ campana, onClose }) => {
  if (!campana) return null;

  const { icon: EstadoIcon, cls: estadoCls } = getEstadoBadge(campana.esActiva);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl max-h-[90vh]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
                <Tag size={17} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 leading-none">
                  Detalle de campaña
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">{campana.nombreCampana}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-orange-600">
                {campana.tipo === "2X1"
                  ? "2x1"
                  : `${campana.porcentajeDescuento}%`}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${estadoCls}`}
              >
                <EstadoIcon size={14} />
                {campana.esActiva ? "Activa" : "Inactiva"}
              </span>
            </div>

            {campana.descripcion && (
              <p className="text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                {campana.descripcion}
              </p>
            )}

            <div className="space-y-0">
              <DetailRow
                Icon={Tag}
                label="Tipo"
                value={TIPO_LABEL[campana.tipo] ?? campana.tipo}
              />
              <DetailRow
                Icon={Calendar}
                label="Vigencia"
                value={`${new Date(campana.fechaInicio).toLocaleDateString("es-AR")} → ${new Date(campana.fechaFin).toLocaleDateString("es-AR")}`}
              />
              <DetailRow
                Icon={Users}
                label="Productos"
                value={`${campana.totalProductos || 0} producto(s)`}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
