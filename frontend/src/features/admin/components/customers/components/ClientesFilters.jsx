import { Search, Filter, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export const ClientesFilters = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  totalFiltrados = 0,
  totalClientes = 0,
}) => {
  const hayFiltrosActivos = busqueda.trim() !== "" || filtroEstado !== "todos";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, email o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="text-gray-400" size={20} />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
          >
            <option value="todos">Todos los clientes</option>
            <option value="activos">✓ Activos</option>
            <option value="inactivos">✗ Inactivos</option>
          </select>
        </div>

        {hayFiltrosActivos && (
          <button
            type="button"
            onClick={() => {
              setBusqueda("");
              setFiltroEstado("todos");
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            <RotateCcw size={14} />
            Limpiar
          </button>
        )}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-3 text-xs font-medium text-gray-500"
      >
        {totalFiltrados} de {totalClientes} clientes visibles
      </motion.p>
    </motion.div>
  );
};
