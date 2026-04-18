import { memo, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

const ReportIncludesModal = memo(({ isOpen, report, onClose }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!report) return null;

  const IconComponent = report.icono;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-detail-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl max-h-[88dvh]"
          >
            <div
              className="flex justify-center pt-2.5 pb-1 sm:hidden"
              aria-hidden="true"
            >
              <span className="h-1.5 w-14 rounded-full bg-gray-300" />
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100"
                  aria-hidden="true"
                >
                  <IconComponent size={17} className="text-green-700" />
                </div>
                <div className="min-w-0">
                  <h3
                    id="report-detail-title"
                    className="truncate text-sm font-semibold text-gray-900"
                  >
                    {report.titulo}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                    {report.descripcion}
                  </p>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="Cerrar detalle del reporte"
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Este reporte incluye
              </p>
              <ul
                className="space-y-2"
                aria-label={`Contenido del reporte: ${report.titulo}`}
              >
                {report.incluye.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-3"
                  >
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-green-600"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 border-t border-gray-100 bg-gray-50/70 px-5 py-3.5">
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

ReportIncludesModal.displayName = "ReportIncludesModal";

ReportIncludesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  report: PropTypes.shape({
    titulo: PropTypes.string,
    descripcion: PropTypes.string,
    icono: PropTypes.elementType,
    incluye: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
};

ReportIncludesModal.defaultProps = { report: null };

export default ReportIncludesModal;
