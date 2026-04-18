import { motion } from "framer-motion";
import {
  Mail,
  CreditCard,
  Edit,
  Power,
  Shield,
  Package,
  Edit2,
  Eye,
} from "lucide-react";

const PERMISOS_DEF = [
  { key: "crear_productos", label: "Crear", icon: Package },
  { key: "modificar_productos", label: "Modificar", icon: Edit2 },
  { key: "modificar_ventasE", label: "Ed. Ventas", icon: Edit },
  { key: "ver_ventasTotalesE", label: "Ver Ventas", icon: Eye },
];

export const EmpleadoCard = ({
  empleado,
  onEditar,
  onCambiarEstado,
  index = 0,
}) => {
  const esActivo = empleado.activo !== 0 && empleado.activo !== false;

  const permisos = PERMISOS_DEF.map((p) => ({
    ...p,
    activo: empleado[p.key] === 1 || empleado[p.key] === true,
  }));

  const permisosActivos = permisos.filter((p) => p.activo).length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition-shadow hover:shadow-sm"
      aria-label={`Empleado ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado}`}
    >
      <div
        className={`h-1 ${esActivo ? "bg-green-500" : "bg-orange-400"}`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2 px-4 pt-3.5 pb-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
          </h3>
          <p className="text-xs text-gray-400">#{empleado.idEmpleado}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            esActivo
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-orange-50 text-orange-700 border border-orange-200"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${esActivo ? "bg-green-500" : "bg-orange-400"}`}
            aria-hidden="true"
          />
          {esActivo ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className="space-y-1.5 px-4 pb-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail
            size={12}
            className="shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <span className="truncate">{empleado.emailEmpleado}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <CreditCard
            size={12}
            className="shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <span>{empleado.dniEmpleado || "Sin DNI"}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Shield size={13} className="text-green-600" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
            Permisos ({permisosActivos}/4)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {permisos.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.key}
                className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs ${
                  p.activo
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-50 text-gray-400 border border-gray-100"
                }`}
              >
                <Icon size={12} aria-hidden="true" />
                <span className="truncate">{p.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-t border-gray-100 bg-gray-50/70 px-4 py-2.5">
        <button
          type="button"
          onClick={() => onEditar(empleado)}
          className="flex flex-1 items-center justify-center gap-1.5 h-8 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          aria-label={`Editar empleado ${empleado.nombreEmpleado}`}
        >
          <Edit size={13} aria-hidden="true" />
          Editar
        </button>
        <button
          type="button"
          onClick={() => onCambiarEstado(empleado)}
          className={`flex flex-1 items-center justify-center gap-1.5 h-8 rounded-lg border text-xs font-semibold active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 ${
            esActivo
              ? "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 focus-visible:ring-orange-400"
              : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 focus-visible:ring-green-500"
          }`}
          aria-label={`${esActivo ? "Desactivar" : "Activar"} empleado ${empleado.nombreEmpleado}`}
        >
          <Power size={13} aria-hidden="true" />
          {esActivo ? "Desactivar" : "Activar"}
        </button>
      </div>
    </motion.article>
  );
};
