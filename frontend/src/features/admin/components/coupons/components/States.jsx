import { motion } from "framer-motion";
import { Tag } from "lucide-react";

export const LoadingState = () => (
  <div
    className="flex flex-col items-center justify-center py-16"
    role="status"
    aria-live="polite"
    aria-label="Cargando cupones"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-green-600"
      aria-hidden="true"
    />
    <p className="mt-3 text-sm text-gray-500">Cargando cupones...</p>
  </div>
);

export const EmptyState = ({ mensaje = "No se encontraron cupones" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 text-center"
    role="status"
  >
    <div
      className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100"
      aria-hidden="true"
    >
      <Tag size={22} className="text-gray-400" />
    </div>
    <p className="text-sm font-semibold text-gray-700">{mensaje}</p>
    <p className="mt-1 text-xs text-gray-400">
      Intentá ajustar los filtros o crear un nuevo cupón
    </p>
  </motion.div>
);