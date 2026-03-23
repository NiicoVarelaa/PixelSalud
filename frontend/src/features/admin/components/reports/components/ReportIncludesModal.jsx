import { memo } from "react";
import PropTypes from "prop-types";
import { CheckCircle2, X } from "lucide-react";

const ReportIncludesModal = memo(({ isOpen, report, onClose }) => {
  if (!isOpen || !report) return null;

  const IconComponent = report.icono;

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900/55 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-detail-title"
    >
      <div className="bg-white w-full h-[88dvh] max-h-[88dvh] rounded-t-3xl sm:rounded-2xl sm:w-full sm:max-w-2xl sm:h-auto sm:max-h-[84vh] shadow-2xl overflow-hidden animate-slideUp sm:animate-fadeIn flex flex-col">
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 bg-white/95">
          <span
            className="h-1.5 w-14 rounded-full bg-gray-300"
            aria-hidden="true"
          />
        </div>

        <header
          className={`px-4 sm:px-6 py-4 bg-linear-to-r ${report.color} text-white flex items-center justify-between shrink-0`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="p-2 bg-white/20 rounded-lg shrink-0"
              aria-hidden="true"
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3
                id="report-detail-title"
                className="text-lg sm:text-xl font-bold truncate"
              >
                {report.titulo}
              </h3>
              <p className="text-white/90 text-sm leading-tight mt-0.5 line-clamp-2">
                {report.descripcion}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/15 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Cerrar detalle del reporte"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/40">
          <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">
            Incluye este reporte
          </h4>

          <ul
            className="space-y-2.5 sm:space-y-3"
            aria-label={`Incluye: ${report.titulo}`}
          >
            {report.incluye.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3"
              >
                <CheckCircle2
                  className={`w-4 h-4 mt-0.5 shrink-0 ${report.checkColor}`}
                  aria-hidden="true"
                />
                <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0 bg-white border-t border-gray-200 p-4 sm:p-5">
          <button
            onClick={onClose}
            className="w-full min-h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
});

ReportIncludesModal.displayName = "ReportIncludesModal";

ReportIncludesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  report: PropTypes.shape({
    id: PropTypes.string,
    titulo: PropTypes.string,
    descripcion: PropTypes.string,
    icono: PropTypes.elementType,
    color: PropTypes.string,
    checkColor: PropTypes.string,
    incluye: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
};

ReportIncludesModal.defaultProps = {
  report: null,
};

export default ReportIncludesModal;
