import { motion } from "framer-motion";
import { FileSearch, AlertCircle } from "lucide-react";

/* Usado tanto dentro de <tbody> (desktop) como en <div> (mobile/standalone) */

export const LoadingState = ({ asTableRow = false }) => {
  const inner = (
    <div
      className="flex flex-col items-center justify-center gap-2 py-16"
      role="status"
      aria-live="polite"
      aria-label="Cargando registros de auditoría"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-green-600"
        aria-hidden="true"
      />
      <p className="text-sm text-gray-500">Cargando auditorías...</p>
    </div>
  );

  if (asTableRow) {
    return (
      <tr>
        <td colSpan={6}>{inner}</td>
      </tr>
    );
  }
  return inner;
};

export const EmptyState = ({ asTableRow = false }) => {
  const inner = (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-2 py-16 text-center"
      role="status"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100"
        aria-hidden="true"
      >
        <FileSearch size={22} className="text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-700">Sin resultados</p>
      <p className="text-xs text-gray-400">
        No hay registros con los filtros aplicados
      </p>
    </motion.div>
  );

  if (asTableRow) {
    return (
      <tr>
        <td colSpan={6}>{inner}</td>
      </tr>
    );
  }
  return inner;
};

export const ErrorBanner = ({ error }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    role="alert"
    aria-live="assertive"
    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
  >
    <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" aria-hidden="true" />
    <div>
      <p className="text-xs font-semibold text-red-700">Error al cargar auditorías</p>
      <p className="mt-0.5 text-xs text-red-600">{error}</p>
    </div>
  </motion.div>
);