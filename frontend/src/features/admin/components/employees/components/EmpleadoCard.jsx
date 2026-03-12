import { motion } from "framer-motion";
import {
  Mail,
  CreditCard,
  Edit,
  Power,
  CheckCircle,
  XCircle,
  Shield,
  Package,
  Edit2,
  Eye,
} from "lucide-react";

/**
 * Tarjeta de empleado para vista móvil
 * Muestra toda la información del empleado incluyendo permisos
 */
export const EmpleadoCard = ({ empleado, onEditar, onCambiarEstado }) => {
  const esActivo = empleado.activo !== 0 && empleado.activo !== false;

  // Permisos del empleado
  const permisos = [
    {
      key: "crear_productos",
      label: "Crear Productos",
      icono: Package,
      activo:
        empleado.crear_productos === 1 || empleado.crear_productos === true,
    },
    {
      key: "modificar_productos",
      label: "Modificar Productos",
      icono: Edit2,
      activo:
        empleado.modificar_productos === 1 ||
        empleado.modificar_productos === true,
    },
    {
      key: "modificar_ventasE",
      label: "Editar Ventas",
      icono: Edit,
      activo:
        empleado.modificar_ventasE === 1 || empleado.modificar_ventasE === true,
    },
    {
      key: "ver_ventasTotalesE",
      label: "Ver Ventas Totales",
      icono: Eye,
      activo:
        empleado.ver_ventasTotalesE === 1 ||
        empleado.ver_ventasTotalesE === true,
    },
  ];

  const permisosActivos = permisos.filter((p) => p.activo).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      className="bg-white rounded-xl shadow-lg overflow-hidden mb-4"
    >
      {/* Header con gradiente y estado */}
      <div
        className={`bg-gradient-to-r ${esActivo ? "from-blue-500 to-blue-600" : "from-red-500 to-red-600"} p-4`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">
              {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
            </h3>
            <p className="text-white text-xs opacity-90">
              ID: #{empleado.idEmpleado}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {esActivo ? (
              <CheckCircle className="text-white" size={20} />
            ) : (
              <XCircle className="text-white" size={20} />
            )}
          </div>
        </div>
      </div>

      {/* Información del empleado */}
      <div className="p-4 space-y-3">
        {/* Email */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Mail className="text-blue-600" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Email
            </p>
            <p
              className="text-sm text-gray-700 truncate"
              title={empleado.emailEmpleado}
            >
              {empleado.emailEmpleado}
            </p>
          </div>
        </div>

        {/* DNI */}
        <div className="flex items-center gap-3">
          <div className="bg-purple-50 p-2 rounded-lg">
            <CreditCard className="text-purple-600" size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">DNI</p>
            <p className="text-sm text-gray-700">
              {empleado.dniEmpleado || "No especificado"}
            </p>
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-3">
          <div
            className={`${esActivo ? "bg-green-50" : "bg-red-50"} p-2 rounded-lg`}
          >
            {esActivo ? (
              <CheckCircle className="text-green-600" size={18} />
            ) : (
              <XCircle className="text-red-600" size={18} />
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Estado
            </p>
            <p
              className={`text-sm font-semibold ${esActivo ? "text-green-600" : "text-red-600"}`}
            >
              {esActivo ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>

        {/* Permisos */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-purple-600" size={16} />
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Permisos ({permisosActivos}/4)
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {permisos.map((permiso) => {
              const Icon = permiso.icono;
              return (
                <div
                  key={permiso.key}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs ${
                    permiso.activo
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-50 text-gray-400 border border-gray-200"
                  }`}
                >
                  <Icon size={14} />
                  <span className="truncate">{permiso.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onEditar(empleado)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors shadow-md"
        >
          <Edit size={18} />
          Editar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCambiarEstado(empleado)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white font-medium rounded-lg transition-colors shadow-md ${
            esActivo
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <Power size={18} />
          {esActivo ? "Desactivar" : "Activar"}
        </motion.button>
      </div>
    </motion.div>
  );
};
