import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import {
  ESTADO_OPTIONS,
  normalizeEstado,
} from "./utils/ventasOnlineTable.utils";

export const EstadoInlineSelect = ({ value, onChange, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0, width: 180 });

  const selectedOption = useMemo(() => {
    return (
      ESTADO_OPTIONS.find((opt) => opt.value === normalizeEstado(value)) ||
      ESTADO_OPTIONS[0]
    );
  }, [value]);

  const handleSelect = useCallback(
    (nextValue) => {
      onChange(nextValue);
      setIsOpen(false);
    },
    [onChange],
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const updateMenuPosition = () => {
      if (!selectRef.current) {
        return;
      }

      const rect = selectRef.current.getBoundingClientRect();
      const width = compact ? Math.max(rect.width, 160) : rect.width;
      const left = compact ? rect.right - width : rect.left;

      setMenuStyle({
        top: rect.bottom + 8,
        left,
        width,
      });
    };

    updateMenuPosition();

    const handleClickOutside = (event) => {
      const clickInsideTrigger =
        selectRef.current && selectRef.current.contains(event.target);
      const clickInsideMenu =
        menuRef.current && menuRef.current.contains(event.target);

      if (!clickInsideTrigger && !clickInsideMenu) {
        setIsOpen(false);
      }
    };

    const handleViewportChange = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen, compact]);

  const triggerClassName = compact
    ? "h-9 px-4 rounded-full text-xs"
    : "h-10 px-4 rounded-xl text-sm";

  const menu = (
    <ul
      ref={menuRef}
      role="listbox"
      className="fixed z-1200 bg-white border border-gray-100 rounded-xl shadow-xl"
      style={{
        top: `${menuStyle.top}px`,
        left: `${menuStyle.left}px`,
        width: `${menuStyle.width}px`,
      }}
    >
      {ESTADO_OPTIONS.map((opt) => {
        const isSelected = normalizeEstado(value) === opt.value;

        return (
          <li
            key={opt.value}
            role="option"
            aria-selected={isSelected}
            onClick={() => handleSelect(opt.value)}
            className={`
              flex items-center justify-between rounded-xl px-4 py-2.5 text-sm cursor-pointer transition-colors
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
  );

  return (
    <div
      ref={selectRef}
      className={compact ? "relative inline-block" : "relative w-full"}
    >
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          w-full ${triggerClassName}
          inline-flex items-center justify-center gap-1.5
          border border-gray-200 bg-white text-gray-700 font-semibold
          cursor-pointer transition-all duration-200 ease-in-out outline-none
          hover:border-gray-300
          focus:ring focus:ring-primary-600 focus:border-primary-600
        `}
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary-600" : ""}`}
        />
      </button>

      {isOpen ? createPortal(menu, document.body) : null}
    </div>
  );
};