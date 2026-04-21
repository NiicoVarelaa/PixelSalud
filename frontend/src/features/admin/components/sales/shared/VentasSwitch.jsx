import PropTypes from "prop-types";
import { Store, Globe } from "lucide-react";
import { motion } from "framer-motion";

const VentasSwitch = ({ activeOption, onOptionChange }) => {
  const options = [
    {
      value: "empleados",
      label: "Ventas Empleados",
      icon: Store,
    },
    {
      value: "online",
      label: "Ventas Online",
      icon: Globe,
    },
  ];

  const handleKeyDown = (e, optionValue) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOptionChange(optionValue);
    }
  };

  return (
    <nav
      className="w-full sm:w-auto"
      aria-label="Selector tipo de venta"
      role="tablist"
    >
      <div className="flex p-1.5 bg-gray-50 rounded-xl border border-gray-200 shadow-inner w-full sm:w-max gap-2">
        {options.map((option) => {
          const isActive = activeOption === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${option.value}`}
              aria-label={option.label}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onOptionChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              className={`
                group relative flex-1 sm:flex-none flex items-center justify-center gap-2 
                px-4 sm:px-4 py-2 text-sm sm:text-base font-bold rounded-lg
                transition-colors duration-200 outline-none cursor-pointer
                focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100
                ${
                  isActive
                    ? "text-green-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/40"
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeVentasTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-gray-200/50 z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                    isActive
                      ? "text-green-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

VentasSwitch.propTypes = {
  activeOption: PropTypes.oneOf(["empleados", "online"]).isRequired,
  onOptionChange: PropTypes.func.isRequired,
};

export default VentasSwitch;
