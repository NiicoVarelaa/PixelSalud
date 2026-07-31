import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Filter } from "lucide-react";

function ActiveCountBadge({ count, show, withAriaAtomic }) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white"
          aria-live="polite"
          aria-atomic={withAriaAtomic ? "true" : undefined}
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function ReportFiltersHeader({
  activeFiltersCount,
  fixed,
  hasActiveFilters,
  isOpen,
  onToggle,
}) {
  const title = (
    <>
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100"
        aria-hidden="true"
      >
        <Filter size={14} className="text-green-600" />
      </div>
      <h2 id="filtros-heading" className="text-sm font-semibold text-gray-900">
        Filtros
      </h2>
    </>
  );

  if (fixed) {
    return (
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          {title}
          <ActiveCountBadge
            count={activeFiltersCount}
            show={hasActiveFilters}
            withAriaAtomic
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-4 py-3 sm:px-5 hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset"
      aria-expanded={isOpen}
      aria-controls="filtros-content"
      aria-label={isOpen ? "Ocultar filtros" : "Mostrar filtros"}
    >
      <div className="flex items-center gap-2">
        {title}
        <ActiveCountBadge count={activeFiltersCount} show={hasActiveFilters} />
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown size={15} className="text-gray-400" aria-hidden="true" />
      </motion.div>
    </button>
  );
}

ActiveCountBadge.propTypes = {
  count: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  withAriaAtomic: PropTypes.bool,
};

ActiveCountBadge.defaultProps = {
  withAriaAtomic: false,
};

ReportFiltersHeader.propTypes = {
  activeFiltersCount: PropTypes.number.isRequired,
  fixed: PropTypes.bool.isRequired,
  hasActiveFilters: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
