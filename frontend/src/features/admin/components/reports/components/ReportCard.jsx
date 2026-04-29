import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Download, Eye, Loader2 } from "lucide-react";
import { staggerItem } from "../utils/animations";

const ReportCard = memo(
  ({ report, downloading, onDownload, onViewDetails }) => {
    const IconComponent = report.icono;

    return (
      <motion.article
        className="h-full flex flex-1 w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition-[box-shadow,border-color] duration-300 ease-out hover:border-gray-300 hover:shadow-md focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2"
        aria-labelledby={`reporte-${report.id}-titulo`}
        variants={staggerItem}
      >
        <div className="flex items-start gap-3 border-b border-gray-100 bg-gray-50 px-4 py-4">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100"
            aria-hidden="true"
          >
            <IconComponent size={18} className="text-green-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id={`reporte-${report.id}-titulo`}
              className="text-sm font-semibold text-gray-900 leading-tight"
            >
              {report.titulo}
            </h3>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
              {report.descripcion}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:flex-col px-4 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Incluye
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-gray-600">
            {report.incluye.map((item) => (
              <li key={item} className="flex items-start gap-2 leading-snug">
                <span
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 p-3.5 pt-2 mt-auto lg:p-3 lg:pt-1.5">
          <button
            type="button"
            onClick={onViewDetails}
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 lg:hidden"
            aria-label={`Ver detalle del reporte ${report.titulo}`}
          >
            <Eye size={15} aria-hidden="true" />
            Ver detalle
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            className={`flex min-h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 ${
              downloading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-green-600 text-white hover:bg-green-700 shadow-xs"
            }`}
            aria-label={`Descargar reporte ${report.titulo} en formato Excel`}
            aria-busy={downloading}
            aria-disabled={downloading}
          >
            {downloading ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Download size={15} aria-hidden="true" />
                <span>Descargar Excel</span>
              </>
            )}
          </button>
        </div>
      </motion.article>
    );
  },
);

ReportCard.displayName = "ReportCard";

ReportCard.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    icono: PropTypes.elementType.isRequired,
    color: PropTypes.string,
    checkColor: PropTypes.string,
    incluye: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  downloading: PropTypes.bool.isRequired,
  onDownload: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default ReportCard;
