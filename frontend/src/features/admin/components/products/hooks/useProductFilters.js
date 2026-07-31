import { useState, useMemo, useCallback } from "react";

export const useProductFilters = (productos) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todos");

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
