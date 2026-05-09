import { AnimatePresence, motion } from "framer-motion";
import { X, Tag, Calendar, Users, DollarSign, Hash, CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatearFecha } from "../utils/formatters";

const TIPO_USUARIO_LABEL = { todos: "Todos", nuevo: "Nuevos", vip: "VIP" };

const getEstadoBadge = (estado) => {
  switch (estado) {
    case "Activo":
      return { icon: CheckCircle2, cls: "bg-green-100 text-green-800" };
    case "Expirado":
      return { icon: Clock, cls: "bg-red-100 text-red-800" };
    default:
      return { icon: XCircle, cls: "bg-gray-100 text-gray-700" };
  }
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

export const CuponDetail = ({ cupon, onClose }) => {
  if (!cupon) return null;

  const { icon: EstadoIcon, cls: estadoCls } = getEstadoBadge(cupon.estado);
  const pctUso = cupon.usoMaximo
    ? Math.min(((cupon.vecesUsado || 0) / cupon.usoMaximo) * 100, 100)
    : null;

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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <Tag size={17} className="text-green-700" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 leading-none">
                  Detalle del cupón
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">{cupon.codigo}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors"
              aria-label="Cerrar"
            >
              <X size={17} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-orange-600">
                {cupon.tipoCupon === "porcentaje"
                  ? `${cupon.valorDescuento}%`
                  : `$${cupon.valorDescuento}`}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${estadoCls}`}
              >
                <EstadoIcon size={14} />
                {cupon.estado}
              </span>
            </div>

            {cupon.descripcion && (
              <p className="text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                {cupon.descripcion}
              </p>
            )}

            <div className="space-y-0">
              <DetailRow
                Icon={Calendar}
                label="Vigencia"
                value={`${formatearFecha(cupon.fechaInicio)} → ${formatearFecha(cupon.fechaVencimiento)}`}
              />
              <DetailRow
                Icon={Users}
                label="Audiencia"
                value={TIPO_USUARIO_LABEL[cupon.tipoUsuario] ?? cupon.tipoUsuario}
              />
              <DetailRow
                Icon={Hash}
                label="Usos"
                value={`${cupon.vecesUsado || 0} / ${cupon.usoMaximo || "Ilimitado"}`}
              />
              {cupon.montoMinimo && (
                <DetailRow
                  Icon={DollarSign}
                  label="Monto mínimo"
                  value={`$${cupon.montoMinimo}`}
                />
              )}
            </div>

            {pctUso !== null && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span className="font-medium">Progreso de uso</span>
                  <span className="font-semibold text-gray-700">{Math.round(pctUso)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${pctUso}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
