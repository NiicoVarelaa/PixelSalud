import { motion, AnimatePresence } from "framer-motion";
import { Search, XCircle } from "lucide-react";

const selectCls =
  "h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 cursor-pointer transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100";

export const CuponesFilters = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroTipo,
  setFiltroTipo,
  onResetPaginacion,
}) => {
  const hayFiltros =
    busqueda || filtroEstado !== "todos" || filtroTipo !== "todos";

  const handleBusqueda = (v) => {
    setBusqueda(v);
    onResetPaginacion();
  };
  const handleEstado = (v) => {
    setFiltroEstado(v);
    onResetPaginacion();
  };
  const handleTipo = (v) => {
    setFiltroTipo(v);
    onResetPaginacion();
  };

  const limpiar = () => {
    setBusqueda("");
    setFiltroEstado("todos");
    setFiltroTipo("todos");
    onResetPaginacion();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-gray-200 bg-white shadow-xs"
      role="search"
      aria-label="Filtros de cupones"
    >
      <div className="grid grid-cols-1 gap-2.5 p-3 sm:grid-cols-2 lg:grid-cols-4 lg:p-3.5">
        <div className="lg:col-span-2">
          <label
            htmlFor="busqueda-cupon"
            className="mb-1.5 block text-xs font-medium text-gray-500"
          >
            Buscar
          </label>
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="busqueda-cupon"
              type="search"
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              placeholder="Código o descripción..."
              className="w-full h-9 pl-8.5 pr-8 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
            />
            <AnimatePresence>
              {busqueda && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={() => handleBusqueda("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
                  aria-label="Limpiar búsqueda"
                >
                  <XCircle size={15} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <label
            htmlFor="filtro-estado"
            className="mb-1.5 block text-xs font-medium text-gray-500"
          >
            Estado
          </label>
          <select
            id="filtro-estado"
            value={filtroEstado}
            onChange={(e) => handleEstado(e.target.value)}
            className={selectCls}
            aria-label="Filtrar por estado del cupón"
          >
            <option value="todos">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="expirado">Expirados</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filtro-tipo"
            className="mb-1.5 block text-xs font-medium text-gray-500"
          >
            Tipo usuario
          </label>
          <select
            id="filtro-tipo"
            value={filtroTipo}
            onChange={(e) => handleTipo(e.target.value)}
            className={selectCls}
            aria-label="Filtrar por tipo de usuario"
          >
            <option value="todos">Todos</option>
            <option value="nuevo">Nuevos</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>

      <AnimatePresence>
        {hayFiltros && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 px-3 py-2 lg:px-3.5"
          >
            <button
              type="button"
              onClick={limpiar}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
              aria-label="Limpiar todos los filtros"
            >
              <XCircle size={13} aria-hidden="true" />
              Limpiar filtros
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
