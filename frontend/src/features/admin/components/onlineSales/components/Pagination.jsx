import { useMemo } from "react";
import { useVentasOnlineStore } from "../../sales/store/useVentasOnlineStore";

export const Pagination = () => {
  const {
    paginaActual,
    setPaginaActual,
    cargando,
    ventas,
    filtro,
    filtroEstado,
    itemsPorPagina,
  } = useVentasOnlineStore();

  // Calcular ventas filtradas y paginadas con useMemo
  const { totalPaginas, itemsActuales } = useMemo(() => {
    // Filtrar ventas
    const ventasFiltradas = ventas.filter((v) => {
      const txt = filtro.toLowerCase();
      const coincide =
        (v.nombreCliente?.toLowerCase() || "").includes(txt) ||
        v.idVentaO?.toString().includes(txt) ||
        (v.dni?.toString() || "").includes(txt);

      const estadoVenta = (v.estado || "").toLowerCase();
      const estadoFiltro = filtroEstado.toLowerCase();
      const coincideEstado =
        filtroEstado === "Todos" ? true : estadoVenta === estadoFiltro;

      return coincide && coincideEstado;
    });

    // Calcular total de páginas
    const total = Math.ceil(ventasFiltradas.length / itemsPorPagina);

    // Paginar
    const indiceUltimo = paginaActual * itemsPorPagina;
    const items = ventasFiltradas.slice(
      indiceUltimo - itemsPorPagina,
      indiceUltimo,
    );

    return { totalPaginas: total, itemsActuales: items };
  }, [ventas, filtro, filtroEstado, paginaActual, itemsPorPagina]);

  const getPaginationNumbers = () => {
    const range = [];
    for (let i = 1; i <= totalPaginas; i++) range.push(i);
    return range;
  };

  if (cargando || itemsActuales.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center py-6 bg-white border-t border-gray-200">
      <nav className="flex items-center gap-1">
        <button
          onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
          disabled={paginaActual === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-md text-primary-600 hover:bg-primary-50 transition-colors ${paginaActual === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          &lt;
        </button>
        {getPaginationNumbers().map((num, i) => (
          <button
            key={i}
            onClick={() => typeof num === "number" && setPaginaActual(num)}
            disabled={typeof num !== "number"}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${num === paginaActual ? "bg-primary-600 text-white shadow-md" : typeof num === "number" ? "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50" : "text-gray-400"}`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() =>
            setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
          }
          disabled={paginaActual === totalPaginas}
          className={`w-8 h-8 flex items-center justify-center rounded-md text-primary-600 hover:bg-primary-50 transition-colors ${paginaActual === totalPaginas ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          &gt;
        </button>
      </nav>
    </div>
  );
};
