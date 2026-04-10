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
  SlidersHorizontal,
} from "lucide-react";
import CustomSelect from "../../products/components/CustomSelect";
import { DATE_RANGES } from "../constants/reportData";
import { buttonVariants, collapseVariants } from "../utils/animations";

const DEFAULT_VALUES = {
  estado: "Todos",
  metodoPago: "Todos",
  categoria: "Todas",
};

const rangeLabelByKey = DATE_RANGES.reduce((acc, r) => {
  acc[r.key] = r.label;
  return acc;
}, {});

/* ── Input de fecha reutilizable ── */
const DateInput = ({ id, label, value, onChange, descId }) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-600"
    >
      <CalendarDays size={13} className="text-green-600" aria-hidden="true" />
      {label}
    </label>
    <div className="relative">
      <Calendar
        size={13}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 pl-8.5 pr-3 text-sm text-gray-900 transition-colors hover:border-gray-300 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
        aria-describedby={descId}
      />
    </div>
    <span id={descId} className="sr-only">
      {label === "Desde" ? "Fecha inicial del rango" : "Fecha final del rango"}
    </span>
  </div>
);

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
        { value: "Todos", label: "Todos los estados" },
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
        { value: "Todos", label: "Todos los métodos" },
        { value: "Efectivo", label: "Efectivo" },
        { value: "Tarjeta", label: "Tarjeta" },
        { value: "Transferencia", label: "Transferencia" },
        { value: "Mercado Pago", label: "Mercado Pago" },
      ],
      [],
    );

    const opcionesCategoria = useMemo(
      () => [
        { value: "Todas", label: "Todas las categorías" },
        { value: "Fragancias", label: "Fragancias" },
        { value: "Belleza", label: "Belleza" },
        { value: "Dermocosmética", label: "Dermocosmética" },
        { value: "Medicamentos con Receta", label: "Medicamentos con Receta" },
        {
          value: "Medicamentos Venta Libre",
          label: "Medicamentos Venta Libre",
        },
        { value: "Cuidado Personal", label: "Cuidado Personal" },
        { value: "Bebes y Niños", label: "Bebés y Niños" },
      ],
      [],
    );

    /* ── Active chips ── */
    const activeChips = useMemo(() => {
      const chips = [];
      if (activeDateRange) {
        chips.push({
          key: "dateRange",
          label: `Rango: ${rangeLabelByKey[activeDateRange] || activeDateRange}`,
          onRemove: onClearDateRange,
        });
      } else {
        if (filters.fechaDesde)
          chips.push({
            key: "fechaDesde",
            label: `Desde: ${filters.fechaDesde}`,
            onRemove: () => onFilterChange("fechaDesde", ""),
          });
        if (filters.fechaHasta)
          chips.push({
            key: "fechaHasta",
            label: `Hasta: ${filters.fechaHasta}`,
            onRemove: () => onFilterChange("fechaHasta", ""),
          });
      }
      if (filters.estado !== DEFAULT_VALUES.estado)
        chips.push({
          key: "estado",
          label: `Estado: ${filters.estado}`,
          onRemove: () => onFilterChange("estado", DEFAULT_VALUES.estado),
        });
      if (filters.metodoPago !== DEFAULT_VALUES.metodoPago)
        chips.push({
          key: "metodoPago",
          label: `Pago: ${filters.metodoPago}`,
          onRemove: () =>
            onFilterChange("metodoPago", DEFAULT_VALUES.metodoPago),
        });
      if (filters.categoria !== DEFAULT_VALUES.categoria)
        chips.push({
          key: "categoria",
          label: `Categoría: ${filters.categoria}`,
          onRemove: () => onFilterChange("categoria", DEFAULT_VALUES.categoria),
        });
      return chips;
    }, [activeDateRange, filters, onClearDateRange, onFilterChange]);

    /* ── Rangos rápidos ── */
    const quickRanges = (
      <div>
        <p
          id="rangos-label"
          className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-600"
        >
          <Calendar size={13} aria-hidden="true" />
          Rangos rápidos
        </p>
        <div
          role="group"
          aria-labelledby="rangos-label"
          className="flex flex-wrap gap-1.5"
        >
          {DATE_RANGES.map((range) => {
            const isSelected = activeDateRange === range.key;
            return (
              <button
                key={range.key}
                type="button"
                onClick={() => onDateRangeChange(range.key)}
                className={`h-8 rounded-lg px-3 text-xs font-semibold transition-all active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 ${
                  isSelected
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
                aria-label={`Rango: ${range.label}`}
                aria-pressed={isSelected}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>
    );

    /* ── Filtros de fecha + estado ── */
    const criticalFiltersRow = (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DateInput
          id="fecha-desde"
          label="Desde"
          value={filters.fechaDesde}
          onChange={(v) => onFilterChange("fechaDesde", v)}
          descId="fecha-desde-desc"
        />
        <DateInput
          id="fecha-hasta"
          label="Hasta"
          value={filters.fechaHasta}
          onChange={(v) => onFilterChange("fechaHasta", v)}
          descId="fecha-hasta-desc"
        />
        <div className="[&>label]:hidden">
          <label className="mb-1.5 block text-xs font-semibold text-gray-600">
            Estado
          </label>
          <div className="[&>label]:hidden [&>div]:!rounded-lg [&>div]:!min-h-9 [&>div]:!border [&>div]:!border-gray-200 [&>div]:!bg-gray-50 [&>div]:focus-within:!border-green-500 [&>div]:focus-within:!ring-2 [&>div]:focus-within:!ring-green-100">
            <CustomSelect
              id="estado-filter"
              label="Estado"
              value={filters.estado}
              onChange={(v) => onFilterChange("estado", v)}
              options={opcionesEstado}
            />
          </div>
        </div>
      </div>
    );

    /* ── Filtros avanzados ── */
    const advancedFilters = (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="[&>div]:!rounded-lg [&>div]:!min-h-9 [&>div]:!border [&>div]:!border-gray-200 [&>div]:!bg-gray-50 [&>div]:focus-within:!border-green-500 [&>div]:focus-within:!ring-2 [&>div]:focus-within:!ring-green-100">
          <CustomSelect
            id="metodo-pago-filter"
            label="Método de pago"
            value={filters.metodoPago}
            onChange={(v) => onFilterChange("metodoPago", v)}
            options={opcionesMetodoPago}
          />
        </div>
        <div className="[&>div]:!rounded-lg [&>div]:!min-h-9 [&>div]:!border [&>div]:!border-gray-200 [&>div]:!bg-gray-50 [&>div]:focus-within:!border-green-500 [&>div]:focus-within:!ring-2 [&>div]:focus-within:!ring-green-100">
          <CustomSelect
            id="categoria-filter"
            label="Categoría"
            value={filters.categoria}
            onChange={(v) => onFilterChange("categoria", v)}
            options={opcionesCategoria}
          />
        </div>
      </div>
    );

    /* ── Footer de acciones ── */
    const actionsRow = (
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          aria-label="Limpiar todos los filtros aplicados"
        >
          <X size={13} aria-hidden="true" />
          Limpiar filtros
        </button>

        <button
          type="button"
          onClick={onOpenInfo}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          aria-label="Ver información sobre los reportes"
        >
          <Info size={13} aria-hidden="true" />
          Más info
        </button>
      </div>
    );

    /* ── Cuerpo del panel (modo fixed) ── */
    const fixedFiltersBody = (
      <div className="space-y-3 px-4 pb-4 sm:px-5 sm:pb-5">
        {/* Chips de filtros activos */}
        {activeChips.length > 0 && (
          <div
            className="flex flex-wrap gap-1.5 pt-1"
            aria-label="Filtros activos"
          >
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-800 hover:bg-green-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label={`Quitar filtro: ${chip.label}`}
              >
                {chip.label}
                <X size={11} aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        {/* Fechas + estado (siempre visibles) */}
        <div className="rounded-xl border border-gray-100 bg-white p-3 sm:p-4">
          {criticalFiltersRow}
        </div>

        {/* Filtros avanzados (colapsable en mobile) */}
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-3 sm:px-4">
          <button
            type="button"
            onClick={() => setAdvancedOpen((p) => !p)}
            className="flex w-full items-center justify-between text-left cursor-pointer lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
            aria-expanded={advancedOpen}
            aria-controls="filtros-avanzados"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <SlidersHorizontal size={13} aria-hidden="true" />
              Filtros avanzados
            </span>
            <motion.div
              animate={{ rotate: advancedOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown
                size={14}
                className="text-gray-400"
                aria-hidden="true"
              />
            </motion.div>
          </button>

          {/* Desktop: siempre visible */}
          <div className="hidden lg:block mt-3 space-y-3">
            {quickRanges}
            {advancedFilters}
          </div>

          {/* Mobile: colapsable */}
          <AnimatePresence initial={false}>
            {advancedOpen && (
              <motion.div
                id="filtros-avanzados"
                variants={collapseVariants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{ overflow: "hidden" }}
                className="lg:hidden mt-3 space-y-3"
              >
                {quickRanges}
                {advancedFilters}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {actionsRow}
      </div>
    );

    /* ── Cuerpo del panel (modo colapsable) ── */
    const collapsibleBody = (
      <div className="space-y-3 px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
        {quickRanges}
        {criticalFiltersRow}
        {advancedFilters}
        {actionsRow}
      </div>
    );

    return (
      <section aria-labelledby="filtros-heading">
        <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
          {/* Header */}
          {fixed ? (
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100"
                  aria-hidden="true"
                >
                  <Filter size={14} className="text-green-600" />
                </div>
                <h2
                  id="filtros-heading"
                  className="text-sm font-semibold text-gray-900"
                >
                  Filtros
                </h2>
                <AnimatePresence mode="wait">
                  {hasActiveFilters && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {activeFiltersCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onToggle}
              className="flex w-full items-center justify-between px-4 py-3 sm:px-5 hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset"
              aria-expanded={isOpen}
              aria-controls="filtros-content"
              aria-label={isOpen ? "Ocultar filtros" : "Mostrar filtros"}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100"
                  aria-hidden="true"
                >
                  <Filter size={14} className="text-green-600" />
                </div>
                <h2
                  id="filtros-heading"
                  className="text-sm font-semibold text-gray-900"
                >
                  Filtros
                </h2>
                <AnimatePresence mode="wait">
                  {hasActiveFilters && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white"
                      aria-live="polite"
                    >
                      {activeFiltersCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown
                  size={15}
                  className="text-gray-400"
                  aria-hidden="true"
                />
              </motion.div>
            </button>
          )}

          {/* Body */}
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
