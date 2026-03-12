import { motion } from "framer-motion";
import { Loader2, UserX } from "lucide-react";

/**
 * Estado de carga con spinner animado
 */
export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-12 h-12 text-blue-600" />
      </motion.div>
      <p className="text-gray-500 mt-4 font-medium">Cargando personal...</p>
    </div>
  );
};

/**
 * Estado vacío cuando no hay resultados
 */
export const EmptyState = ({ onCrearEmpleado }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <UserX className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No se encontraron empleados
      </h3>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        No hay empleados que coincidan con los filtros seleccionados. Intenta
        ajustar tu búsqueda o registra un nuevo empleado.
      </p>
      {onCrearEmpleado && (
        <button
          onClick={onCrearEmpleado}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
        >
          + Registrar Primer Empleado
        </button>
      )}
    </motion.div>
  );
};
