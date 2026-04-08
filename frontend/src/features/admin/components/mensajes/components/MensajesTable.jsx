import { MailOpen, Mail, Reply, Archive, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { MensajeEstadoBadge } from "./MensajeEstadoBadge";
import { formatFecha } from "../utils/helpers";

/* ── Botón de acción inline reutilizable ── */
const ActionBtn = ({ onClick, label, icon: Icon, variant = "default" }) => {
  const variants = {
    default:  "border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-gray-400",
    primary:  "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 focus-visible:ring-green-500",
    info:     "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 focus-visible:ring-blue-400",
    muted:    "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 focus-visible:ring-gray-400",
    danger:   "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-400",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${variants[variant]}`}
    >
      <Icon size={13} aria-hidden="true" />
    </button>
  );
};

/* ── Fila de la tabla (desktop) ── */
const TableRow = ({ mensaje, index, onVerDetalle, onResponder, onArchivar, onEliminar }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.025 }}
    className={`group transition-colors hover:bg-gray-50/80 ${!mensaje.leido ? "bg-green-50/40" : "bg-white"}`}
  >
    {/* Estado + leído */}
    <td className="px-4 py-3">
      <div className="flex flex-col gap-1.5">
        <MensajeEstadoBadge estado={mensaje.estado} />
        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
          {mensaje.leido
            ? <><MailOpen size={11} aria-hidden="true" /> Leído</>
            : <><Mail size={11} className="text-green-600" aria-hidden="true" /><span className="font-semibold text-green-700">Nuevo</span></>
          }
        </span>
      </div>
    </td>

    {/* Remitente */}
    <td className="px-4 py-3">
      <p className={`text-sm ${!mensaje.leido ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
        {mensaje.nombre}
      </p>
      <p className="text-xs text-gray-400 truncate max-w-[160px]">{mensaje.email}</p>
    </td>

    {/* Asunto */}
    <td className="px-4 py-3">
      <p className="truncate max-w-[220px] text-sm text-gray-700">{mensaje.asunto}</p>
    </td>

    {/* Fecha */}
    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400">
      {formatFecha(mensaje.fechaEnvio)}
    </td>

    {/* Acciones */}
    <td className="px-4 py-3">
      <div className="flex items-center gap-1">
        <ActionBtn
          onClick={() => onVerDetalle(mensaje)}
          label={`Ver mensaje de ${mensaje.nombre}`}
          icon={MailOpen}
          variant="primary"
        />
        {mensaje.estado !== "respondido" && mensaje.estado !== "cerrado" && (
          <ActionBtn
            onClick={() => onResponder(mensaje)}
            label={`Responder a ${mensaje.nombre}`}
            icon={Reply}
            variant="info"
          />
        )}
        {mensaje.estado !== "cerrado" && (
          <ActionBtn
            onClick={() => onArchivar(mensaje.idMensaje)}
            label="Archivar mensaje"
            icon={Archive}
            variant="muted"
          />
        )}
        <ActionBtn
          onClick={() => onEliminar(mensaje.idMensaje)}
          label="Eliminar mensaje"
          icon={Trash2}
          variant="danger"
        />
      </div>
    </td>
  </motion.tr>
);

/* ── Card (mobile) ── */
const MensajeCard = ({ mensaje, index, onVerDetalle, onResponder, onArchivar, onEliminar }) => (
  <motion.article
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04 }}
    className={`flex flex-col gap-2.5 rounded-xl border p-4 transition-shadow ${
      !mensaje.leido
        ? "border-green-200 bg-green-50/50 shadow-xs"
        : "border-gray-200 bg-white"
    }`}
    aria-label={`Mensaje de ${mensaje.nombre}: ${mensaje.asunto}`}
  >
    {/* Fila 1: nombre + badges */}
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className={`text-sm truncate ${!mensaje.leido ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
          {mensaje.nombre}
        </p>
        <p className="text-xs text-gray-400 truncate">{mensaje.email}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <MensajeEstadoBadge estado={mensaje.estado} />
        {!mensaje.leido && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700">
            <Mail size={11} aria-hidden="true" /> Nuevo
          </span>
        )}
      </div>
    </div>

    {/* Fila 2: asunto + fecha */}
    <div>
      <p className="text-xs font-medium text-gray-700 truncate">{mensaje.asunto}</p>
      <p className="mt-0.5 text-[11px] text-gray-400">{formatFecha(mensaje.fechaEnvio)}</p>
    </div>

    {/* Fila 3: acciones */}
    <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
      <button
        type="button"
        onClick={() => onVerDetalle(mensaje)}
        className="flex flex-1 items-center justify-center gap-1.5 h-8 rounded-lg border border-green-200 bg-green-50 text-xs font-semibold text-green-700 hover:bg-green-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        aria-label={`Ver mensaje de ${mensaje.nombre}`}
      >
        <MailOpen size={13} aria-hidden="true" /> Ver
      </button>

      {mensaje.estado !== "respondido" && mensaje.estado !== "cerrado" && (
        <button
          type="button"
          onClick={() => onResponder(mensaje)}
          className="flex flex-1 items-center justify-center gap-1.5 h-8 rounded-lg border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 hover:bg-blue-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          aria-label={`Responder a ${mensaje.nombre}`}
        >
          <Reply size={13} aria-hidden="true" /> Responder
        </button>
      )}

      {mensaje.estado !== "cerrado" && (
        <ActionBtn onClick={() => onArchivar(mensaje.idMensaje)} label="Archivar" icon={Archive} variant="muted" />
      )}
      <ActionBtn onClick={() => onEliminar(mensaje.idMensaje)} label="Eliminar" icon={Trash2} variant="danger" />
    </div>
  </motion.article>
);

/* ── Componente principal ── */
export const MensajesTable = ({
  mensajes,
  onVerDetalle,
  onResponder,
  onArchivar,
  onEliminar,
}) => {
  const props = { onVerDetalle, onResponder, onArchivar, onEliminar };

  return (
    <>
      {/* Mobile: lista de cards */}
      <div className="flex flex-col gap-2 p-3 md:hidden" role="list" aria-label="Lista de mensajes">
        {mensajes.map((msg, i) => (
          <div key={msg.idMensaje} role="listitem">
            <MensajeCard mensaje={msg} index={i} {...props} />
          </div>
        ))}
      </div>

      {/* Desktop: tabla */}
      <div className="hidden md:block">
        <table className="w-full" aria-label="Tabla de mensajes">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {["Estado", "Remitente", "Asunto", "Fecha", "Acciones"].map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mensajes.map((msg, i) => (
              <TableRow key={msg.idMensaje} mensaje={msg} index={i} {...props} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};