import {
  Mail,
  CreditCard,
  Edit2,
  Power,
  RotateCcw,
  Shield,
  Package,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

const PERMISOS_DEF = [
  { key: "crear_productos", label: "Crear", icon: Package },
  { key: "modificar_productos", label: "Modificar", icon: Edit2 },
  { key: "modificar_ventasE", label: "Ventas", icon: Edit },
  { key: "ver_ventasTotalesE", label: "Ver Ventas", icon: Eye },
];

export const EmpleadoCard = ({
  empleado,
  onEditar,
  onCambiarEstado,
}) => {
  const esActivo = empleado.activo !== 0 && empleado.activo !== false;

  const permisos = PERMISOS_DEF.map((p) => ({
    ...p,
    activo: empleado[p.key] === 1 || empleado[p.key] === true,
  }));

  const permisosActivos = permisos.filter((p) => p.activo).length;

  return (
    <article
      className="overflow-hidden rounded-xl border border-gray-100 bg-white"
      aria-label={`Empleado ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
            </h3>
            <p className="text-xs text-gray-400">ID: #{empleado.idEmpleado}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              esActivo
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {esActivo ? (
              <CheckCircle2 size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {esActivo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2">
            <Mail className="text-blue-600" size={16} />
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

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-50 p-2">
            <CreditCard className="text-violet-600" size={16} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">DNI</p>
            <p className="text-sm text-gray-700">
              {empleado.dniEmpleado || "No especificado"}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Shield size={13} className="text-green-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  <Icon size={12} />
                  <span className="truncate">{p.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-gray-100 bg-gray-50 p-2.5 justify-end">
        <button
          onClick={() => onEditar(empleado)}
          className={`p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500 ${baseBtn}`}
          title="Editar"
          aria-label={`Editar ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado}`}
        >
          <Edit2 size={16} />
        </button>

        {esActivo ? (
          <button
            onClick={() => onCambiarEstado(empleado)}
            className={`p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500 ${baseBtn}`}
            title="Desactivar"
            aria-label={`Desactivar ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado}`}
          >
            <Power size={16} />
          </button>
        ) : (
          <button
            onClick={() => onCambiarEstado(empleado)}
            className={`p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500 ${baseBtn}`}
            title="Reactivar"
            aria-label={`Reactivar ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado}`}
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </article>
  );
};
