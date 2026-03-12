import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Componente de filtros para empleados
 * Incluye búsqueda y filtro por estado
 */
export const EmpleadosFilters = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-xl shadow-lg mb-6"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            name="search_empleados_unique_id"
            autoComplete="off"
            placeholder="Buscar por nombre, DNI, email o ID..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filtro por Estado */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="text-gray-400" size={20} />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
          >
            <option value="todos">Todos los empleados</option>
            <option value="activos">✓ Activos</option>
            <option value="inactivos">✗ Inactivos</option>
          </select>
        </div>
      </div>

      {/* Contador de resultados */}
      {busqueda && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 mt-3"
        >
          Buscando: <span className="font-semibold">{busqueda}</span>
        </motion.p>
      )}
    </motion.div>
  );
};
