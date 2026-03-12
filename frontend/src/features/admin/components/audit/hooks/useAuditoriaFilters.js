import { useState } from "react";

export const useAuditoriaFilters = () => {
  const [filtros, setFiltros] = useState({
    modulo: "",
    tipoUsuario: "",
    fechaDesde: "",
    fechaHasta: "",
    limite: 10,
    offset: 0,
  });

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
      offset: campo !== "offset" ? 0 : valor, // Reset offset cuando cambian filtros
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      modulo: "",
      tipoUsuario: "",
      fechaDesde: "",
      fechaHasta: "",
      limite: 10,
      offset: 0,
    });
  };

  const paginaAnterior = () => {
    handleFiltroChange("offset", Math.max(0, filtros.offset - filtros.limite));
  };

  const paginaSiguiente = () => {
    handleFiltroChange("offset", filtros.offset + filtros.limite);
  };

  return {
    filtros,
    handleFiltroChange,
    limpiarFiltros,
    paginaAnterior,
    paginaSiguiente,
  };
};
