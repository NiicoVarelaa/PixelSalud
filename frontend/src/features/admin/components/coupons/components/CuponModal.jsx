import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Mail, Users, CheckSquare2, Square, Loader2 } from "lucide-react";

/* ── Campo reutilizable ── */
const Field = ({ label, required, htmlFor, children }) => (
  <div>
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-gray-600">
      {label}
      {required && <span className="ml-0.5 text-red-400" aria-hidden="true">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 disabled:opacity-50";

const selectCls = `${inputCls} cursor-pointer`;

export const CuponModal = ({
  isOpen,
  onClose,
  onSubmit,
  clientes = [],
  cargandoClientes = false,
}) => {
  const closeRef = useRef(null);
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

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

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

  const handleClose = () => { resetForm(); onClose(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit(formData);
    if (ok) resetForm();
  };

  const set = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  /* ── Lógica de destinatarios (igual que original) ── */
  const esReciente = (fecha, dias = 30) => {
    if (!fecha) return false;
    const diff = (new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= dias;
  };

  const obtenerSegmento = (c) => {
    const total  = Number(c.totalCompras) || 0;
    const gasto  = Number(c.totalGastado) || 0;
    const vip    = total >= 5 || gasto >= 150000;
    const nuevo  = total === 0 || esReciente(c.fecha_registro, 30);
    const activo = esReciente(c.ultimaCompra, 30);
    if (vip)    return "vip";
    if (nuevo)  return "nuevos";
    if (activo) return "activos_recientes";
    return "general";
  };

  const clientesFiltrados = clientes.filter((c) =>
    segmentoFiltro === "todos" ? true : obtenerSegmento(c) === segmentoFiltro,
  );

  const seleccionarSegmento = () => {
    const ids = clientesFiltrados.map((c) => c.idCliente);
    const actuales = Array.isArray(formData.destinatarios) ? formData.destinatarios : [];
    set("destinatarios", Array.from(new Set([...actuales, ...ids])));
  };

  const limpiarSeleccion = () => set("destinatarios", []);

  const toggleDestinatario = (id, checked) => {
    const current = Array.isArray(formData.destinatarios) ? formData.destinatarios : [];
    set("destinatarios", checked ? [...current, id] : current.filter((x) => x !== id));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cupon-modal-title"
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <Tag size={17} className="text-green-700" aria-hidden="true" />
              </div>
              <div>
                <h2 id="cupon-modal-title" className="text-sm font-semibold text-gray-900 leading-none">
                  Crear cupón
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">Completá los datos del nuevo cupón</p>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label="Cerrar modal"
            >
              <X size={17} />
            </button>
          </div>

          {/* Body */}
          <form
            id="form-cupon"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
          >
            {/* ── Sección básica ── */}
            <section aria-label="Datos básicos">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Datos básicos
              </p>
              <div className="space-y-3">
                <Field label="Código" required htmlFor="codigo">
                  <input
                    id="codigo"
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => set("codigo", e.target.value.toUpperCase())}
                    placeholder="Ej: VERANO2026"
                    className={`${inputCls} font-mono tracking-widest`}
                    required
                    aria-required="true"
                  />
                </Field>
                <Field label="Descripción" htmlFor="descripcion">
                  <input
                    id="descripcion"
                    type="text"
                    value={formData.descripcion}
                    onChange={(e) => set("descripcion", e.target.value)}
                    placeholder="Ej: Descuento especial de verano"
                    className={inputCls}
                  />
                </Field>
              </div>
            </section>

            <div className="border-t border-gray-100" aria-hidden="true" />

            {/* ── Descuento ── */}
            <section aria-label="Configuración del descuento">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Descuento
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tipo" required htmlFor="tipo-cupon">
                  <select
                    id="tipo-cupon"
                    value={formData.tipoCupon}
                    onChange={(e) => set("tipoCupon", e.target.value)}
                    className={selectCls}
                    required
                  >
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="monto_fijo">Monto fijo ($)</option>
                  </select>
                </Field>
                <Field
                  label={formData.tipoCupon === "porcentaje" ? "Valor (%)" : "Valor ($)"}
                  required
                  htmlFor="valor-descuento"
                >
                  <input
                    id="valor-descuento"
                    type="number"
                    value={formData.valorDescuento}
                    onChange={(e) => set("valorDescuento", e.target.value)}
                    placeholder={formData.tipoCupon === "porcentaje" ? "10" : "500"}
                    min="0"
                    className={inputCls}
                    required
                    aria-required="true"
                  />
                </Field>
              </div>
            </section>

            <div className="border-t border-gray-100" aria-hidden="true" />

            {/* ── Vigencia ── */}
            <section aria-label="Vigencia del cupón">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Vigencia
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha inicio" required htmlFor="fecha-inicio">
                  <input
                    id="fecha-inicio"
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => set("fechaInicio", e.target.value)}
                    className={selectCls}
                    required
                    aria-required="true"
                  />
                </Field>
                <Field label="Fecha vencimiento" required htmlFor="fecha-vto">
                  <input
                    id="fecha-vto"
                    type="date"
                    value={formData.fechaVencimiento}
                    onChange={(e) => set("fechaVencimiento", e.target.value)}
                    className={selectCls}
                    required
                    aria-required="true"
                  />
                </Field>
              </div>
            </section>

            <div className="border-t border-gray-100" aria-hidden="true" />

            {/* ── Restricciones ── */}
            <section aria-label="Restricciones del cupón">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Restricciones
              </p>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Usos máx." htmlFor="uso-maximo">
                  <input
                    id="uso-maximo"
                    type="number"
                    value={formData.usoMaximo}
                    onChange={(e) => set("usoMaximo", e.target.value)}
                    min="1"
                    placeholder="Ilimitado"
                    className={inputCls}
                  />
                </Field>
                <Field label="Audiencia" htmlFor="tipo-usuario">
                  <select
                    id="tipo-usuario"
                    value={formData.tipoUsuario}
                    onChange={(e) => set("tipoUsuario", e.target.value)}
                    className={selectCls}
                  >
                    <option value="todos">Todos</option>
                    <option value="nuevo">Nuevos</option>
                    <option value="vip">VIP</option>
                  </select>
                </Field>
                <Field label="Monto mín. ($)" htmlFor="monto-minimo">
                  <input
                    id="monto-minimo"
                    type="number"
                    value={formData.montoMinimo}
                    onChange={(e) => set("montoMinimo", e.target.value)}
                    min="0"
                    placeholder="0"
                    className={inputCls}
                  />
                </Field>
              </div>
            </section>

            <div className="border-t border-gray-100" aria-hidden="true" />

            {/* ── Envío por email ── */}
            <section aria-label="Envío por email">
              <label className="flex cursor-pointer items-center gap-3">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.enviarPorMail}
                    onChange={(e) => set("enviarPorMail", e.target.checked)}
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
                  {/* Enviar a todos */}
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={formData.destinatarios === "todos"}
                      onChange={(e) => set("destinatarios", e.target.checked ? "todos" : [])}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-xs font-medium text-gray-700">
                      Enviar a todos los clientes activos
                    </span>
                  </label>

                  {formData.destinatarios !== "todos" && (
                    <div>
                      {/* Controles de segmento */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Users size={13} className="text-gray-400 shrink-0" aria-hidden="true" />
                        <select
                          value={segmentoFiltro}
                          onChange={(e) => setSegmentoFiltro(e.target.value)}
                          className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 cursor-pointer focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
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
                          className="h-8 rounded-lg border border-green-200 bg-green-50 px-3 text-xs font-semibold text-green-700 hover:bg-green-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                        >
                          Seleccionar segmento
                        </button>
                        {Array.isArray(formData.destinatarios) && formData.destinatarios.length > 0 && (
                          <button
                            type="button"
                            onClick={limpiarSeleccion}
                            className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 hover:bg-gray-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                          >
                            Limpiar
                          </button>
                        )}
                      </div>

                      <p className="mb-2 text-xs text-gray-400">
                        {clientesFiltrados.length} en el filtro ·{" "}
                        <span className="font-semibold text-gray-700">
                          {Array.isArray(formData.destinatarios) ? formData.destinatarios.length : 0}
                        </span>{" "}
                        seleccionados
                      </p>

                      {/* Lista de clientes */}
                      <div
                        className="max-h-44 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-1.5 space-y-0.5"
                        role="listbox"
                        aria-label="Clientes destinatarios"
                        aria-multiselectable="true"
                      >
                        {cargandoClientes ? (
                          <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500">
                            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
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
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-pointer hover:bg-white transition-colors"
                                role="option"
                                aria-selected={selected}
                              >
                                {selected
                                  ? <CheckSquare2 size={15} className="shrink-0 text-green-600" aria-hidden="true" />
                                  : <Square size={15} className="shrink-0 text-gray-300" aria-hidden="true" />
                                }
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={(e) => toggleDestinatario(cliente.idCliente, e.target.checked)}
                                  className="sr-only"
                                />
                                <span className="text-xs text-gray-700 truncate">
                                  {cliente.nombreCliente} {cliente.apellidoCliente}{" "}
                                  <span className="text-gray-400">({cliente.emailCliente})</span>
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
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3.5 flex-shrink-0 bg-gray-50/70">
            <button
              type="button"
              onClick={handleClose}
              className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-cupon"
              className="h-9 px-5 rounded-lg bg-green-600 hover:bg-green-700 text-sm font-semibold text-white active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              Crear cupón
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};