import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const DireccionesErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <AlertCircle size={16} className="mt-0.5" aria-hidden="true" />
      <span>{message}</span>
    </motion.div>
  );
};

export default DireccionesErrorAlert;
