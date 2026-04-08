import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, CreditCard, Lock, AlertCircle, UserPlus, UserCog } from "lucide-react";
import { PermisosSection } from "./PermisosSection";

/* ── Campo reutilizable con error inline ── */
const Field = ({ label, required, htmlFor, error, icon: Icon, children }) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-semibold text-gray-600"
    >
      {label}
      {required && <span className="ml-0.5 text-red-400" aria-hidden="true">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
    {error && (
      <p
        role="alert"
        className="mt-1 flex items-center gap-1 text-[11px] text-red-600"
      >
        <AlertCircle size={11} aria-hidden="true" />
        {error}
      </p>
    )}
  </div>
);

const inputCls = (hasIcon, hasError) =>
  `w-full h-10 rounded-lg border bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
    hasIcon ? "pl-8.5 pr-3" : "px-3"
  } ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-green-500 focus:ring-green-100"
  }`;

const FORM_INIT = {
  nombreEmpleado: "",
  apellidoEmpleado: "",
  dniEmpleado: "",
  emailEmpleado: "",
  contraEmpleado: "",
  permisos: {
    crear_productos:    false,
    modificar_productos:false,
    modificar_ventasE:  false,
    ver_ventasTotalesE: false,
  },
};

export const EmpleadoModal = ({
  isOpen,
  onClose,
  onGuardar,
  empleadoEditar = null,
}) => {
  const esEdicion = !!empleadoEditar;
  const closeRef  = useRef(null);

  const [formData, setFormData] = useState(FORM_INIT);
  const [errores,  setErrores]  = useState({});
  const [enviando, setEnviando] = useState(false);

  /* Foco + overflow + Escape */
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  /* Cargar datos al editar */
  useEffect(() => {
    if (empleadoEditar) {
      setFormData({
        nombreEmpleado:    empleadoEditar.nombreEmpleado    || "",
        apellidoEmpleado:  empleadoEditar.apellidoEmpleado  || "",
        dniEmpleado:       empleadoEditar.dniEmpleado       || "",
        emailEmpleado:     empleadoEditar.emailEmpleado     || "",
        contraEmpleado:    "",
        permisos: {
          crear_productos:    empleadoEditar.crear_productos    === 1 || empleadoEditar.crear_productos    === true,
          modificar_productos:empleadoEditar.modificar_productos=== 1 || empleadoEditar.modificar_productos=== true,
          modificar_ventasE:  empleadoEditar.modificar_ventasE  === 1 || empleadoEditar.modificar_ventasE  === true,
          ver_ventasTotalesE: empleadoEditar.ver_ventasTotalesE === 1 || empleadoEditar.ver_ventasTotalesE === true,
        },
      });
    } else {
      setFormData(FORM_INIT);
    }
    setErrores({});
  }, [empleadoEditar, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePermisoChange = (permiso, checked) =>
    setFormData((prev) => ({
      ...prev,
      permisos: { ...prev.permisos, [permiso]: checked },
    }));

  const validar = () => {
    const e = {};
    if (!formData.nombreEmpleado.trim())    e.nombreEmpleado   = "El nombre es obligatorio";
    if (!formData.apellidoEmpleado.trim())  e.apellidoEmpleado = "El apellido es obligatorio";
    if (!formData.dniEmpleado.trim())       e.dniEmpleado      = "El DNI es obligatorio";
    if (!formData.emailEmpleado.trim())     e.emailEmpleado    = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailEmpleado))
                                            e.emailEmpleado    = "Email inválido";
    if (!esEdicion && !formData.contraEmpleado.trim())
                                            e.contraEmpleado   = "La contraseña es obligatoria";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    const ok = await onGuardar(formData, empleadoEditar?.idEmpleado);
    setEnviando(false);
    if (ok) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="empleado-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
            className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl max-h-[92vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100">
                  {esEdicion
                    ? <UserCog size={17} className="text-green-700" aria-hidden="true" />
                    : <UserPlus size={17} className="text-green-700" aria-hidden="true" />
                  }
                </div>
                <div>
                  <h2 id="empleado-modal-title" className="text-sm font-semibold text-gray-900 leading-none">
                    {esEdicion ? "Editar empleado" : "Nuevo empleado"}
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {esEdicion ? "Modificá los datos del empleado" : "Completá los datos para registrar"}
                  </p>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                disabled={enviando}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="Cerrar modal"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <form
              id="form-empleado"
              onSubmit={handleSubmit}
              noValidate
              className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
            >
              {/* ── Datos personales ── */}
              <section aria-label="Datos personales">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Datos personales
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Nombre" required htmlFor="nombre"
                    error={errores.nombreEmpleado} icon={User}
                  >
                    <input
                      id="nombre"
                      type="text"
                      name="nombreEmpleado"
                      value={formData.nombreEmpleado}
                      onChange={handleChange}
                      placeholder="Ej: Juan"
                      className={inputCls(true, !!errores.nombreEmpleado)}
                      aria-required="true"
                      aria-invalid={!!errores.nombreEmpleado}
                      aria-describedby={errores.nombreEmpleado ? "err-nombre" : undefined}
                    />
                  </Field>
                  <Field
                    label="Apellido" required htmlFor="apellido"
                    error={errores.apellidoEmpleado} icon={User}
                  >
                    <input
                      id="apellido"
                      type="text"
                      name="apellidoEmpleado"
                      value={formData.apellidoEmpleado}
                      onChange={handleChange}
                      placeholder="Ej: Pérez"
                      className={inputCls(true, !!errores.apellidoEmpleado)}
                      aria-required="true"
                      aria-invalid={!!errores.apellidoEmpleado}
                    />
                  </Field>
                  <Field
                    label="DNI" required htmlFor="dni"
                    error={errores.dniEmpleado} icon={CreditCard}
                  >
                    <input
                      id="dni"
                      type="number"
                      name="dniEmpleado"
                      value={formData.dniEmpleado}
                      onChange={handleChange}
                      placeholder="30123456"
                      className={inputCls(true, !!errores.dniEmpleado)}
                      aria-required="true"
                      aria-invalid={!!errores.dniEmpleado}
                    />
                  </Field>
                  <Field
                    label="Email" required htmlFor="email"
                    error={errores.emailEmpleado} icon={Mail}
                  >
                    <input
                      id="email"
                      type="email"
                      name="emailEmpleado"
                      value={formData.emailEmpleado}
                      onChange={handleChange}
                      autoComplete="off"
                      placeholder="juan@farmacia.com"
                      className={inputCls(true, !!errores.emailEmpleado)}
                      aria-required="true"
                      aria-invalid={!!errores.emailEmpleado}
                    />
                  </Field>
                </div>
              </section>

              <div className="border-t border-gray-100" aria-hidden="true" />

              {/* ── Contraseña ── */}
              <section aria-label="Contraseña">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {esEdicion ? "Cambiar contraseña" : "Contraseña"}
                </p>

                {esEdicion && (
                  <div className="mb-3 flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5">
                    <AlertCircle size={14} className="shrink-0 text-orange-600" aria-hidden="true" />
                    <p className="text-xs text-orange-700">
                      Dejá vacío para no modificar la contraseña actual.
                    </p>
                  </div>
                )}

                <Field
                  label={esEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
                  required={!esEdicion}
                  htmlFor="contra"
                  error={errores.contraEmpleado}
                  icon={Lock}
                >
                  <input
                    id="contra"
                    type="password"
                    name="contraEmpleado"
                    value={formData.contraEmpleado}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder={esEdicion ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"}
                    className={inputCls(true, !!errores.contraEmpleado)}
                    aria-required={!esEdicion}
                    aria-invalid={!!errores.contraEmpleado}
                  />
                </Field>
              </section>

              <div className="border-t border-gray-100" aria-hidden="true" />

              {/* ── Permisos ── */}
              <section aria-label="Permisos del empleado">
                <PermisosSection
                  permisos={formData.permisos}
                  onChange={handlePermisoChange}
                />
              </section>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3.5 flex-shrink-0 bg-gray-50/70">
              <button
                type="button"
                onClick={onClose}
                disabled={enviando}
                className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="form-empleado"
                disabled={enviando}
                className="h-9 px-5 rounded-lg bg-green-600 hover:bg-green-700 text-sm font-semibold text-white disabled:opacity-40 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                {enviando
                  ? "Guardando..."
                  : esEdicion ? "Guardar cambios" : "Crear empleado"
                }
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};