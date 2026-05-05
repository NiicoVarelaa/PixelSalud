import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { DayPicker } from "react-day-picker";
import { Calendar } from "lucide-react";
import { es } from "date-fns/locale";
import { format, getYear, isValid, parseISO } from "date-fns";
import "react-day-picker/dist/style.css";

const baseButtonClassName =
  "flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm transition-colors focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100";

export const DatePickerDay = ({
  id,
  label,
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  disabled = false,
  required = false,
  minDate,
  maxDate,
  hideLabel = false,
  labelClassName = "",
  buttonClassName = "",
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedDate = useMemo(() => {
    if (!value) return undefined;
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  const displayValue = useMemo(() => {
    if (!selectedDate) return "";
    return format(selectedDate, "dd/MM/yyyy");
  }, [selectedDate]);

  const handleSelect = useCallback(
    (date) => {
      if (!date) {
        onChange("");
        return;
      }
      onChange(format(date, "yyyy-MM-dd"));
      setIsOpen(false);
    },
    [onChange],
  );

  const toYear = useMemo(() => getYear(maxDate || new Date()) + 5, [maxDate]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  }, [disabled]);

  const handleClickOutside = useCallback((event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  const handleKeyDown = (event) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label && (
        <label
          htmlFor={id}
          className={`${
            hideLabel
              ? "sr-only"
              : "mb-1.5 block text-xs font-semibold text-gray-600"
          } ${labelClassName}`}
        >
          {label}
          {required && (
            <span className="ml-0.5 text-red-400" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <button
        id={id}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={ariaLabel || label}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`${baseButtonClassName} ${buttonClassName}`}
      >
        <span
          className={
            displayValue ? "text-gray-900" : "text-gray-400 font-normal"
          }
        >
          {displayValue || placeholder}
        </span>
        <Calendar size={16} className="text-gray-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            locale={es}
            fromDate={minDate}
            toDate={maxDate}
            weekStartsOn={1}
            captionLayout="dropdown"
            fromYear={2000}
            toYear={toYear}
            style={{
              "--rdp-accent-color": "#16a34a",
              "--rdp-background-color": "#dcfce7",
              "--rdp-outline": "2px solid #22c55e",
              "--rdp-outline-selected": "2px solid #22c55e",
            }}
            classNames={{
              months: "flex flex-col",
              month: "space-y-2",
              caption: "flex items-center justify-between gap-2 px-1",
              caption_label: "hidden",
              dropdowns: "flex items-center gap-2",
              dropdown:
                "rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 capitalize focus:outline-none focus:ring-2 focus:ring-green-500",
              nav: "flex items-center gap-2",
              nav_button:
                "h-8 w-8 rounded-lg border border-gray-200 text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500",
              nav_button_previous: "",
              nav_button_next: "",
              table: "w-full border-collapse space-y-1",
              head_row: "",
              head_cell:
                "text-[11px] font-semibold text-gray-500 uppercase tracking-wide pb-1",
              row: "",
              cell: "p-0 text-center",
              day: "h-9 w-9 rounded-full text-sm text-gray-800 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500",
              day_selected:
                "bg-green-600 text-white hover:bg-green-600 focus:bg-green-600",
              day_today: "border border-green-500 text-green-700 font-semibold",
              day_outside: "text-gray-300",
              day_disabled: "text-gray-300",
            }}
          />
        </div>
      )}
    </div>
  );
};

DatePickerDay.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  hideLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  ariaLabel: PropTypes.string,
};

DatePickerDay.defaultProps = {
  label: "",
  value: "",
  placeholder: "dd/mm/aaaa",
  disabled: false,
  required: false,
  minDate: undefined,
  maxDate: undefined,
  hideLabel: false,
  labelClassName: "",
  buttonClassName: "",
  ariaLabel: undefined,
};
