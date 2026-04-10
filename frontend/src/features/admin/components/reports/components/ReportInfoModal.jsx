import { memo, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, FileSpreadsheet, LayoutList, GitCompare, Layers } from "lucide-react";

const FEATURES = [
  { icon: FileSpreadsheet, text: "Formato condicional para mejor lectura" },
  { icon: GitCompare,      text: "Rankings y comparativas por canal de venta" },
  { icon: Layers,          text: "Múltiples hojas de datos en un mismo archivo" },
  { icon: LayoutList,      text: "Compatibilidad con flujos administrativos existentes" },
];

/**
 * Modal de información sobre los reportes.
 * - Elimina todo el azul/índigo
 * - Usa verde coherente con el sistema de diseño
 * - Foco automático, Escape para cerrar
 */
const ReportInfoModal = memo(({ isOpen, onClose }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-info-title"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl max-h-[80dvh]"
          >
            {/* Handle (mobile) */}
            <div className="flex justify-center pt-2.5 pb-1 sm:hidden" aria-hidden="true">
              <span className="h-1.5 w-14 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100"
                  aria-hidden="true"
                >
                  <Info size={17} className="text-green-700" />
                </div>
                <h3
                  id="report-info-title"
                  className="text-sm font-semibold text-gray-900"
                >
                  Sobre los reportes
                </h3>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="Cerrar información de reportes"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Los reportes se generan en formato Excel (.xlsx) con tablas formateadas
                profesionalmente, estadísticas detalladas y análisis comparativos.
                Aplicá filtros antes de descargar para personalizar los datos según tus necesidades.
              </p>

              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Características
                </p>
                <ul className="space-y-2" aria-label="Características de los reportes">
                  {FEATURES.map(({ icon: Icon, text }, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-2.5"
                    >
                      <Icon size={14} className="shrink-0 text-green-600" aria-hidden="true" />
                      <span className="text-sm text-gray-700">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50/70 px-5 py-3.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-10 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

ReportInfoModal.displayName = "ReportInfoModal";

ReportInfoModal.propTypes = {
  isOpen:  PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReportInfoModal;