import { memo, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { collapseVariants } from "../utils/animations";
import { ActiveFilterChips } from "./reportFilters/ActiveFilterChips";
import { FilterActionsRow } from "./reportFilters/FilterActionsRow";
import {
  AdvancedFiltersRow,
  CriticalFiltersRow,
} from "./reportFilters/FilterFields";
import { QuickRanges } from "./reportFilters/QuickRanges";
import { ReportFiltersHeader } from "./reportFilters/ReportFiltersHeader";
import {
  OPCIONES_CATEGORIA,
  OPCIONES_ESTADO,
  OPCIONES_METODO_PAGO,
} from "../constants/constants";
import { useActiveFilterChips } from "../hooks";

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

    const activeChips = useActiveFilterChips({
      activeDateRange,
      filters,
      onClearDateRange,
      onFilterChange,
    });

    const fixedFiltersBody = (
      <div className="space-y-3 pt-3 px-4 pb-4 sm:px-5 sm:pb-5">
        <ActiveFilterChips chips={activeChips} />
        <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-4">
          <CriticalFiltersRow
            filters={filters}
            onFilterChange={onFilterChange}
            opcionesEstado={OPCIONES_ESTADO}
          />
        </div>

        <div className="rounded-xl border border-gray-100 px-3 py-3 sm:px-4">
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

          <div className="hidden lg:block mt-3 space-y-3">
            <QuickRanges
              activeDateRange={activeDateRange}
              onDateRangeChange={onDateRangeChange}
            />
            <AdvancedFiltersRow
              filters={filters}
              onFilterChange={onFilterChange}
              opcionesCategoria={OPCIONES_CATEGORIA}
              opcionesMetodoPago={OPCIONES_METODO_PAGO}
            />
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
                className="lg:hidden mt-3 space-y-3"
              >
                <QuickRanges
                  activeDateRange={activeDateRange}
                  onDateRangeChange={onDateRangeChange}
                />
                <AdvancedFiltersRow
                  filters={filters}
                  onFilterChange={onFilterChange}
                  opcionesCategoria={OPCIONES_CATEGORIA}
                  opcionesMetodoPago={OPCIONES_METODO_PAGO}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <FilterActionsRow onClear={onClear} onOpenInfo={onOpenInfo} />
      </div>
    );

    const collapsibleBody = (
      <div className="space-y-3 px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
        <QuickRanges
          activeDateRange={activeDateRange}
          onDateRangeChange={onDateRangeChange}
        />
        <CriticalFiltersRow
          filters={filters}
          onFilterChange={onFilterChange}
          opcionesEstado={OPCIONES_ESTADO}
        />
        <AdvancedFiltersRow
          filters={filters}
          onFilterChange={onFilterChange}
          opcionesCategoria={OPCIONES_CATEGORIA}
          opcionesMetodoPago={OPCIONES_METODO_PAGO}
        />
        <FilterActionsRow onClear={onClear} onOpenInfo={onOpenInfo} />
      </div>
    );

    return (
      <section aria-labelledby="filtros-heading">
        <div className="rounded-xl border border-gray-100 bg-white">
          <ReportFiltersHeader
            activeFiltersCount={activeFiltersCount}
            fixed={fixed}
            hasActiveFilters={hasActiveFilters}
            isOpen={isOpen}
            onToggle={onToggle}
          />

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
