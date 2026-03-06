import { useState, useMemo, useCallback } from "react";

/**
 * Custom hook para manejar el filtrado de productos
 * @param {Array} productos - Lista de productos a filtrar
 * @returns {Object} Estado y funciones de filtrado
 */
export const useProductFilters = (productos) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Memoizar productos filtrados para evitar recálculos innecesarios
  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideBusqueda = producto.nombreProducto
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideCategoria =
        filtroCategoria === "todas" || producto.categoria === filtroCategoria;

      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activos" && producto.activo) ||
        (filtroEstado === "inactivos" && !producto.activo);

      return coincideBusqueda && coincideCategoria && coincideEstado;
    });
  }, [productos, busqueda, filtroCategoria, filtroEstado]);

  // Callbacks memoizados para evitar re-renders en componentes hijos
  const handleBusquedaChange = useCallback((value) => {
    setBusqueda(value);
  }, []);

  const handleCategoriaChange = useCallback((value) => {
    setFiltroCategoria(value);
  }, []);

  const handleEstadoChange = useCallback((value) => {
    setFiltroEstado(value);
  }, []);

  const resetFilters = useCallback(() => {
    setBusqueda("");
    setFiltroCategoria("todas");
    setFiltroEstado("todos");
  }, []);

  return {
    busqueda,
    filtroCategoria,
    filtroEstado,
    productosFiltrados,
    handleBusquedaChange,
    handleCategoriaChange,
    handleEstadoChange,
    resetFilters,
  };
};
