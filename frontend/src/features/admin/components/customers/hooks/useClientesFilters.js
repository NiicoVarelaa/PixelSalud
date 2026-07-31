import { useState, useEffect, useMemo } from "react";

export const useClientesFilters = (clientes, itemsPorPagina = 8) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cli) => {
      const termino = busqueda.toLowerCase();
      const coincideBusqueda =
        cli.nombreCliente.toLowerCase().includes(termino) ||
        cli.apellidoCliente.toLowerCase().includes(termino) ||
        cli.emailCliente.toLowerCase().includes(termino) ||
        (cli.dni && cli.dni.toString().includes(termino));

      const esActivo = cli.activo !== 0 && cli.activo !== false;
      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activos" && esActivo) ||
        (filtroEstado === "inactivos" && !esActivo);

      return coincideBusqueda && coincideEstado;
    });
  }, [clientes, busqueda, filtroEstado]);

  const totalPaginas = Math.ceil(clientesFiltrados.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const clientesActuales = clientesFiltrados.slice(indiceInicio, indiceFin);

  return {
    busqueda,
    clientesFiltrados,
    clientesActuales,
    filtroEstado,
    paginaActual,
    totalPaginas,
    setBusqueda,
    setFiltroEstado,
    setPaginaActual,
  };
};
