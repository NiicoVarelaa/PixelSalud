import { useState, useEffect, useMemo } from "react";

export const useEmpleadosFilters = (empleados, itemsPorPagina = 8) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  const empleadosFiltrados = useMemo(() => {
    return empleados.filter((emp) => {
      const termino = busqueda.toLowerCase();
      const coincideBusqueda =
        emp.nombreEmpleado.toLowerCase().includes(termino) ||
        emp.apellidoEmpleado.toLowerCase().includes(termino) ||
        emp.emailEmpleado.toLowerCase().includes(termino) ||
        (emp.dniEmpleado && emp.dniEmpleado.toString().includes(termino)) ||
        emp.idEmpleado.toString().includes(termino);

      const esActivo = emp.activo !== 0 && emp.activo !== false;
      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activos" && esActivo) ||
        (filtroEstado === "inactivos" && !esActivo);

      return coincideBusqueda && coincideEstado;
    });
  }, [empleados, busqueda, filtroEstado]);

  const totalPaginas = Math.ceil(empleadosFiltrados.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const empleadosActuales = empleadosFiltrados.slice(indiceInicio, indiceFin);

  return {
    busqueda,
    empleadosActuales,
    empleadosFiltrados,
    filtroEstado,
    paginaActual,
    totalPaginas,
    setBusqueda,
    setFiltroEstado,
    setPaginaActual,
  };
};
