import { Shield, Package, Edit2, Edit, Eye } from "lucide-react";
import { motion } from "framer-motion";

const PERMISOS_DEF = [
  {
    key: "crear_productos",
    label: "Crear Productos / Ofertas",
    desc: "Crear nuevos productos y ofertas en el sistema",
    icon: Package,
  },
  {
    key: "modificar_productos",
    label: "Modificar / Eliminar Productos",
    desc: "Editar y eliminar productos existentes",
    icon: Edit2,
  },
  {
    key: "modificar_ventasE",
    label: "Editar / Anular Ventas",
    desc: "Modificar y anular ventas realizadas",
    icon: Edit,
  },
  {
    key: "ver_ventasTotalesE",
    label: "Ver Ventas Totales",
    desc: "Acceder a estadísticas completas de ventas",
    icon: Eye,
  },
];

export const PermisosSection = ({ permisos, onChange }) => {
  const activos = Object.values(permisos).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
      role="group"
      aria-label="Permisos del empleado"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600">
            <Shield size={14} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800">Permisos</p>
            <p className="text-[11px] text-gray-500">Seleccioná los accesos del empleado</p>
          </div>
        </div>
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">
          {activos}/4
        </span>
      </div>

      {/* Lista de permisos */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {PERMISOS_DEF.map((p) => {
          const Icon = p.icon;
          const checked = permisos[p.key];
          const id = `permiso-${p.key}`;

          return (
            <label
              key={p.key}
              htmlFor={id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-1 ${
                checked
                  ? "border-green-300 bg-white shadow-xs"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(p.key, e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-0"
                aria-describedby={`${id}-desc`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon
                    size={13}
                    className={checked ? "text-green-600" : "text-gray-400"}
                    aria-hidden="true"
                  />
                  <span className={`text-xs font-semibold ${checked ? "text-gray-900" : "text-gray-600"}`}>
                    {p.label}
                  </span>
                </div>
                <p id={`${id}-desc`} className="text-[11px] text-gray-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </motion.div>
  );
};