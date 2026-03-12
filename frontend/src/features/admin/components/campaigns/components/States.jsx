import { motion } from "framer-motion";
import { Tag, Plus } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"
      />
    </div>
  );
};

export const EmptyState = ({ onCrearCampana }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg p-12 text-center"
    >
      <Tag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-gray-700 mb-2">No hay campañas</h3>
      <p className="text-gray-500 mb-6">
        Crea tu primera campaña para comenzar a gestionar ofertas
      </p>
      <button
        onClick={onCrearCampana}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg font-semibold"
      >
        <Plus className="w-5 h-5" />
        Crear Primera Campaña
      </button>
    </motion.div>
  );
};
