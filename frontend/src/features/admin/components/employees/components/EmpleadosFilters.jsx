import { Search, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const EmpleadosFilters = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  totalFiltrados = 0,
  totalEmpleados = 0,
}) => {
  const hayFiltros = busqueda.trim() !== "" || filtroEstado !== "todos";

  const limpiar = () => {
    setBusqueda("");
    setFiltroEstado("todos");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-gray-200 bg-white shadow-xs"
      role="search"
      aria-label="Filtros de empleados"
    >
      <div className="flex flex-col gap-2.5 p-3 sm:flex-row sm:items-center sm:p-3.5">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            name="search_empleados"
            autoComplete="off"
            placeholder="Nombre, DNI, email o ID..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 pl-8.5 pr-8 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
            aria-label="Buscar empleado"
          />
          <AnimatePresence>
            {busqueda && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => setBusqueda("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
                aria-label="Limpiar búsqueda"
              >
                <XCircle size={15} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 cursor-pointer transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 sm:w-44"
          aria-label="Filtrar por estado del empleado"
        >
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>

        <AnimatePresence>
          {hayFiltros && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              type="button"
              onClick={limpiar}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              aria-label="Limpiar todos los filtros"
            >
              <XCircle size={13} aria-hidden="true" />
              Limpiar
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-gray-100 px-3.5 py-2 lg:px-4">
        <p className="text-xs text-gray-500" aria-live="polite">
          <span className="font-semibold text-gray-700">{totalFiltrados}</span>{" "}
          de{" "}
          <span className="font-semibold text-gray-700">{totalEmpleados}</span>{" "}
          empleados
        </p>
      </div>
    </motion.section>
  );
};
