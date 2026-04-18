import PropTypes from "prop-types";
import { X } from "lucide-react";

export function ActiveFilterChips({ chips }) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pt-1" aria-label="Filtros activos">
      {chips.map((chip) => (
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
  );
}

ActiveFilterChips.propTypes = {
  chips: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onRemove: PropTypes.func.isRequired,
    }),
  ).isRequired,
};
