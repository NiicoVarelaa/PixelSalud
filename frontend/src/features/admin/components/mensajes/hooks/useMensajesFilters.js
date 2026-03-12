import { useState, useMemo } from "react";

export const useMensajesFilters = (mensajes) => {
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

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

  const limpiarFiltros = () => {
    setFiltroEstado("todos");
    setBusqueda("");
  };

  return {
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    mensajesFiltrados,
    limpiarFiltros,
  };
};
