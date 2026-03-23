import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Download, Eye, Loader2 } from "lucide-react";
import { buttonVariants, staggerItem } from "../utils/animations";

const ReportCard = memo(
  ({ report, downloading, onDownload, onViewDetails }) => {
    const IconComponent = report.icono;

    return (
      <motion.article
        className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 sm:rounded-xl md:rounded-2xl h-full min-h-[210px] xl:min-h-[250px] flex flex-col"
        aria-labelledby={`reporte-${report.id}-titulo`}
        variants={staggerItem}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div
          className={`relative bg-gradient-to-br ${report.color} p-3.5 sm:p-4 lg:p-5 overflow-hidden`}
        >
          <div
            className="absolute inset-0 bg-white/5 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative flex items-start gap-3 sm:gap-4">
            <motion.div
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl shrink-0 sm:p-2.5"
              aria-hidden="true"
              whileHover={{ rotate: 8, scale: 1.04 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <IconComponent className="w-5 h-5 text-white sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3
                id={`reporte-${report.id}-titulo`}
                className="text-base font-bold text-white leading-tight sm:text-lg lg:text-xl"
              >
                {report.titulo}
              </h3>
              <p className="text-white/90 text-xs leading-snug mt-1 line-clamp-2 sm:text-sm sm:mt-1.5 lg:text-sm lg:line-clamp-none">
                {report.descripcion}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 lg:p-4 mt-auto">
          <div className="grid grid-cols-1 gap-2.5 w-full">
            <motion.button
              onClick={onViewDetails}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm sm:text-[15px] transition-all duration-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 cursor-pointer w-full"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              aria-label={`Ver detalle del reporte ${report.titulo}`}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <span>Ver detalle</span>
            </motion.button>

            <motion.button
              onClick={onDownload}
              disabled={downloading}
              className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm sm:text-[15px] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 cursor-pointer w-full ${
                downloading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : `bg-gradient-to-br ${report.color} text-white shadow-md shadow-gray-200 hover:shadow-lg active:shadow-sm`
              }`}
              variants={buttonVariants}
              initial="rest"
              whileHover={!downloading ? "hover" : "rest"}
              whileTap={!downloading ? "tap" : "rest"}
              aria-label={`Descargar reporte de ${report.titulo} en formato Excel`}
              aria-busy={downloading}
              aria-live="polite"
              aria-disabled={downloading}
            >
              {!downloading && (
                <motion.span
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                {downloading ? (
                  <>
                    <Loader2
                      className="w-4 h-4 animate-spin sm:w-5 sm:h-5"
                      aria-hidden="true"
                    />
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <Download
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      aria-hidden="true"
                    />
                    <span>Descargar Excel</span>
                  </>
                )}
              </span>
            </motion.button>
          </div>
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
    color: PropTypes.string.isRequired,
    checkColor: PropTypes.string.isRequired,
    incluye: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  downloading: PropTypes.bool.isRequired,
  onDownload: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default ReportCard;