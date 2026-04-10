import { useState, useMemo } from "react";

export const useMensajesFilters = (mensajes, itemsPorPagina = 8) => {
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const mensajesFiltrados = useMemo(() => {
    return mensajes.filter((m) => {
      // Filtro por estado
      if (filtroEstado !== "todos" && m.estado !== filtroEstado) return false;

      // Filtro por búsqueda
      if (busqueda) {
        const searchLower = busqueda.toLowerCase();
        return (
          m.nombre?.toLowerCase().includes(searchLower) ||
          m.email?.toLowerCase().includes(searchLower) ||
          m.asunto?.toLowerCase().includes(searchLower) ||
          m.mensaje?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [mensajes, filtroEstado, busqueda]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(mensajesFiltrados.length / itemsPorPagina),
  );
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const mensajesPaginados = mensajesFiltrados.slice(
    indiceInicio,
    indiceInicio + itemsPorPagina,
  );

  const limpiarFiltros = () => {
    setFiltroEstado("todos");
    setBusqueda("");
    setPaginaActual(1);
  };

  const handleFiltroEstadoChange = (valor) => {
    setFiltroEstado(valor);
    setPaginaActual(1);
  };

  const handleBusquedaChange = (valor) => {
    setBusqueda(valor);
    setPaginaActual(1);
  };

  const handleCambiarPagina = (pagina) => {
    const paginaSegura = Math.min(Math.max(1, pagina), totalPaginas);
    setPaginaActual(paginaSegura);
  };

  return {
    filtroEstado,
    setFiltroEstado: handleFiltroEstadoChange,
    busqueda,
    setBusqueda: handleBusquedaChange,
    mensajesFiltrados,
    mensajesPaginados,
    paginaActual,
    totalPaginas,
    handleCambiarPagina,
    indiceInicio,
    itemsPorPagina,
    limpiarFiltros,
  };
};
