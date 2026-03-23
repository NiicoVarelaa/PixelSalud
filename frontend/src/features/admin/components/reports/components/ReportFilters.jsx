import { memo, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CalendarDays,
  ChevronDown,
  Filter,
  Info,
  X,
} from "lucide-react";
import CustomSelect from "../../products/components/CustomSelect";
import { DATE_RANGES } from "../constants/reportData";
import {
  badgePulse,
  buttonVariants,
  collapseVariants,
} from "../utils/animations";

const DEFAULT_VALUES = {
  estado: "Todos",
  metodoPago: "Todos",
  categoria: "Todas",
};

const rangeLabelByKey = DATE_RANGES.reduce((acc, range) => {
  acc[range.key] = range.label;
  return acc;
}, {});

const ReportFilters = memo(
  ({
    filters,
    isOpen,
    hasActiveFilters,
    activeFiltersCount,
    activeDateRange,
    onToggle,
    onDateRangeChange,
    onFilterChange,
    onClearDateRange,
    onClear,
    onOpenInfo,
    fixed = false,
  }) => {
    const panelOpen = fixed ? true : isOpen;
    const [advancedOpen, setAdvancedOpen] = useState(false);

    const opcionesEstado = useMemo(
      () => [
        { value: "Todos", label: "Todos los Estados" },
        { value: "pendiente", label: "Pendiente" },
        { value: "retirado", label: "Retirado" },
        { value: "cancelado", label: "Cancelado" },
        { value: "completada", label: "Completada" },
        { value: "anulada", label: "Anulada" },
      ],
      [],
    );

    const opcionesMetodoPago = useMemo(
      () => [
        { value: "Todos", label: "Todos los Metodos" },
        { value: "Efectivo", label: "Efectivo" },
        { value: "Tarjeta", label: "Tarjeta" },
        { value: "Transferencia", label: "Transferencia" },
        { value: "Mercado Pago", label: "Mercado Pago" },
      ],
      [],
    );

    const opcionesCategoria = useMemo(
      () => [
        { value: "Todas", label: "Todas las Categorias" },
        { value: "Fragancias", label: "Fragancias" },
        { value: "Belleza", label: "Belleza" },
        { value: "Dermocosmética", label: "Dermocosmetica" },
        {
          value: "Medicamentos con Receta",
          label: "Medicamentos con Receta",
        },
        {
          value: "Medicamentos Venta Libre",
          label: "Medicamentos Venta Libre",
        },
        { value: "Cuidado Personal", label: "Cuidado Personal" },
        { value: "Bebes y Niños", label: "Bebes y Ninos" },
      ],
      [],
    );

    const activeChips = useMemo(() => {
      const chips = [];

      if (activeDateRange) {
        chips.push({
          key: "dateRange",
          label: `Rango: ${rangeLabelByKey[activeDateRange] || activeDateRange}`,
          onRemove: onClearDateRange,
        });
      } else {
        if (filters.fechaDesde) {
          chips.push({
            key: "fechaDesde",
            label: `Desde: ${filters.fechaDesde}`,
            onRemove: () => onFilterChange("fechaDesde", ""),
          });
        }

        if (filters.fechaHasta) {
          chips.push({
            key: "fechaHasta",
            label: `Hasta: ${filters.fechaHasta}`,
            onRemove: () => onFilterChange("fechaHasta", ""),
          });
        }
      }

      if (filters.estado !== DEFAULT_VALUES.estado) {
        chips.push({
          key: "estado",
          label: `Estado: ${filters.estado}`,
          onRemove: () => onFilterChange("estado", DEFAULT_VALUES.estado),
        });
      }

      if (filters.metodoPago !== DEFAULT_VALUES.metodoPago) {
        chips.push({
          key: "metodoPago",
          label: `Pago: ${filters.metodoPago}`,
          onRemove: () =>
            onFilterChange("metodoPago", DEFAULT_VALUES.metodoPago),
        });
      }

      if (filters.categoria !== DEFAULT_VALUES.categoria) {
        chips.push({
          key: "categoria",
          label: `Categoria: ${filters.categoria}`,
          onRemove: () => onFilterChange("categoria", DEFAULT_VALUES.categoria),
        });
      }

      return chips;
    }, [activeDateRange, filters, onClearDateRange, onFilterChange]);

    const quickRanges = (
      <div>
        <label
          id="rangos-rapidos-label"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 sm:gap-2 sm:text-sm"
        >
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
          Rangos Rapidos
        </label>
        <div
          role="group"
          aria-labelledby="rangos-rapidos-label"
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:flex xl:flex-wrap"
        >
          {DATE_RANGES.map((range) => {
            const isSelected = activeDateRange === range.key;

            return (
              <motion.button
                key={range.key}
                onClick={() => onDateRangeChange(range.key)}
                className={`
                  min-h-11 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
                  sm:px-4 sm:text-sm
                  ${
                    isSelected
                      ? "bg-linear-to-r from-green-600 to-emerald-500 text-white shadow-sm"
                      : "bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200"
                  }
                `}
                aria-label={`Seleccionar rango de ${range.label.toLowerCase()}`}
                aria-pressed={isSelected}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {range.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    );

    const criticalFiltersRow = (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <div>
          <label
            htmlFor="fecha-desde"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm"
          >
            <CalendarDays className="w-3.5 h-3.5 text-green-600 sm:w-4 sm:h-4" />
            <span>Fecha Desde</span>
          </label>
          <div className="relative">
            <input
              id="fecha-desde"
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => onFilterChange("fechaDesde", e.target.value)}
              className="
                w-full min-h-11 px-3 py-2 pl-10 rounded-lg text-sm
                border-2 border-gray-200 bg-white text-gray-900
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

        <div>
          <label
            htmlFor="fecha-hasta"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm"
          >
            <CalendarDays className="w-3.5 h-3.5 text-green-600 sm:w-4 sm:h-4" />
            <span>Fecha Hasta</span>
          </label>
          <div className="relative">
            <input
              id="fecha-hasta"
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => onFilterChange("fechaHasta", e.target.value)}
              className="
                w-full min-h-11 px-3 py-2 pl-10 rounded-lg text-sm
                border-2 border-gray-200 bg-white text-gray-900
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

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm">
          </label>
          <div className="[&>label]:hidden">
            <CustomSelect
              id="estado-filter"
              label="Estado"
              value={filters.estado}
              onChange={(value) => onFilterChange("estado", value)}
              options={opcionesEstado}
            />
          </div>
        </div>
      </div>
    );

    const advancedFilters = (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <CustomSelect
            id="metodo-pago-filter"
            label="Metodo de Pago"
            value={filters.metodoPago}
            onChange={(value) => onFilterChange("metodoPago", value)}
            options={opcionesMetodoPago}
          />
        </div>

        <div>
          <CustomSelect
            id="categoria-filter"
            label="Categoria"
            value={filters.categoria}
            onChange={(value) => onFilterChange("categoria", value)}
            options={opcionesCategoria}
          />
        </div>
      </div>
    );

    const fixedFiltersBody = (
      <div className="px-3 pb-3 sm:px-5 sm:pb-4 lg:px-6 lg:pb-5 space-y-3 sm:space-y-4">
        {activeChips.length > 0 && (
          <div
            className="pt-2 flex flex-wrap gap-2"
            aria-label="Filtros activos"
          >
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-800 hover:bg-green-100 transition-colors cursor-pointer"
                aria-label={`Quitar filtro ${chip.label}`}
              >
                <span>{chip.label}</span>
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        <div className="sticky top-[72px] sm:top-[84px] lg:top-[92px] z-10 rounded-xl border border-gray-100 bg-white/95 backdrop-blur px-3 py-3 sm:px-4 sm:py-3.5">
          {criticalFiltersRow}
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3 sm:p-4">
          <button
            type="button"
            onClick={() => setAdvancedOpen((prev) => !prev)}
            className="w-full lg:hidden flex items-center justify-between text-left cursor-pointer"
            aria-expanded={advancedOpen}
            aria-controls="filtros-avanzados"
          >
            <span className="text-sm sm:text-base font-bold text-gray-800">
              Filtros Avanzados
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${advancedOpen ? "rotate-180" : "rotate-0"}`}
              aria-hidden="true"
            />
          </button>

          <div className="hidden lg:block mt-3 space-y-3 sm:space-y-4">
            {quickRanges}
            {advancedFilters}
          </div>

          <AnimatePresence initial={false}>
            {advancedOpen && (
              <motion.div
                id="filtros-avanzados"
                variants={collapseVariants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{ overflow: "hidden" }}
                className="lg:hidden mt-3 space-y-3 sm:space-y-4"
              >
                {quickRanges}
                {advancedFilters}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <motion.button
            onClick={onClear}
            className="
              min-h-11 inline-flex items-center gap-2 px-4 py-2
              bg-green-100 text-green-700 font-medium text-sm rounded-lg
              hover:bg-green-200 active:bg-green-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
              transition-colors cursor-pointer sm:rounded-xl
            "
            aria-label="Limpiar todos los filtros aplicados"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            <span>Limpiar Filtros</span>
          </motion.button>

          <button
            onClick={onOpenInfo}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:rounded-xl"
            aria-label="Ver informacion adicional sobre los reportes"
          >
            <Info className="w-4 h-4" aria-hidden="true" />
            Mas info
          </button>
        </div>
      </div>
    );

    const collapsibleBody = (
      <div className="px-3 pb-4 space-y-4 pt-2 sm:px-5 sm:pb-5 sm:space-y-5 lg:px-6 lg:pb-6 lg:space-y-6">
        {quickRanges}
        {criticalFiltersRow}
        {advancedFilters}
        <div className="flex items-center justify-between gap-2 pt-1">
          <motion.button
            onClick={onClear}
            className="
              min-h-11 inline-flex items-center gap-2 px-4 py-2
              bg-green-100 text-green-700 font-medium text-sm rounded-lg
              hover:bg-green-200 active:bg-green-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
              transition-colors cursor-pointer sm:rounded-xl
            "
            aria-label="Limpiar todos los filtros aplicados"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            <span>Limpiar Filtros</span>
          </motion.button>

          <button
            onClick={onOpenInfo}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:rounded-xl"
            aria-label="Ver informacion adicional sobre los reportes"
          >
            <Info className="w-4 h-4" aria-hidden="true" />
            Mas info
          </button>
        </div>
      </div>
    );

    return (
      <section
        aria-labelledby="filtros-heading"
        className="mb-2.5 sm:mb-3 lg:mb-4"
      >
        <div
          className={`bg-white rounded-lg shadow-lg sm:rounded-xl lg:rounded-2xl ${
            fixed ? "overflow-visible" : "overflow-hidden"
          }`}
        >
          {fixed ? (
            <div className="sticky top-0 z-20 rounded-t-lg sm:rounded-t-xl lg:rounded-t-2xl border-b border-green-100 bg-white/95 backdrop-blur mb-4">
              <div className="w-full px-3 py-3.5 flex items-center justify-between bg-linear-to-r from-green-50 to-emerald-100 sm:px-5 sm:py-4 lg:px-6 lg:py-5">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-1.5 bg-green-100 rounded-lg sm:p-2">
                    <Filter
                      className="w-4 h-4 text-green-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:gap-3">
                    <h2
                      id="filtros-heading"
                      className="text-base font-bold text-gray-900 sm:text-lg lg:text-xl"
                    >
                      Filtros de Busqueda
                    </h2>
                    <AnimatePresence mode="wait">
                      {hasActiveFilters && (
                        <motion.span
                          className="px-2 py-0.5 text-xs font-bold bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-sm sm:px-2.5 sm:py-1 sm:text-xs"
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
              </div>
            </div>
          ) : (
            <motion.button
              onClick={onToggle}
              className="w-full px-3 py-3.5 flex items-center justify-between bg-linear-to-r from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset cursor-pointer group sm:px-5 sm:py-4 lg:px-6 lg:py-5"
              aria-expanded={isOpen}
              aria-controls="filtros-content"
              aria-label={
                isOpen
                  ? "Ocultar filtros de busqueda"
                  : "Mostrar filtros de busqueda"
              }
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <motion.div
                  className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors sm:p-2"
                  whileHover={{ rotate: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Filter
                    className="w-4 h-4 text-green-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                    aria-hidden="true"
                  />
                </motion.div>

                <div className="flex items-center gap-2 flex-wrap sm:gap-3">
                  <h2
                    id="filtros-heading"
                    className="text-base font-bold text-gray-900 sm:text-lg lg:text-xl"
                  >
                    Filtros de Busqueda
                  </h2>

                  <AnimatePresence mode="wait">
                    {hasActiveFilters && (
                      <motion.span
                        className="px-2 py-0.5 text-xs font-bold bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-sm sm:px-2.5 sm:py-1 sm:text-xs"
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

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="text-xs font-medium text-green-600 hidden sm:inline lg:text-sm">
                  {isOpen ? "Ocultar" : "Mostrar"}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronDown
                    className="w-4 h-4 text-green-600 sm:w-5 sm:h-5"
                    aria-hidden="true"
                  />
                </motion.div>
              </div>
            </motion.button>
          )}

          {fixed ? (
            <div
              id="filtros-content"
              role="region"
              aria-labelledby="filtros-heading"
            >
              {fixedFiltersBody}
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {panelOpen && (
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
                  {collapsibleBody}
                </motion.div>
              )}
            </AnimatePresence>
          )}
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
  activeDateRange: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  onDateRangeChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearDateRange: PropTypes.func,
  onClear: PropTypes.func.isRequired,
  onOpenInfo: PropTypes.func,
  fixed: PropTypes.bool,
};

ReportFilters.defaultProps = {
  activeDateRange: null,
  onClearDateRange: () => {},
  onOpenInfo: () => {},
  fixed: false,
};

export default ReportFilters;
