import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Percent,
  XCircle,
  RotateCcw,
  Package,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useOfertasStore } from "../store/useOfertasStore";
import { useMemo } from "react";

export const OfertasFilters = ({ categorias = [] }) => {
  const {
    busqueda,
    filtroCategoria,
    filtroDescuento,
    setBusqueda,
    setFiltroCategoria,
    setFiltroDescuento,
    resetFiltros,
    productos,
  } = useOfertasStore();

  // Calcular stats para mostrar
  const stats = useMemo(() => {
    const total = productos.length;
    const conOferta = productos.filter(
      (p) => p.enOferta && p.porcentajeDescuento > 0,
    ).length;
    const sinOferta = total - conOferta;

    return { total, conOferta, sinOferta };
  }, [productos]);

  const hayFiltrosActivos =
    busqueda || filtroCategoria !== "todas" || filtroDescuento !== "todos";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
      role="search"
      aria-label="Filtros de ofertas"
    >
      {/* Alerta informativa con mejor diseño */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
        <div className="flex items-start gap-3 p-4 sm:p-5">
          <div
            className="shrink-0 w-9 h-9 bg-purple-500 rounded-xl flex items-center justify-center shadow-sm"
            aria-hidden="true"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-purple-900 mb-1">
              Importante
            </h3>
            <p className="text-sm text-purple-700 leading-relaxed">
              No se pueden aplicar ofertas individuales a productos que están en
              campañas activas.
            </p>
          </div>
        </div>
      </div>

      {/* Contenedor de filtros */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* Grid de filtros - Mobile first */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="search-ofertas"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Search
                size={16}
                className="text-primary-500"
                aria-hidden="true"
              />
              Buscar producto
            </label>
            <div className="relative group">
              <input
                id="search-ofertas"
                type="search"
                inputMode="search"
                placeholder="Escribe el nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="
                  w-full h-12 px-4 pr-11
                  bg-gray-50 border-2 border-gray-200 rounded-xl
                  text-sm sm:text-base text-gray-900 placeholder-gray-400
                  font-medium
                  transition-all duration-200
                  hover:border-gray-300 hover:bg-white
                  focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                "
                aria-describedby="search-hint"
              />
              {busqueda && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  type="button"
                  onClick={() => setBusqueda("")}
                  className="
                    absolute inset-y-0 right-0 pr-3 flex items-center
                    text-gray-400 hover:text-gray-600 transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg
                  "
                  aria-label="Limpiar búsqueda"
                >
                  <XCircle size={20} />
                </motion.button>
              )}
              {!busqueda && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search
                    size={18}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            <span id="search-hint" className="sr-only">
              Escribe el nombre del producto para filtrar
            </span>
          </div>

          {/* Filtro por categoría */}
          <div>
            <label
              htmlFor="filter-categoria"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Package
                size={16}
                className="text-orange-500"
                aria-hidden="true"
              />
              Categoría
            </label>
            <div className="relative">
              <select
                id="filter-categoria"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="
                  w-full h-12 pl-4 pr-11
                  bg-gray-50 border-2 border-gray-200 rounded-xl
                  text-sm sm:text-base text-gray-900
                  font-medium cursor-pointer appearance-none
                  transition-all duration-200
                  hover:border-gray-300 hover:bg-white
                  focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                "
                aria-label="Filtrar por categoría"
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Filtro por descuento */}
          <div>
            <label
              htmlFor="filter-descuento"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Percent size={16} className="text-red-500" aria-hidden="true" />
              Descuento
            </label>
            <div className="relative">
              <select
                id="filter-descuento"
                value={filtroDescuento}
                onChange={(e) => setFiltroDescuento(e.target.value)}
                className="
                  w-full h-12 pl-4 pr-11
                  bg-gray-50 border-2 border-gray-200 rounded-xl
                  text-sm sm:text-base text-gray-900
                  font-medium cursor-pointer appearance-none
                  transition-all duration-200
                  hover:border-gray-300 hover:bg-white
                  focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                "
                aria-label="Filtrar por porcentaje de descuento"
              >
                <option value="todos">Todos los descuentos</option>
                <option value="sin-oferta">Sin oferta</option>
                <option value="10">10% OFF</option>
                <option value="15">15% OFF</option>
                <option value="20">20% OFF</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stats y botón limpiar - Mejorado mobile-first */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t-2 border-gray-100">
          {/* Stats con iconos */}
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-4 text-sm">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-1.5">
                <Package
                  size={16}
                  className="text-gray-400 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-gray-600 font-medium hidden sm:inline">
                  Total:
                </span>
              </div>
              <span className="font-bold text-gray-900 text-base">
                {stats.total}
              </span>
              <span className="text-xs text-gray-500 sm:hidden">Total</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2 bg-primary-50 rounded-xl"
            >
              <div className="flex items-center gap-1.5">
                <TrendingUp
                  size={16}
                  className="text-primary-500 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-primary-700 font-medium hidden sm:inline">
                  Con oferta:
                </span>
              </div>
              <span className="font-bold text-primary-700 text-base">
                {stats.conOferta}
              </span>
              <span className="text-xs text-primary-600 sm:hidden">
                Ofertas
              </span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-1.5">
                <Filter
                  size={16}
                  className="text-gray-400 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-gray-600 font-medium hidden sm:inline">
                  Sin oferta:
                </span>
              </div>
              <span className="font-bold text-gray-700 text-base">
                {stats.sinOferta}
              </span>
              <span className="text-xs text-gray-500 sm:hidden">
                Sin oferta
              </span>
            </motion.div>
          </div>

          {/* Botón limpiar filtros */}
          {hayFiltrosActivos && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={resetFiltros}
              className="
                inline-flex items-center justify-center gap-2 h-11 sm:h-10
                px-5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300
                text-gray-700 rounded-xl
                text-sm font-semibold shadow-sm
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
              "
              aria-label="Limpiar todos los filtros"
            >
              <RotateCcw size={16} aria-hidden="true" />
              <span>Limpiar filtros</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
