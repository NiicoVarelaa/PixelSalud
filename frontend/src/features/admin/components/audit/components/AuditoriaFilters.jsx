import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";

export const AuditoriaFilters = ({
  filtros,
  onFiltroChange,
  onLimpiar,
  onBuscar,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Módulo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Módulo
          </label>
          <select
            value={filtros.modulo}
            onChange={(e) => onFiltroChange("modulo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos</option>
            <option value="autenticacion">Autenticación</option>
            <option value="ventas">Ventas</option>
            <option value="productos">Productos</option>
            <option value="permisos">Permisos</option>
            <option value="usuarios">Usuarios</option>
            <option value="ofertas">Ofertas</option>
            <option value="mercadopago">MercadoPago</option>
          </select>
        </div>

        {/* Tipo Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Usuario
          </label>
          <select
            value={filtros.tipoUsuario}
            onChange={(e) => onFiltroChange("tipoUsuario", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos</option>
            <option value="admin">Admin</option>
            <option value="empleado">Empleado</option>
            <option value="medico">Médico</option>
            <option value="cliente">Cliente</option>
            <option value="sistema">Sistema</option>
          </select>
        </div>

        {/* Fecha Desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Desde
          </label>
          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => onFiltroChange("fechaDesde", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hasta
          </label>
          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => onFiltroChange("fechaHasta", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onLimpiar}
          className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Limpiar Filtros
        </button>
        <button
          onClick={onBuscar}
          className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
      </div>
    </motion.div>
  );
};
