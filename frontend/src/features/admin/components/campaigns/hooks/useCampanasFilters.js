import { useMemo } from "react";

export const useCampanasFilters = ({
  campanas,
  busqueda,
  filtroEstado,
  filtroTipo,
  paginaActual,
  itemsPorPagina,
}) => {
  const campanasFiltradas = useMemo(() => {
    return campanas.filter((campana) => {
      const matchBusqueda = campana.nombreCampana
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const matchEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activas" && campana.esActiva) ||
        (filtroEstado === "inactivas" && !campana.esActiva);
      const matchTipo =
        filtroTipo === "todos" || campana.tipo === filtroTipo;
      return matchBusqueda && matchEstado && matchTipo;
    });
  }, [campanas, busqueda, filtroEstado, filtroTipo]);

  const totalPaginas = Math.ceil(campanasFiltradas.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const campanasActuales = campanasFiltradas.slice(indiceInicio, indiceFin);

  return {
    campanasActuales,
    campanasFiltradas,
    totalPaginas,
    indiceInicio,
    indiceFin,
  };
};
