import { Shield, Package, Edit2, Edit, Eye } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Componente para gestionar los permisos de un empleado
 * Muestra checkboxes interactivos para cada permiso
 */
export const PermisosSection = ({ permisos, onChange }) => {
  const listaPermisos = [
    {
      key: "crear_productos",
      label: "Crear Productos/Ofertas",
      descripcion: "Permite crear nuevos productos y ofertas en el sistema",
      icono: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
    },
    {
      key: "modificar_productos",
      label: "Modificar/Eliminar Productos",
      descripcion: "Permite editar y eliminar productos existentes",
      icono: Edit2,
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      hoverColor: "hover:bg-gray-100",
    },
    {
      key: "modificar_ventasE",
      label: "Editar/Anular Ventas",
      descripcion: "Permite modificar y anular ventas realizadas",
      icono: Edit,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
    },
    {
      key: "ver_ventasTotalesE",
      label: "Ver Ventas Totales",
      descripcion: "Permite acceder a estadísticas completas de ventas",
      icono: Eye,
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      hoverColor: "hover:bg-gray-100",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 p-5 rounded-xl border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-600 p-2 rounded-lg">
          <Shield className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-green-800 uppercase">
            Asignar Permisos
          </h3>
          <p className="text-xs text-gray-600">
            Selecciona los accesos del empleado
          </p>
        </div>
      </div>

      {/* Lista de Permisos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {listaPermisos.map((permiso) => {
          const Icon = permiso.icono;
          const activo = permisos[permiso.key];

          return (
            <motion.label
              key={permiso.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                activo
                  ? "bg-white border-green-400 shadow-sm"
                  : `${permiso.bgColor} border-transparent ${permiso.hoverColor}`
              }`}
            >
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => onChange(permiso.key, e.target.checked)}
                className="mt-1 h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-2 focus:ring-green-500 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={permiso.color} size={16} />
                  <span className="text-sm font-semibold text-gray-800">
                    {permiso.label}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {permiso.descripcion}
                </p>
              </div>
            </motion.label>
          );
        })}
      </div>

      {/* Contador de permisos seleccionados */}
      <div className="mt-4 text-center">
        <span className="text-xs text-gray-600">
          Permisos seleccionados:{" "}
          <span className="font-bold text-green-700">
            {Object.values(permisos).filter(Boolean).length}/4
          </span>
        </span>
      </div>
    </motion.div>
  );
};
