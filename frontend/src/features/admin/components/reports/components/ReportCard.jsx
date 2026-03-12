import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { buttonVariants, staggerItem } from "../utils/animations";

/**
 * Componente de tarjeta de reporte individual
 * ✅ Mobile-first (320px → 1440px+)
 * ✅ Animaciones fluidas con Framer Motion
 * ✅ Accesibilidad completa (a11y)
 * ✅ Touch targets 44px+ (WCAG AAA)
 * ✅ Estados hover/focus/active bien definidos
 */
const ReportCard = memo(({ report, downloading, onDownload }) => {
  const IconComponent = report.icono;

  return (
    <motion.article
      className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 sm:rounded-xl md:rounded-2xl"
      aria-labelledby={`reporte-${report.id}-titulo`}
      variants={staggerItem}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Header del reporte - Mobile First con gradiente */}
      <div
        className={`relative bg-gradient-to-r ${report.color} p-4 sm:p-6 lg:p-8 overflow-hidden`}
      >
        {/* Pattern decorativo (sutil) */}
        <div
          className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative flex items-start gap-3 sm:gap-4">
          {/* Icono con animación */}
          <motion.div
            className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl shrink-0 sm:p-3"
            aria-hidden="true"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <IconComponent className="w-6 h-6 text-white sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
          </motion.div>

          {/* Texto del header - responsive */}
          <div className="flex-1 min-w-0">
            <h3
              id={`reporte-${report.id}-titulo`}
              className="text-lg font-bold text-white leading-tight sm:text-xl lg:text-2xl"
            >
              {report.titulo}
            </h3>
            <p className="text-white/90 text-xs leading-snug mt-1 line-clamp-2 sm:text-sm sm:mt-2 lg:text-base lg:line-clamp-none">
              {report.descripcion}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido del reporte - Mobile optimizado */}
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Título de features */}
        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 sm:text-base">
          <CheckCircle2
            className={`w-4 h-4 ${report.checkColor} shrink-0 sm:w-5 sm:h-5`}
            aria-hidden="true"
          />
          <span>Incluye:</span>
        </h4>

        {/* Lista de features - mejor spacing mobile */}
        <ul
          className="space-y-2 mb-5 sm:mb-6"
          aria-label={`Características incluidas en ${report.titulo}`}
        >
          {report.incluye.map((item, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed sm:gap-3 sm:text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${report.checkColor} shrink-0 mt-0.5 sm:w-4 sm:h-4`}
                aria-hidden="true"
              />
              <span className="flex-1">{item}</span>
            </motion.li>
          ))}
        </ul>

        {/* Botón de descarga - Touch optimizado (min 44px) */}
        <motion.button
          onClick={onDownload}
          disabled={downloading}
          className={`
            relative w-full min-h-[44px] py-3 px-4 rounded-lg font-semibold 
            flex items-center justify-center gap-2 
            transition-all duration-200 
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500
            sm:min-h-[48px] sm:py-3.5 sm:px-6 sm:rounded-xl
            ${
              downloading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : `bg-gradient-to-r ${report.color} text-white shadow-lg hover:shadow-xl cursor-pointer active:shadow-md`
            }
          `}
          variants={buttonVariants}
          initial="rest"
          whileHover={!downloading ? "hover" : "rest"}
          whileTap={!downloading ? "tap" : "rest"}
          aria-label={`Descargar reporte de ${report.titulo} en formato Excel`}
          aria-busy={downloading}
          aria-live="polite"
          aria-disabled={downloading}
        >
          {/* Overlay para hover effect */}
          {!downloading && (
            <motion.span
              className="absolute inset-0 bg-white/10 rounded-lg sm:rounded-xl"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
            />
          )}

          {/* Contenido del botón */}
          <span className="relative z-10 flex items-center gap-2">
            {downloading ? (
              <>
                <Loader2
                  className="w-4 h-4 animate-spin sm:w-5 sm:h-5"
                  aria-hidden="true"
                />
                <span className="text-sm sm:text-base">Generando...</span>
              </>
            ) : (
              <>
                <Download
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  aria-hidden="true"
                />
                <span className="text-sm sm:text-base font-semibold">
                  Descargar Excel
                </span>
              </>
            )}
          </span>
        </motion.button>

        {/* Texto de ayuda adicional (mobile) */}
        <p
          className="text-xs text-gray-500 text-center mt-2 sm:hidden"
          aria-hidden="true"
        >
          Toca para descargar
        </p>
      </div>
    </motion.article>
  );
});

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
};

export default ReportCard;
