import { memo } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

/**
 * Componente de información adicional sobre reportes
 * ✅ Mobile-first design
 * ✅ Animaciones sutiles con Framer Motion
 * ✅ Accesibilidad completa
 */
const ReportInfo = memo(() => {
  return (
    <motion.aside
      aria-labelledby="info-adicional"
      className="
        mt-2.5 p-3 
        bg-linear-to-r from-blue-50 to-indigo-50 
        border-2 border-blue-200/60 
        rounded-lg 
        sm:mt-3 sm:p-4 sm:rounded-xl 
        lg:mt-4 lg:p-5 lg:rounded-2xl
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{
        borderColor: "rgb(191 219 254)", // blue-200
        transition: { duration: 0.2 },
      }}
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        {/* Icono animado */}
        <motion.div
          className="
            p-2 bg-blue-100 rounded-lg shrink-0
            sm:p-2.5 sm:rounded-xl
          "
          whileHover={{ rotate: 6, scale: 1.04 }}
          transition={{ type: "spring", stiffness: 340, damping: 22 }}
        >
          <Info
            className="w-5 h-5 text-blue-600 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
            aria-hidden="true"
          />
        </motion.div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <h4
            id="info-adicional"
            className="
              font-bold text-blue-900 mb-1 text-sm leading-tight
              sm:text-base sm:mb-1.5
            "
          >
            Información sobre los reportes
          </h4>
          <p
            className="
            text-blue-800 text-xs leading-relaxed
            sm:text-sm
          "
          >
            Los reportes se generan en formato Excel (.xlsx) con tablas
            formateadas profesionalmente, estadísticas detalladas y análisis
            comparativos. Aplica filtros antes de descargar para personalizar
            los datos según tus necesidades. Incluyen formato condicional,
            rankings y múltiples hojas de datos.
          </p>
        </div>
      </div>
    </motion.aside>
  );
});

ReportInfo.displayName = "ReportInfo";

export default ReportInfo;
