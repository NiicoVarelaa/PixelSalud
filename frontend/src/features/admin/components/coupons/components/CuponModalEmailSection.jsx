import { motion } from "framer-motion";
import { Mail, Users, CheckSquare2, Square, Loader2 } from "lucide-react";

export const CuponModalEmailSection = ({
  formData,
  setField,
  segmentoFiltro,
  setSegmentoFiltro,
  seleccionarSegmento,
  limpiarSeleccion,
  clientesFiltrados,
  cargandoClientes,
  toggleDestinatario,
}) => {
  return (
    <section aria-label="Envío por email">
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={formData.enviarPorMail}
            onChange={(e) => setField("enviarPorMail", e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-gray-400" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-700">
            Enviar este cupón por email
          </span>
        </div>
      </label>

      {formData.enviarPorMail && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 space-y-3"
        >
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
            <input
              type="checkbox"
              checked={formData.destinatarios === "todos"}
              onChange={(e) =>
                setField("destinatarios", e.target.checked ? "todos" : [])
              }
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-xs font-medium text-gray-700">
              Enviar a todos los clientes activos
            </span>
          </label>

          {formData.destinatarios !== "todos" && (
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Users
                  size={13}
                  className="shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <select
                  value={segmentoFiltro}
                  onChange={(e) => setSegmentoFiltro(e.target.value)}
                  className="h-8 cursor-pointer rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-100"
                  aria-label="Filtrar clientes por segmento"
                >
                  <option value="todos">Todos</option>
                  <option value="vip">VIP</option>
                  <option value="nuevos">Nuevos</option>
                  <option value="activos_recientes">Activos recientes</option>
                </select>
                <button
                  type="button"
                  onClick={seleccionarSegmento}
                  className="h-8 rounded-lg border border-green-200 bg-green-50 px-3 text-xs font-semibold text-green-700 transition-all hover:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 active:scale-95"
                >
                  Seleccionar segmento
                </button>
                {Array.isArray(formData.destinatarios) &&
                  formData.destinatarios.length > 0 && (
                    <button
                      type="button"
                      onClick={limpiarSeleccion}
                      className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 active:scale-95"
                    >
                      Limpiar
                    </button>
                  )}
              </div>

              <p className="mb-2 text-xs text-gray-400">
                {clientesFiltrados.length} en el filtro ·{" "}
                <span className="font-semibold text-gray-700">
                  {Array.isArray(formData.destinatarios)
                    ? formData.destinatarios.length
                    : 0}
                </span>{" "}
                seleccionados
              </p>

              <div
                className="max-h-44 space-y-0.5 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-1.5"
                role="listbox"
                aria-label="Clientes destinatarios"
                aria-multiselectable="true"
              >
                {cargandoClientes ? (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500">
                    <Loader2
                      size={13}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    Cargando clientes...
                  </div>
                ) : clientesFiltrados.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-gray-400">
                    No hay clientes en este segmento
                  </p>
                ) : (
                  clientesFiltrados.map((cliente) => {
                    const selected = Array.isArray(formData.destinatarios)
                      ? formData.destinatarios.includes(cliente.idCliente)
                      : false;

                    return (
                      <label
                        key={cliente.idCliente}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-white"
                        role="option"
                        aria-selected={selected}
                      >
                        {selected ? (
                          <CheckSquare2
                            size={15}
                            className="shrink-0 text-green-600"
                            aria-hidden="true"
                          />
                        ) : (
                          <Square
                            size={15}
                            className="shrink-0 text-gray-300"
                            aria-hidden="true"
                          />
                        )}
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) =>
                            toggleDestinatario(
                              cliente.idCliente,
                              e.target.checked,
                            )
                          }
                          className="sr-only"
                        />
                        <span className="truncate text-xs text-gray-700">
                          {cliente.nombreCliente} {cliente.apellidoCliente}{" "}
                          <span className="text-gray-400">
                            ({cliente.emailCliente})
                          </span>
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
};
