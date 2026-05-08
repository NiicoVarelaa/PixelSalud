import { Tag, Clock, Users, Power, Trash2, CheckCircle2, XCircle } from "lucide-react";
import {
  formatearFecha,
  getTipoUsuarioBadge,
} from "../utils/formatters";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

const TIPO_USUARIO_LABEL = { todos: "Todos", nuevo: "Nuevos", vip: "VIP" };

const getEstadoBadge = (estado) => {
  switch (estado) {
    case "activo":
      return { icon: CheckCircle2, cls: "bg-green-100 text-green-800" };
    case "expirado":
      return { icon: Clock, cls: "bg-red-100 text-red-800" };
    default:
      return { icon: XCircle, cls: "bg-gray-100 text-gray-700" };
  }
};

export const CuponCard = ({
  cupon,
  onCambiarEstado,
  onEliminar,
}) => {
  const esActivo = cupon.estado === "activo";
  const pctUso = cupon.usoMaximo
    ? Math.min(((cupon.vecesUsado || 0) / cupon.usoMaximo) * 100, 100)
    : null;
  const { icon: EstadoIcon, cls: estadoCls } = getEstadoBadge(cupon.estado);

  return (
    <article
      className="overflow-hidden rounded-xl border border-gray-100 bg-white"
      aria-label={`Cupon ${cupon.codigo}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Tag
              size={16}
              className="shrink-0 text-green-600"
              aria-hidden="true"
            />
            <span className="truncate font-bold text-gray-900 tracking-wide text-sm">
              {cupon.codigo}
            </span>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${estadoCls}`}
          >
            <EstadoIcon size={14} />
            {cupon.estado}
          </span>
        </div>

        {cupon.descripcion && (
          <p className="text-xs text-gray-500 line-clamp-2 mt-2">
            {cupon.descripcion}
          </p>
        )}
      </div>

      <div className="space-y-3 px-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Descuento
            </p>
            <p className="text-base font-bold text-orange-600">
              {cupon.tipoCupon === "porcentaje"
                ? `${cupon.valorDescuento}%`
                : `$${cupon.valorDescuento}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Audiencia
            </p>
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTipoUsuarioBadge(cupon.tipoUsuario)}`}
            >
              {TIPO_USUARIO_LABEL[cupon.tipoUsuario] ?? cupon.tipoUsuario}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={12} aria-hidden="true" />
          <span>
            {formatearFecha(cupon.fechaInicio)} →{" "}
            {formatearFecha(cupon.fechaVencimiento)}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="inline-flex items-center gap-1">
              <Users size={12} aria-hidden="true" /> Usos
            </span>
            <span className="font-medium text-gray-700">
              {cupon.vecesUsado || 0} / {cupon.usoMaximo || "∞"}
            </span>
          </div>
          {pctUso !== null && (
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${pctUso}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-t border-gray-100 bg-gray-50 p-2.5 justify-end">
        <button
          onClick={() => onCambiarEstado(cupon.idCupon, cupon.estado)}
          className={`p-2 rounded-lg ${baseBtn} ${
            esActivo
              ? "bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500"
              : "bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500"
          }`}
          title={esActivo ? "Desactivar" : "Activar"}
          aria-label={`${esActivo ? "Desactivar" : "Activar"} cupon ${cupon.codigo}`}
        >
          <Power size={16} />
        </button>
        <button
          onClick={() => onEliminar(cupon.idCupon)}
          className={`p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500 ${baseBtn}`}
          title="Eliminar"
          aria-label={`Eliminar cupon ${cupon.codigo}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
};
