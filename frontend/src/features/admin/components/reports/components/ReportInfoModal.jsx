import { memo } from "react";
import PropTypes from "prop-types";
import { Info, X } from "lucide-react";

const ReportInfoModal = memo(({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900/55 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-info-title"
    >
      <div className="bg-white w-full h-[80dvh] max-h-[80dvh] rounded-t-3xl sm:rounded-2xl sm:w-full sm:max-w-2xl sm:h-auto sm:max-h-[72vh] shadow-2xl overflow-hidden animate-slideUp sm:animate-fadeIn flex flex-col">
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 bg-white/95">
          <span
            className="h-1.5 w-14 rounded-full bg-gray-300"
            aria-hidden="true"
          />
        </div>

        <header className="px-4 sm:px-6 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-blue-200/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="p-2 bg-blue-100 rounded-lg shrink-0"
              aria-hidden="true"
            >
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <h3
              id="report-info-title"
              className="text-lg sm:text-xl font-bold text-blue-900 truncate"
            >
              Informacion sobre los reportes
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Cerrar informacion de reportes"
          >
            <X className="w-5 h-5 text-blue-700" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/40">
          <div className="rounded-xl border border-blue-200/60 bg-white p-4 sm:p-5 text-blue-900">
            <p className="text-sm sm:text-base leading-relaxed">
              Los reportes se generan en formato Excel (.xlsx) con tablas
              formateadas profesionalmente, estadisticas detalladas y analisis
              comparativos. Aplica filtros antes de descargar para personalizar
              los datos segun tus necesidades.
            </p>
            <ul className="mt-4 space-y-2 text-sm sm:text-base text-blue-800">
              <li>Formato condicional para mejor lectura.</li>
              <li>Rankings y comparativas por canal.</li>
              <li>Multiples hojas de datos en un mismo archivo.</li>
              <li>Compatibilidad con flujos administrativos existentes.</li>
            </ul>
          </div>
        </div>

        <div className="shrink-0 bg-white border-t border-gray-200 p-4 sm:p-5">
          <button
            onClick={onClose}
            className="w-full min-h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
});

ReportInfoModal.displayName = "ReportInfoModal";

ReportInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReportInfoModal;
