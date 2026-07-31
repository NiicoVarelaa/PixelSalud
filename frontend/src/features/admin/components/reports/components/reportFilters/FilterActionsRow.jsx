import PropTypes from "prop-types";
import { Info, X } from "lucide-react";

export function FilterActionsRow({ onClear, onOpenInfo }) {
  return (
    <div className="flex items-center justify-between gap-2 pt-1">
      <button
        type="button"
        onClick={onClear}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        aria-label="Limpiar todos los filtros aplicados"
      >
        <X size={13} aria-hidden="true" />
        Limpiar filtros
      </button>

      <button
        type="button"
        onClick={onOpenInfo}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        aria-label="Ver información sobre los reportes"
      >
        <Info size={13} aria-hidden="true" />
        Más info
      </button>
    </div>
  );
}

FilterActionsRow.propTypes = {
  onClear: PropTypes.func.isRequired,
  onOpenInfo: PropTypes.func.isRequired,
};
