import { motion } from "framer-motion";

export const PaginationButton = ({
  onClick,
  disabled,
  icon: Icon,
  label,
  className = "",
  ariaLabel,
  showText = false,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      onKeyDown={handleKeyDown}
      className={`
        flex items-center justify-center gap-1.5 rounded-xl
        font-semibold text-sm transition-all duration-200
        ${
          disabled
            ? "text-gray-300 cursor-not-allowed bg-gray-50"
            : "text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        }
        ${className}
      `}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {Icon && <Icon size={18} />}
      {showText && label && <span className="hidden sm:inline">{label}</span>}
    </motion.button>
  );
};
