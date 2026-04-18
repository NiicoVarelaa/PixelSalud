import { memo } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

const ReportInfo = memo(() => (
  <motion.aside
    aria-labelledby="info-reportes-heading"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.15 }}
    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
  >
    <div className="flex items-start gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100"
        aria-hidden="true"
      >
        <Info size={15} className="text-green-700" />
      </div>
      <div>
        <h4
          id="info-reportes-heading"
          className="text-xs font-semibold text-gray-700 mb-1"
        >
          Sobre los reportes
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Los reportes se generan en formato Excel (.xlsx) con tablas
          formateadas, estadísticas detalladas y análisis comparativos. Aplicá
          filtros antes de descargar para personalizar los datos. Incluyen
          formato condicional, rankings y múltiples hojas de datos.
        </p>
      </div>
    </div>
  </motion.aside>
));

ReportInfo.displayName = "ReportInfo";

export default ReportInfo;
