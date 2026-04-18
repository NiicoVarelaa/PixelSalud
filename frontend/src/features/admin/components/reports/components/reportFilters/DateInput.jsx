import PropTypes from "prop-types";
import { Calendar, CalendarDays } from "lucide-react";

export function DateInput({ descId, id, label, onChange, value }) {
  return (
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
          onChange={(event) => onChange(event.target.value)}
          className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 pl-8.5 pr-3 text-sm text-gray-900 transition-colors hover:border-gray-300 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
          aria-describedby={descId}
        />
      </div>
      <span id={descId} className="sr-only">
        {label === "Desde"
          ? "Fecha inicial del rango"
          : "Fecha final del rango"}
      </span>
    </div>
  );
}

DateInput.propTypes = {
  descId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
