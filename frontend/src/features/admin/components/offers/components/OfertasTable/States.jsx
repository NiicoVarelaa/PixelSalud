import { motion } from "framer-motion";
import { Tag } from "lucide-react";

export const LoadingState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
          aria-hidden="true"
        />
      </div>
      <p className="text-base text-gray-600 font-medium">
        Cargando productos...
      </p>
    </motion.div>
  );
};

export const EmptyState = ({ busqueda, filtroCategoria, filtroDescuento }) => {
  const hasFilters =
    busqueda || filtroCategoria !== "todas" || filtroDescuento !== "todos";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
      role="status"
    >
      <div
        className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner"
        aria-hidden="true"
      >
        <Tag className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        No se encontraron productos
      </h3>
      <p className="text-base text-gray-600">
        {hasFilters
          ? "Intenta ajustar los filtros de búsqueda"
          : "No hay productos disponibles"}
      </p>
    </motion.div>
  );
};
