import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { ChevronDown, Check } from "lucide-react";

const CustomSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  hideLabel = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value) || options[0];
  }, [options, value]);

  const handleSelect = useCallback(
    (selectedValue) => {
      onChange(selectedValue);
      setIsOpen(false);
    },
    [onChange],
  );

  const handleClickOutside = useCallback((event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
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

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div ref={selectRef} className="relative w-full">
      <label
        id={`${id}-label`}
        className={`${hideLabel ? "sr-only" : "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1"}`}
      >
        {label}
      </label>

      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-labelledby={`${id}-label`}
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        className={`
          flex items-center justify-between w-full px-4 py-2.5 
          bg-gray-50 border rounded-lg text-sm text-gray-800 
          cursor-pointer transition-all duration-200 ease-in-out outline-none
          hover:border-gray-300
          ${isOpen ? "border-green-500 hover:border-green-500 bg-white ring ring-green-500" : "border-slate-200 hover:border-slate-200 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/15"}
        `}
      >
        <span className="truncate font-medium">{selectedOption.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-green-600" : ""}`}
        />
      </div>

      {isOpen && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute z-[1200] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1.5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`
                  flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors
                  ${
                    isSelected
                      ? "bg-green-50 text-green-700 font-bold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                  }
                `}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

CustomSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  hideLabel: PropTypes.bool,
};

export default React.memo(CustomSelect);
