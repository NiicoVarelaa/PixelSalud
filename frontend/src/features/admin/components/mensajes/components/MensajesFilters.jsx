import { FaFilter, FaSearch, FaEraser } from "react-icons/fa";
import { motion } from "framer-motion";

export const MensajesFilters = ({
  filtroEstado,
  onFiltroEstadoChange,
  busqueda,
  onBusquedaChange,
  onLimpiar,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Filtro por estado */}
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <select
            value={filtroEstado}
            onChange={(e) => onFiltroEstadoChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="nuevo">Nuevos</option>
            <option value="en_proceso">En proceso</option>
            <option value="respondido">Respondidos</option>
            <option value="cerrado">Cerrados</option>
          </select>
        </div>

        {/* Búsqueda */}
        <div className="flex-1 flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-primary-500">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, asunto o mensaje..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="outline-none text-sm bg-transparent flex-1"
          />
        </div>

        {/* Botón limpiar */}
        {(filtroEstado !== "todos" || busqueda) && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLimpiar}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <FaEraser /> Limpiar
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
