import { useState } from "react";

export const useAuditoriaFilters = () => {
  const [filtros, setFiltros] = useState({
    modulo: "",
    tipoUsuario: "",
    fechaDesde: "",
    fechaHasta: "",
    limite: 6,
    offset: 0,
  });

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
      offset: campo !== "offset" ? 0 : valor,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      modulo: "",
      tipoUsuario: "",
      fechaDesde: "",
      fechaHasta: "",
      limite: 6,
      offset: 0,
    });
  };

  const paginaAnterior = () => {
    handleFiltroChange("offset", Math.max(0, filtros.offset - filtros.limite));
  };

  const paginaSiguiente = () => {
    handleFiltroChange("offset", filtros.offset + filtros.limite);
  };

  const irAPagina = (pagina) => {
    const paginaSegura = Math.max(1, Number(pagina) || 1);
    handleFiltroChange("offset", (paginaSegura - 1) * filtros.limite);
  };

  return {
    filtros,
    handleFiltroChange,
    irAPagina,
    limpiarFiltros,
    paginaAnterior,
    paginaSiguiente,
  };
};
