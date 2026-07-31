import { useMemo } from "react";
import { DEFAULT_VALUES, RANGE_LABEL_BY_KEY } from "../constants/constants";

export const useActiveFilterChips = ({
  activeDateRange,
  filters,
  onFilterChange,
}) => {
  return useMemo(() => {
    const chips = [];

    if (!activeDateRange) {
      if (filters.fechaDesde) {
        chips.push({
          key: "fechaDesde",
          label: `Desde: ${filters.fechaDesde}`,
          onRemove: () => onFilterChange("fechaDesde", ""),
        });
      }

      if (filters.fechaHasta) {
        chips.push({
          key: "fechaHasta",
          label: `Hasta: ${filters.fechaHasta}`,
          onRemove: () => onFilterChange("fechaHasta", ""),
        });
      }
    }

    if (filters.estado !== DEFAULT_VALUES.estado) {
      chips.push({
        key: "estado",
        label: `Estado: ${filters.estado}`,
        onRemove: () => onFilterChange("estado", DEFAULT_VALUES.estado),
      });
    }

    if (filters.metodoPago !== DEFAULT_VALUES.metodoPago) {
      chips.push({
        key: "metodoPago",
        label: `Pago: ${filters.metodoPago}`,
        onRemove: () => onFilterChange("metodoPago", DEFAULT_VALUES.metodoPago),
      });
    }

    if (filters.categoria !== DEFAULT_VALUES.categoria) {
      chips.push({
        key: "categoria",
        label: `Categoría: ${filters.categoria}`,
        onRemove: () => onFilterChange("categoria", DEFAULT_VALUES.categoria),
      });
    }

    return chips;
  }, [activeDateRange, filters, onFilterChange]);
};
