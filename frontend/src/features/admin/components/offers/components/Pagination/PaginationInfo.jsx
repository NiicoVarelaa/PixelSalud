import { motion } from "framer-motion";

export const PaginationInfo = ({ inicio, fin, totalItems }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="text-sm text-gray-700 text-center sm:text-left order-2 sm:order-1"
      role="status"
      aria-live="polite"
    >
      Mostrando <span className="font-bold text-gray-900">{inicio}</span> a{" "}
      <span className="font-bold text-gray-900">{fin}</span> de{" "}
      <span className="font-bold text-gray-900">{totalItems}</span> producto
      {totalItems !== 1 ? "s" : ""}
    </motion.div>
  );
};
