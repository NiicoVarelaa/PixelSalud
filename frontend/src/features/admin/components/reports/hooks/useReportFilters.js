import { useState, useCallback, useMemo } from "react";
import { INITIAL_FILTERS } from "../constants/reportData";

/**
 * Hook personalizado para gestionar filtros de reportes
 * @returns {Object} - Estado y funciones de filtros
 */
export const useReportFilters = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Calcula si hay filtros activos
   */
  const hasActiveFilters = useMemo(() => {
    return (
      filters.fechaDesde ||
      filters.fechaHasta ||
      filters.estado !== "Todos" ||
      filters.metodoPago !== "Todos" ||
      filters.categoria !== "Todas"
    );
  }, [filters]);

  /**
   * Cuenta cuántos filtros están activos
   */
  const activeFiltersCount = useMemo(() => {
    return [
      filters.fechaDesde && "Fecha",
      filters.estado !== "Todos" && "Estado",
      filters.metodoPago !== "Todos" && "Pago",
      filters.categoria !== "Todas" && "Categoría",
    ].filter(Boolean).length;
  }, [filters]);

  /**
   * Establece un rango de fechas predefinido
   */
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
  }, []);

  /**
   * Actualiza un filtro específico
   */
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Limpia todos los filtros
   */
  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  /**
   * Alterna el estado de apertura del panel de filtros
   */
  const toggleFilters = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    filters,
    isOpen,
    hasActiveFilters,
    activeFiltersCount,
    setDateRange,
    updateFilter,
    clearFilters,
    toggleFilters,
  };
};
