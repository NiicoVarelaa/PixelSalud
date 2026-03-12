import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { ShoppingBag, ShoppingCart } from "lucide-react";

const VentasSwitch = ({ activeOption, onOptionChange }) => {
  const options = [
    {
      value: "empleados",
      label: "Ventas Empleados",
      labelShort: "Empleados",
      description: "Ventas físicas del local",
      icon: ShoppingBag,
      colorClass: "orange",
    },
    {
      value: "online",
      label: "Ventas Online",
      labelShort: "Online",
      description: "Pedidos web y envíos",
      icon: ShoppingCart,
      colorClass: "green",
    },
  ];

  // Handler con soporte de teclado
  const handleKeyDown = (e, optionValue) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOptionChange(optionValue);
    }
  };

  return (
    <nav
      className="w-full max-w-3xl mx-auto"
      aria-label="Selector tipo de venta"
      role="tablist"
    >
      {/* Mobile: Stack vertical, Desktop: Horizontal */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:p-2 sm:bg-white sm:border sm:border-gray-200 sm:rounded-xl sm:shadow-sm">
        {options.map((option) => {
          const isActive = activeOption === option.value;
          const Icon = option.icon;

          // Colores profesionales basados en farmacia
          const colorClasses = {
            active:
              option.colorClass === "orange"
                ? "bg-gradient-to-br from-orange-500 to-orange-600"
                : "bg-gradient-to-br from-primary-500 to-primary-600",
            icon:
              option.colorClass === "orange"
                ? "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
                : "bg-primary-50 text-primary-600 group-hover:bg-primary-100",
            focus:
              option.colorClass === "orange"
                ? "focus-visible:ring-orange-500"
                : "focus-visible:ring-primary-500",
          };

          return (
            <button
              key={option.value}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${option.value}`}
              aria-label={`${option.label}: ${option.description}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onOptionChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              className={`
                group relative flex-1 rounded-xl transition-all duration-200 
                outline-none cursor-pointer
                ${
                  isActive
                    ? "shadow-lg"
                    : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md sm:border-0 sm:hover:bg-gray-50"
                }
                focus-visible:ring-2 focus-visible:ring-offset-2 
                ${colorClasses.focus}
              `}
            >
              {/* Background animado solo cuando está activo */}
              {isActive && (
                <motion.div
                  layoutId="activeVentasTab"
                  className={`absolute inset-0 rounded-xl ${colorClasses.active}`}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}

              {/* Contenido del botón - Mobile First */}
              <div
                className={`
                relative z-10 flex items-center gap-3 sm:gap-4 
                p-4 sm:py-5 sm:px-5
                ${isActive ? "" : ""}
              `}
              >
                {/* Icono - Adaptativo */}
                <div
                  className={`
                    shrink-0 p-2.5 sm:p-3 rounded-lg transition-all
                    ${isActive ? "bg-white/20" : colorClasses.icon}
                  `}
                  aria-hidden="true"
                >
                  <Icon
                    className={`
                      w-5 h-5 sm:w-6 sm:h-6 transition-colors
                      ${isActive ? "text-white" : ""}
                    `}
                  />
                </div>

                {/* Texto - Responsive */}
                <div className="flex-1 text-left min-w-0">
                  {/* Título - Mobile más corto, Desktop completo */}
                  <h3
                    className={`
                      text-base sm:text-lg font-semibold transition-colors
                      ${isActive ? "text-white" : "text-gray-900"}
                    `}
                  >
                    <span className="sm:hidden">{option.labelShort}</span>
                    <span className="hidden sm:inline">{option.label}</span>
                  </h3>

                  {/* Descripción - Solo visible en desktop o activo en mobile */}
                  <p
                    className={`
                      text-xs sm:text-sm mt-0.5 sm:mt-1 transition-colors
                      ${isActive ? "text-white/90" : "text-gray-600"}
                      ${isActive ? "block" : "hidden sm:block"}
                    `}
                  >
                    {option.description}
                  </p>
                </div>

                {/* Indicador visual en mobile cuando no está activo */}
                {!isActive && (
                  <div
                    className="sm:hidden w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-primary-400 transition-colors"
                    aria-hidden="true"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Hint de navegación por teclado (solo en desktop) */}
      <div
        className="hidden lg:block mt-2 text-center text-xs text-gray-500"
        aria-live="polite"
      >
        Usa Tab y Enter para navegar
      </div>
    </nav>
  );
};

VentasSwitch.propTypes = {
  activeOption: PropTypes.oneOf(["empleados", "online"]).isRequired,
  onOptionChange: PropTypes.func.isRequired,
};

export default VentasSwitch;
