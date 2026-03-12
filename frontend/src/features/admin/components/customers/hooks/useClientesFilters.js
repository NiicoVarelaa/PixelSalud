import { useState, useEffect, useMemo } from "react";

/**
 * Hook para gestionar filtros y paginación de clientes
 * @param {Array} clientes - Lista completa de clientes
 * @param {number} itemsPorPagina - Cantidad de items por página
 */
export const useClientesFilters = (clientes, itemsPorPagina = 8) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // Filtrar clientes según búsqueda y estado
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cli) => {
      // Filtro por búsqueda
      const termino = busqueda.toLowerCase();
      const coincideBusqueda =
        cli.nombreCliente.toLowerCase().includes(termino) ||
        cli.apellidoCliente.toLowerCase().includes(termino) ||
        cli.emailCliente.toLowerCase().includes(termino) ||
        (cli.dni && cli.dni.toString().includes(termino));

      // Filtro por estado
      const esActivo = cli.activo !== 0 && cli.activo !== false;
      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activos" && esActivo) ||
        (filtroEstado === "inactivos" && !esActivo);

      return coincideBusqueda && coincideEstado;
    });
  }, [clientes, busqueda, filtroEstado]);

  // Paginación
  const totalPaginas = Math.ceil(clientesFiltrados.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const clientesActuales = clientesFiltrados.slice(indiceInicio, indiceFin);

  return {
    // Estados de filtros
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,

    // Estados de paginación
    paginaActual,
    setPaginaActual,
    totalPaginas,

    // Resultados
    clientesFiltrados,
    clientesActuales,
  };
};
