import { motion } from "framer-motion";
import { Tag, Plus } from "lucide-react";

export const LoadingState = () => (
  <div
    className="flex items-center justify-center py-20"
    role="status"
    aria-live="polite"
    aria-label="Cargando campañas"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-green-600"
      aria-hidden="true"
    />
    <span className="ml-3 text-sm text-gray-500">Cargando campañas...</span>
  </div>
);

export const EmptyState = ({ onCrearCampana }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center"
    role="status"
  >
    <div
      className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100"
      aria-hidden="true"
    >
      <Tag size={22} className="text-gray-400" />
    </div>
    <p className="text-sm font-semibold text-gray-700">No hay campañas</p>
    <p className="mt-1 text-xs text-gray-400">
      Creá tu primera campaña para gestionar ofertas grupales
    </p>
    <button
      type="button"
      onClick={onCrearCampana}
      className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
    >
      <Plus size={15} aria-hidden="true" />
      Crear campaña
    </button>
  </motion.div>
);
