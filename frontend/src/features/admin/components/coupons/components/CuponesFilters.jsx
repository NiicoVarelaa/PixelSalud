import { motion } from "framer-motion";
import { FiSearch, FiFilter } from "react-icons/fi";

export const CuponesFilters = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroTipo,
  setFiltroTipo,
  onResetPaginacion,
}) => {
  const handleBusquedaChange = (valor) => {
    setBusqueda(valor);
    onResetPaginacion();
  };

  const handleFiltroEstadoChange = (valor) => {
    setFiltroEstado(valor);
    onResetPaginacion();
  };

  const handleFiltroTipoChange = (valor) => {
    setFiltroTipo(valor);
    onResetPaginacion();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-4 mb-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar cupón
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => handleBusquedaChange(e.target.value)}
              placeholder="Buscar por código o descripción..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filtroEstado}
              onChange={(e) => handleFiltroEstadoChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
              <option value="expirado">Expirados</option>
            </select>
          </div>
        </div>

        {/* Filtro Tipo Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo Usuario
          </label>
          <select
            value={filtroTipo}
            onChange={(e) => handleFiltroTipoChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="todos">Todos</option>
            <option value="nuevo">Nuevos</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};
