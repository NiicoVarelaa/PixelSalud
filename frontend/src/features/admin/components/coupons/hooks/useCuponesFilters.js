import { useState, useMemo } from "react";

export const useCuponesFilters = (cupones, itemsPorPagina = 8) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);

  const cuponesFiltrados = useMemo(() => {
    return cupones.filter((cupon) => {
      const matchBusqueda =
        cupon.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        cupon.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

      const matchEstado =
        filtroEstado === "todos" || cupon.estado === filtroEstado;

      const matchTipo =
        filtroTipo === "todos" || cupon.tipoUsuario === filtroTipo;

      return matchBusqueda && matchEstado && matchTipo;
    });
  }, [cupones, busqueda, filtroEstado, filtroTipo]);

  const totalPaginas = Math.ceil(cuponesFiltrados.length / itemsPorPagina);
  const indiceUltimo = paginaActual * itemsPorPagina;
  const indicePrimero = indiceUltimo - itemsPorPagina;
  const cuponesPaginados = cuponesFiltrados.slice(indicePrimero, indiceUltimo);

  const resetPaginacion = () => setPaginaActual(1);

  return {
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroTipo,
    setFiltroTipo,
    paginaActual,
    setPaginaActual,
    cuponesFiltrados,
    cuponesPaginados,
    totalPaginas,
    indicePrimero,
    indiceUltimo,
    resetPaginacion,
  };
};
