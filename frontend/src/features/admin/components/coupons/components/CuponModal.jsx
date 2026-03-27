import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CuponModal = ({
  isOpen,
  onClose,
  onSubmit,
  clientes = [],
  cargandoClientes = false,
}) => {
  const [segmentoFiltro, setSegmentoFiltro] = useState("todos");
  const [formData, setFormData] = useState({
    codigo: "",
    tipoCupon: "porcentaje",
    valorDescuento: "",
    descripcion: "",
    fechaInicio: "",
    fechaVencimiento: "",
    usoMaximo: "",
    tipoUsuario: "todos",
    montoMinimo: "",
    enviarPorMail: false,
    destinatarios: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      resetForm();
    }
  };

  const resetForm = () => {
    setSegmentoFiltro("todos");
    setFormData({
      codigo: "",
      tipoCupon: "porcentaje",
      valorDescuento: "",
      descripcion: "",
      fechaInicio: "",
      fechaVencimiento: "",
      usoMaximo: "",
      tipoUsuario: "todos",
      montoMinimo: "",
      enviarPorMail: false,
      destinatarios: [],
    });
  };

  const esReciente = (fecha, dias = 30) => {
    if (!fecha) return false;
    const fechaRef = new Date(fecha);
    const hoy = new Date();
    const diffMs = hoy - fechaRef;
    const diffDias = diffMs / (1000 * 60 * 60 * 24);
    return diffDias >= 0 && diffDias <= dias;
  };

  const obtenerSegmentoCliente = (cliente) => {
    const totalCompras = Number(cliente.totalCompras) || 0;
    const totalGastado = Number(cliente.totalGastado) || 0;
    const activoReciente = esReciente(cliente.ultimaCompra, 30);
    const nuevo = totalCompras === 0 || esReciente(cliente.fecha_registro, 30);
    const vip = totalCompras >= 5 || totalGastado >= 150000;

    if (vip) return "vip";
    if (nuevo) return "nuevos";
    if (activoReciente) return "activos_recientes";
    return "general";
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    if (segmentoFiltro === "todos") return true;
    return obtenerSegmentoCliente(cliente) === segmentoFiltro;
  });

  const seleccionarSegmento = () => {
    const idsFiltrados = clientesFiltrados.map((c) => c.idCliente);
    const actuales = Array.isArray(formData.destinatarios)
      ? formData.destinatarios
      : [];
    const unicos = Array.from(new Set([...actuales, ...idsFiltrados]));

    setFormData({
      ...formData,
      destinatarios: unicos,
    });
  };

  const limpiarSeleccion = () => {
    setFormData({
      ...formData,
      destinatarios: [],
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Crear Nuevo Cupón
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Código */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código del Cupón *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    codigo: e.target.value.toUpperCase(),
                  })
                }
                placeholder="Ej: VERANO2026"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                type="text"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descripcion: e.target.value,
                  })
                }
                placeholder="Ej: Descuento especial de verano"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Tipo y Valor */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Descuento *
                </label>
                <select
                  value={formData.tipoCupon}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipoCupon: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="porcentaje">Porcentaje (%)</option>
                  <option value="monto_fijo">Monto Fijo ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor del Descuento *
                </label>
                <input
                  type="number"
                  value={formData.valorDescuento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valorDescuento: e.target.value,
                    })
                  }
                  placeholder={
                    formData.tipoCupon === "porcentaje" ? "10" : "500"
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio *
                </label>
                <input
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fechaInicio: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Vencimiento *
                </label>
                <input
                  type="date"
                  value={formData.fechaVencimiento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fechaVencimiento: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Configuración */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usos Máximos
                </label>
                <input
                  type="number"
                  value={formData.usoMaximo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usoMaximo: e.target.value,
                    })
                  }
                  min="1"
                  placeholder="Ilimitado"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo Usuario
                </label>
                <select
                  value={formData.tipoUsuario}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipoUsuario: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  <option value="nuevo">Nuevos</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Mínimo ($)
                </label>
                <input
                  type="number"
                  value={formData.montoMinimo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      montoMinimo: e.target.value,
                    })
                  }
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enviarPorMail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enviarPorMail: e.target.checked,
                      destinatarios: e.target.checked
                        ? formData.destinatarios
                        : [],
                    })
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enviar este cupon por email
                </span>
              </label>

              {formData.enviarPorMail && (
                <>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.destinatarios === "todos"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destinatarios: e.target.checked ? "todos" : [],
                        })
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">
                      Enviar a todos los clientes activos
                    </span>
                  </label>

                  {formData.destinatarios !== "todos" && (
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <p className="text-sm text-gray-600">
                          Selecciona clientes destinatarios
                        </p>
                        <div className="flex items-center gap-2">
                          <select
                            value={segmentoFiltro}
                            onChange={(e) => setSegmentoFiltro(e.target.value)}
                            className="text-sm px-2 py-1 border border-gray-300 rounded"
                          >
                            <option value="todos">Todos</option>
                            <option value="vip">VIP</option>
                            <option value="nuevos">Nuevos</option>
                            <option value="activos_recientes">
                              Activos recientes
                            </option>
                          </select>
                          <button
                            type="button"
                            onClick={seleccionarSegmento}
                            className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
                          >
                            Seleccionar filtro
                          </button>
                          <button
                            type="button"
                            onClick={limpiarSeleccion}
                            className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        {clientesFiltrados.length} clientes en el filtro,{" "}
                        {Array.isArray(formData.destinatarios)
                          ? formData.destinatarios.length
                          : 0}{" "}
                        seleccionados.
                      </p>
                      <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                        {cargandoClientes ? (
                          <p className="text-sm text-gray-500 px-2 py-1">
                            Cargando clientes...
                          </p>
                        ) : clientesFiltrados.length === 0 ? (
                          <p className="text-sm text-gray-500 px-2 py-1">
                            No hay clientes para este segmento
                          </p>
                        ) : (
                          clientesFiltrados.map((cliente) => {
                            const selected = Array.isArray(
                              formData.destinatarios,
                            )
                              ? formData.destinatarios.includes(
                                  cliente.idCliente,
                                )
                              : false;

                            return (
                              <label
                                key={cliente.idCliente}
                                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={(e) => {
                                    const current = Array.isArray(
                                      formData.destinatarios,
                                    )
                                      ? formData.destinatarios
                                      : [];

                                    const destinatarios = e.target.checked
                                      ? [...current, cliente.idCliente]
                                      : current.filter(
                                          (id) => id !== cliente.idCliente,
                                        );

                                    setFormData({
                                      ...formData,
                                      destinatarios,
                                    });
                                  }}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm text-gray-700">
                                  {cliente.nombreCliente}{" "}
                                  {cliente.apellidoCliente} (
                                  {cliente.emailCliente})
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Botones */}
            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Crear Cupón
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
