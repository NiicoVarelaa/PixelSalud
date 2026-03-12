import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

export const PageNumber = ({ num, isActive, onClick }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  if (num === "...") {
    return (
      <div
        className="hidden sm:flex items-center justify-center w-10 h-10 text-gray-400"
        aria-hidden="true"
        role="presentation"
      >
        <MoreHorizontal size={20} />
      </div>
    );
  }

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: isActive ? 1 : 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`
        flex items-center justify-center w-10 h-10 rounded-xl
        text-sm font-bold transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${
          isActive
            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105 focus-visible:ring-primary-400"
            : "text-gray-700 hover:bg-gray-100 hover:text-primary-600 focus-visible:ring-gray-400"
        }
      `}
      aria-label={`Ir a página ${num}`}
      aria-current={isActive ? "page" : undefined}
    >
      {num}
    </motion.button>
  );
};
