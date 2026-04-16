import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Tags } from "lucide-react";

const ContactoTipoConsultaField = ({
  value,
  onChange,
  options,
  showLoginWarning,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) || options[0],
    [options, value],
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelectOption = (nextValue) => {
    onChange({
      target: {
        name: "tipoConsulta",
        value: nextValue,
      },
    });
    setIsOpen(false);
  };

  return (
    <fieldset className="space-y-1.5">
      <label
        htmlFor="tipoConsulta"
        className="block text-sm font-medium text-slate-700"
      >
        Tipo de consulta
      </label>

      <div className="relative" ref={dropdownRef}>
        <input
          type="hidden"
          id="tipoConsulta"
          name="tipoConsulta"
          value={value}
        />

        <button
          type="button"
          className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-300 bg-white pl-3 pr-3 text-left text-sm text-slate-900 outline-none transition hover:border-slate-400 focus-visible:border-primary-700 focus-visible:ring-2 focus-visible:ring-primary-700/50 cursor-pointer"
          aria-label="Seleccionar tipo de consulta"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Tags className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="min-w-0 flex-1 truncate">
            {selectedOption?.label}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <ul
              className="max-h-60 overflow-auto py-1"
              role="listbox"
              aria-label="Tipos de consulta"
            >
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-sm transition cursor-pointer ${
                        isSelected
                          ? "bg-primary-50 text-primary-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                      onClick={() => handleSelectOption(option.value)}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {showLoginWarning && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Para consultas de pedido o receta, necesitas iniciar sesión.
        </p>
      )}
    </fieldset>
  );
};

export default ContactoTipoConsultaField;
