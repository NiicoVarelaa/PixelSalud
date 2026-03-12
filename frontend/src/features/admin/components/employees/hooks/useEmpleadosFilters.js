import { useState, useEffect, useMemo } from "react";

/**
 * Hook para gestionar filtros y paginación de empleados
 * @param {Array} empleados - Lista completa de empleados
 * @param {number} itemsPorPagina - Cantidad de items por página
 */
export const useEmpleadosFilters = (empleados, itemsPorPagina = 8) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // Filtrar empleados según búsqueda y estado
  const empleadosFiltrados = useMemo(() => {
    return empleados.filter((emp) => {
      // Filtro por búsqueda
      const termino = busqueda.toLowerCase();
      const coincideBusqueda =
        emp.nombreEmpleado.toLowerCase().includes(termino) ||
        emp.apellidoEmpleado.toLowerCase().includes(termino) ||
        emp.emailEmpleado.toLowerCase().includes(termino) ||
        (emp.dniEmpleado && emp.dniEmpleado.toString().includes(termino)) ||
        emp.idEmpleado.toString().includes(termino);

      // Filtro por estado
      const esActivo = emp.activo !== 0 && emp.activo !== false;
      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activos" && esActivo) ||
        (filtroEstado === "inactivos" && !esActivo);

      return coincideBusqueda && coincideEstado;
    });
  }, [empleados, busqueda, filtroEstado]);

  // Paginación
  const totalPaginas = Math.ceil(empleadosFiltrados.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const empleadosActuales = empleadosFiltrados.slice(indiceInicio, indiceFin);

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
    empleadosFiltrados,
    empleadosActuales,
  };
};
