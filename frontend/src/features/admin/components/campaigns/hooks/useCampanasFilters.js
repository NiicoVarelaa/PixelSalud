import { useMemo } from "react";

export const useCampanasFilters = ({
  campanas,
  busqueda,
  filtroEstado,
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
      return matchBusqueda && matchEstado;
    });
  }, [campanas, busqueda, filtroEstado]);

  const totalPaginas = Math.ceil(campanasFiltradas.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const campanasActuales = campanasFiltradas.slice(indiceInicio, indiceFin);

  return {
    campanasFiltradas,
    campanasActuales,
    totalPaginas,
  };
};
