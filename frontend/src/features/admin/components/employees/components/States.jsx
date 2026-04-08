import { motion } from "framer-motion";
import { Users, UserPlus } from "lucide-react";

export const LoadingState = () => (
  <div
    className="flex flex-col items-center justify-center py-16"
    role="status"
    aria-live="polite"
    aria-label="Cargando empleados"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-green-600"
      aria-hidden="true"
    />
    <p className="mt-3 text-sm text-gray-500">Cargando personal...</p>
  </div>
);

export const EmptyState = ({ onCrearEmpleado }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 text-center px-6"
    role="status"
  >
    <div
      className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100"
      aria-hidden="true"
    >
      <Users size={22} className="text-gray-400" />
    </div>
    <p className="text-sm font-semibold text-gray-700">Sin empleados</p>
    <p className="mt-1 text-xs text-gray-400 max-w-xs">
      No hay empleados que coincidan con los filtros. Ajustá la búsqueda o registrá uno nuevo.
    </p>
    {onCrearEmpleado && (
      <button
        type="button"
        onClick={onCrearEmpleado}
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
      >
        <UserPlus size={15} aria-hidden="true" />
        Registrar empleado
      </button>
    )}
  </motion.div>
);