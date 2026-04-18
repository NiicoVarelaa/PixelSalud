import PropTypes from "prop-types";
import { Calendar } from "lucide-react";
import { DATE_RANGES } from "../../constants/reportData";

export function QuickRanges({ activeDateRange, onDateRangeChange }) {
  return (
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
}

QuickRanges.propTypes = {
  activeDateRange: PropTypes.string,
  onDateRangeChange: PropTypes.func.isRequired,
};

QuickRanges.defaultProps = {
  activeDateRange: null,
};
