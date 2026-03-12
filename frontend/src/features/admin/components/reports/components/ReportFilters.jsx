import { memo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Calendar,
  CalendarDays,
  Settings,
  CreditCard,
  Tag,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { DATE_RANGES } from "../constants/reportData";
import {
  collapseVariants,
  badgePulse,
  buttonVariants,
} from "../utils/animations";

/**
 * Componente de filtros de reportes
 * ✅ Mobile-first (320px → 1440px+)
 * ✅ Animaciones fluidas de colapso
 * ✅ Accesibilidad completa (keyboard nav, ARIA, screen readers)
 * ✅ Touch targets 44px+ (WCAG AAA)
 * ✅ Estados focus-visible bien definidos
 */
const ReportFilters = memo(
  ({
    filters,
    isOpen,
    hasActiveFilters,
    activeFiltersCount,
    onToggle,
    onDateRangeChange,
    onFilterChange,
    onClear,
  }) => {
    return (
      <section
        aria-labelledby="filtros-heading"
        className="mb-4 sm:mb-6 lg:mb-8"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden sm:rounded-xl lg:rounded-2xl">
          {/* Header de Filtros - Siempre visible y accesible */}
          <motion.button
            onClick={onToggle}
            className="
              w-full px-3 py-3.5 flex items-center justify-between 
              bg-gradient-to-r from-green-50 to-emerald-100 
              hover:from-green-100 hover:to-emerald-200 
              transition-colors duration-200 
              focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset 
              cursor-pointer group
              sm:px-5 sm:py-4
              lg:px-6 lg:py-5
            "
            aria-expanded={isOpen}
            aria-controls="filtros-content"
            aria-label={
              isOpen
                ? "Ocultar filtros de búsqueda"
                : "Mostrar filtros de búsqueda"
            }
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {/* Icono animado */}
              <motion.div
                className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors sm:p-2"
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.3 }}
              >
                <Filter
                  className="w-4 h-4 text-green-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                  aria-hidden="true"
                />
              </motion.div>

              {/* Título y badge */}
              <div className="flex items-center gap-2 flex-wrap sm:gap-3">
                <h2
                  id="filtros-heading"
                  className="text-base font-bold text-gray-900 sm:text-lg lg:text-xl"
                >
                  Filtros de Búsqueda
                </h2>

                {/* Badge animado de filtros activos */}
                <AnimatePresence mode="wait">
                  {hasActiveFilters && (
                    <motion.span
                      className="
                        px-2 py-0.5 text-xs font-bold 
                        bg-gradient-to-r from-green-500 to-emerald-500 
                        text-white rounded-full shadow-sm
                        sm:px-2.5 sm:py-1 sm:text-xs
                      "
                      variants={badgePulse}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {activeFiltersCount}{" "}
                      {activeFiltersCount === 1 ? "Activo" : "Activos"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Indicador de estado (chevron animado) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="text-xs font-medium text-green-600 hidden sm:inline lg:text-sm">
                {isOpen ? "Ocultar" : "Mostrar"}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown
                  className="w-4 h-4 text-green-600 sm:w-5 sm:h-5"
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </motion.button>

          {/* Contenido de Filtros - Colapsable con animación */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id="filtros-content"
                variants={collapseVariants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{ overflow: "hidden" }}
                role="region"
                aria-labelledby="filtros-heading"
              >
                <div className="px-3 pb-4 space-y-4 pt-2 sm:px-5 sm:pb-5 sm:space-y-5 lg:px-6 lg:pb-6 lg:space-y-6">
                  {/* Rangos Rápidos */}
                  <div>
                    <label
                      id="rangos-rapidos-label"
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 sm:gap-2 sm:text-sm sm:mb-3"
                    >
                      <Calendar
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        aria-hidden="true"
                      />
                      Rangos Rápidos
                    </label>
                    <div
                      role="group"
                      aria-labelledby="rangos-rapidos-label"
                      className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:flex md:flex-wrap md:gap-2"
                    >
                      {DATE_RANGES.map((range) => (
                        <motion.button
                          key={range.key}
                          onClick={() => onDateRangeChange(range.key)}
                          className="
                            min-h-[44px] px-3 py-2 
                            bg-green-50 text-green-700 
                            rounded-lg font-medium text-xs
                            hover:bg-green-100 active:bg-green-200
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
                            transition-colors cursor-pointer
                            sm:px-4 sm:text-sm
                          "
                          aria-label={`Seleccionar rango de ${range.label.toLowerCase()}`}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          {range.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Grid de Filtros - Mobile First */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4">
                    {/* Fecha Desde */}
                    <div>
                      <label
                        htmlFor="fecha-desde"
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 sm:text-sm sm:mb-3"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-green-600 sm:w-4 sm:h-4" />
                        <span>Fecha Desde</span>
                      </label>
                      <div className="relative">
                        <input
                          id="fecha-desde"
                          type="date"
                          value={filters.fechaDesde}
                          onChange={(e) =>
                            onFilterChange("fechaDesde", e.target.value)
                          }
                          className="
                            w-full min-h-[44px] px-3 py-2 pl-10 
                            border-2 border-gray-200 bg-white text-gray-900 text-sm
                            rounded-lg 
                            hover:border-gray-300 hover:shadow-sm
                            focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:shadow-lg
                            transition-all duration-200
                            sm:px-4 sm:py-3 sm:pl-12 sm:rounded-xl
                          "
                          aria-describedby="fecha-desde-desc"
                        />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none sm:left-4 sm:w-4 sm:h-4" />
                      </div>
                      <span id="fecha-desde-desc" className="sr-only">
                        Selecciona la fecha inicial del rango
                      </span>
                    </div>

                    {/* Fecha Hasta */}
                    <div>
                      <label
                        htmlFor="fecha-hasta"
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 sm:text-sm sm:mb-3"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-green-600 sm:w-4 sm:h-4" />
                        <span>Fecha Hasta</span>
                      </label>
                      <div className="relative">
                        <input
                          id="fecha-hasta"
                          type="date"
                          value={filters.fechaHasta}
                          onChange={(e) =>
                            onFilterChange("fechaHasta", e.target.value)
                          }
                          className="
                            w-full min-h-[44px] px-3 py-2 pl-10 
                            border-2 border-gray-200 bg-white text-gray-900 text-sm
                            rounded-lg 
                            hover:border-gray-300 hover:shadow-sm
                            focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:shadow-lg
                            transition-all duration-200
                            sm:px-4 sm:py-3 sm:pl-12 sm:rounded-xl
                          "
                          aria-describedby="fecha-hasta-desc"
                        />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none sm:left-4 sm:w-4 sm:h-4" />
                      </div>
                      <span id="fecha-hasta-desc" className="sr-only">
                        Selecciona la fecha final del rango
                      </span>
                    </div>

                    {/* Estado */}
                    <div>
                      <label
                        htmlFor="estado-filter"
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 sm:text-sm sm:mb-3"
                      >
                        <Settings className="w-3.5 h-3.5 text-green-600 sm:w-4 sm:h-4" />
                        <span>Estado</span>
                      </label>
                      <div className="relative">
                        <select
                          id="estado-filter"
                          value={filters.estado}
                          onChange={(e) =>
                            onFilterChange("estado", e.target.value)
                          }
                          className="
                            w-full min-h-[44px] px-3 py-2 pl-10 pr-9
                            border-2 border-gray-200 bg-white text-gray-900 text-sm
                            rounded-lg appearance-none cursor-pointer
                            hover:border-gray-300 hover:shadow-sm
                            focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:shadow-lg
                            transition-all duration-200
                            sm:px-4 sm:py-3 sm:pl-12 sm:pr-10 sm:rounded-xl
                          "
                          aria-label="Filtrar por estado de la venta"
                        >
                          <option value="Todos">Todos los Estados</option>
                          <optgroup label="Ventas Online">
                            <option value="pendiente">Pendiente</option>
                            <option value="retirado">Retirado</option>
                            <option value="cancelado">Cancelado</option>
                          </optgroup>
                          <optgroup label="Ventas Empleados">
                            <option value="completada">Completada</option>
                            <option value="anulada">Anulada</option>
                          </optgroup>
                        </select>
                        <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none sm:left-4 sm:w-4 sm:h-4" />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none sm:w-4 sm:h-4" />
                      </div>
                    </div>

                    {/* Método de Pago */}
                    <div>
                      <label
                        htmlFor="metodo-pago-filter"
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 sm:text-sm sm:mb-3"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-green-600 sm:w-4 sm:h-4" />
                        <span>Método de Pago</span>
                      </label>
                      <div className="relative">
                        <select
                          id="metodo-pago-filter"
                          value={filters.metodoPago}
                          onChange={(e) =>
                            onFilterChange("metodoPago", e.target.value)
                          }
                          className="
                            w-full min-h-[44px] px-3 py-2 pl-10 pr-9
                            border-2 border-gray-200 bg-white text-gray-900 text-sm
                            rounded-lg appearance-none cursor-pointer
                            hover:border-gray-300 hover:shadow-sm
                            focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:shadow-lg
                            transition-all duration-200
                            sm:px-4 sm:py-3 sm:pl-12 sm:pr-10 sm:rounded-xl
                          "
                          aria-label="Filtrar por método de pago"
                        >
                          <option value="Todos">Todos los Métodos</option>
                          <option value="Efectivo">Efectivo</option>
                          <option value="Tarjeta">Tarjeta</option>
                          <option value="Transferencia">Transferencia</option>
                          <option value="Mercado Pago">Mercado Pago</option>
                        </select>
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none sm:left-4 sm:w-4 sm:h-4" />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none sm:w-4 sm:h-4" />
                      </div>
                    </div>

                    {/* Categoría */}
                    <div>
                      <label
                        htmlFor="categoria-filter"
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 sm:text-sm sm:mb-3"
                      >
                        <Tag className="w-3.5 h-3.5 text-green-600 sm:w-4 sm:h-4" />
                        <span>Categoría</span>
                      </label>
                      <div className="relative">
                        <select
                          id="categoria-filter"
                          value={filters.categoria}
                          onChange={(e) =>
                            onFilterChange("categoria", e.target.value)
                          }
                          className="
                            w-full min-h-[44px] px-3 py-2 pl-10 pr-9
                            border-2 border-gray-200 bg-white text-gray-900 text-sm
                            rounded-lg appearance-none cursor-pointer
                            hover:border-gray-300 hover:shadow-sm
                            focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:shadow-lg
                            transition-all duration-200
                            sm:px-4 sm:py-3 sm:pl-12 sm:pr-10 sm:rounded-xl
                          "
                          aria-label="Filtrar por categoría de producto"
                        >
                          <option value="Todas">Todas las Categorías</option>
                          <option value="Fragancias">Fragancias</option>
                          <option value="Belleza">Belleza</option>
                          <option value="Dermocosmética">Dermocosmética</option>
                          <option value="Medicamentos con Receta">
                            Medicamentos con Receta
                          </option>
                          <option value="Medicamentos Venta Libre">
                            Medicamentos Venta Libre
                          </option>
                          <option value="Cuidado Personal">
                            Cuidado Personal
                          </option>
                          <option value="Bebes y Niños">Bebés y Niños</option>
                        </select>
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none sm:left-4 sm:w-4 sm:h-4" />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Botón Limpiar Filtros - Touch optimizado */}
                  <div className="flex items-center justify-between pt-2 sm:pt-3">
                    <motion.button
                      onClick={onClear}
                      className="
                        min-h-[44px] inline-flex items-center gap-2 px-4 py-2 
                        bg-green-100 text-green-700 font-medium text-sm
                        rounded-lg 
                        hover:bg-green-200 active:bg-green-300
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
                        transition-colors cursor-pointer
                        sm:rounded-xl
                      "
                      aria-label="Limpiar todos los filtros aplicados"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                      <span>Limpiar Filtros</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    );
  },
);

ReportFilters.displayName = "ReportFilters";

ReportFilters.propTypes = {
  filters: PropTypes.shape({
    fechaDesde: PropTypes.string.isRequired,
    fechaHasta: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    metodoPago: PropTypes.string.isRequired,
    categoria: PropTypes.string.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  hasActiveFilters: PropTypes.bool.isRequired,
  activeFiltersCount: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDateRangeChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default ReportFilters;
