import { useState, useCallback, useMemo } from "react";
import { INITIAL_FILTERS } from "../constants/reportData";

export const useReportFilters = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDateRange, setActiveDateRange] = useState(null);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.fechaDesde ||
      filters.fechaHasta ||
      filters.estado !== "Todos" ||
      filters.metodoPago !== "Todos" ||
      filters.categoria !== "Todas"
    );
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    return [
      filters.fechaDesde && "Fecha",
      filters.estado !== "Todos" && "Estado",
      filters.metodoPago !== "Todos" && "Pago",
      filters.categoria !== "Todas" && "Categoría",
    ].filter(Boolean).length;
  }, [filters]);

  const setDateRange = useCallback((type) => {
    const today = new Date();
    const desde = new Date();

    const dateRanges = {
      hoy: 0,
      semana: -7,
      mes: { type: "month", value: -1 },
      trimestre: { type: "month", value: -3 },
      año: { type: "year", value: -1 },
    };

    const range = dateRanges[type];

    if (typeof range === "number") {
      desde.setDate(today.getDate() + range);
    } else if (range?.type === "month") {
      desde.setMonth(today.getMonth() + range.value);
    } else if (range?.type === "year") {
      desde.setFullYear(today.getFullYear() + range.value);
    }

    setFilters((prev) => ({
      ...prev,
      fechaDesde: desde.toISOString().split("T")[0],
      fechaHasta: today.toISOString().split("T")[0],
    }));

    setActiveDateRange(type);
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    if (key === "fechaDesde" || key === "fechaHasta") {
      setActiveDateRange(null);
    }
  }, []);

  const clearDateRange = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      fechaDesde: "",
      fechaHasta: "",
    }));
    setActiveDateRange(null);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setActiveDateRange(null);
  }, []);

  const toggleFilters = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    activeDateRange,
    activeFiltersCount,
    filters,
    hasActiveFilters,
    isOpen,
    clearDateRange,
    clearFilters,
    setDateRange,
    toggleFilters,
    updateFilter,
  };
};
