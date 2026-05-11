import { createElement } from "react";
import { MailOpen, Reply, Archive, Trash2, AlertCircle } from "lucide-react";
import { MensajeEstadoBadge } from "./MensajeEstadoBadge";
import { formatFecha } from "../utils/helpers";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

const ActionBtn = ({ onClick, label, icon, variant = "default" }) => {
  const variants = {
    default:
      "bg-gray-100 text-gray-600 hover:bg-gray-200 focus-visible:ring-gray-500",
    primary:
      "bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500",
    info: "bg-blue-100 text-blue-700 hover:bg-blue-200 focus-visible:ring-blue-500",
    danger:
      "bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`p-2 rounded-lg ${variants[variant]} ${baseBtn}`}
    >
      {createElement(icon, { size: 16, "aria-hidden": "true" })}
    </button>
  );
};

export const MensajesTable = ({
  mensajes,
  onVerDetalle,
  onResponder,
  onArchivar,
  onEliminar,
}) => {
  return (
    <>
      <div className="md:hidden space-y-2.5">
        {mensajes.map((msg) => (
          <article
            key={msg.idMensaje}
            className={`overflow-hidden rounded-xl border bg-white ${
              !msg.leido ? "border-green-200" : "border-gray-100"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={`text-sm ${!msg.leido ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                    {msg.nombre}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                </div>
                <MensajeEstadoBadge estado={msg.estado} />
              </div>

              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700 truncate">
                  {msg.asunto}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {formatFecha(msg.fechaEnvio)}
                </p>
              </div>
            </div>

            <div className="flex gap-1 border-t border-gray-100 bg-gray-50 p-2 justify-end">
              <ActionBtn
                onClick={() => onVerDetalle(msg)}
                label="Ver mensaje"
                icon={MailOpen}
                variant="primary"
              />
              {msg.estado !== "respondido" && msg.estado !== "cerrado" && (
                <ActionBtn
                  onClick={() => onResponder(msg)}
                  label="Responder"
                  icon={Reply}
                  variant="info"
                />
              )}
              {msg.estado !== "cerrado" && (
                <ActionBtn
                  onClick={() => onArchivar(msg.idMensaje)}
                  label="Archivar"
                  icon={Archive}
                  variant="default"
                />
              )}
              <ActionBtn
                onClick={() => onEliminar(msg.idMensaje)}
                label="Eliminar"
                icon={Trash2}
                variant="danger"
              />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mt-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Remitente
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Asunto
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mensajes.map((msg) => (
                  <tr
                    key={msg.idMensaje}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${!msg.leido ? "bg-green-50/40" : ""}`}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col gap-1.5">
                        <MensajeEstadoBadge estado={msg.estado} />
                        {!msg.leido && msg.estado === "nuevo" && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                            <AlertCircle size={11} />
                            Nuevo
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-2.5">
                      <p className={`text-sm ${!msg.leido ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                        {msg.nombre}
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-40">
                        {msg.email}
                      </p>
                    </td>

                    <td className="px-3 py-2.5">
                      <p className="truncate max-w-[220px] text-sm text-gray-700">
                        {msg.asunto}
                      </p>
                    </td>

                    <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-400">
                      {formatFecha(msg.fechaEnvio)}
                    </td>

                    <td className="px-3 py-3 whitespace-nowrap text-right">
                      <div className="flex gap-2 justify-end">
                        <ActionBtn
                          onClick={() => onVerDetalle(msg)}
                          label="Ver mensaje"
                          icon={MailOpen}
                          variant="primary"
                        />
                        {msg.estado !== "respondido" && msg.estado !== "cerrado" && (
                          <ActionBtn
                            onClick={() => onResponder(msg)}
                            label="Responder"
                            icon={Reply}
                            variant="info"
                          />
                        )}
                        {msg.estado !== "cerrado" && (
                          <ActionBtn
                            onClick={() => onArchivar(msg.idMensaje)}
                            label="Archivar"
                            icon={Archive}
                            variant="default"
                          />
                        )}
                        <ActionBtn
                          onClick={() => onEliminar(msg.idMensaje)}
                          label="Eliminar"
                          icon={Trash2}
                          variant="danger"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
