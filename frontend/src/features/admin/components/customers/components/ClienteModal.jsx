import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, CreditCard, Lock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export const ClienteModal = ({
  isOpen,
  onClose,
  onGuardar,
  clienteEditar = null,
}) => {
  const esEdicion = !!clienteEditar;

  const [formData, setFormData] = useState({
    nombreCliente: "",
    apellidoCliente: "",
    dniCliente: "",
    emailCliente: "",
    contraCliente: "",
  });

  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (clienteEditar) {
      setFormData({
        nombreCliente: clienteEditar.nombreCliente || "",
        apellidoCliente: clienteEditar.apellidoCliente || "",
        dniCliente: clienteEditar.dni || "",
        emailCliente: clienteEditar.emailCliente || "",
        contraCliente: "",
      });
    } else {
      setFormData({
        nombreCliente: "",
        apellidoCliente: "",
        dniCliente: "",
        emailCliente: "",
        contraCliente: "",
      });
    }
    setErrores({});
  }, [clienteEditar, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreCliente.trim()) {
      nuevosErrores.nombreCliente = "El nombre es obligatorio";
    }
    if (!formData.apellidoCliente.trim()) {
      nuevosErrores.apellidoCliente = "El apellido es obligatorio";
    }
    if (!formData.dniCliente.trim()) {
      nuevosErrores.dniCliente = "El DNI es obligatorio";
    } else if (!/^\d{7,8}$/.test(formData.dniCliente)) {
      nuevosErrores.dniCliente = "DNI invalido (7-8 digitos)";
    }
    if (!formData.emailCliente.trim()) {
      nuevosErrores.emailCliente = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailCliente)) {
      nuevosErrores.emailCliente = "Email invalido";
    }
    if (!esEdicion && !formData.contraCliente.trim()) {
      nuevosErrores.contraCliente = "La contrasena es obligatoria";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setEnviando(true);
    const exito = await onGuardar(formData, clienteEditar?.idCliente);
    setEnviando(false);

    if (exito) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cliente-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white shrink-0">
                <User size={17} aria-hidden="true" />
              </span>
              <div>
                <h2 id="cliente-modal-title" className="text-base font-semibold text-gray-900">
                  {esEdicion ? "Editar Cliente" : "Nuevo Cliente"}
                </h2>
                <p className="text-xs text-gray-500">
                  {esEdicion ? "Modifica los datos del cliente" : "Completa los datos para registrar un cliente"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Nombre *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="text"
                    name="nombreCliente"
                    value={formData.nombreCliente}
                    onChange={handleChange}
                    placeholder="Ej: Maria"
                    className={`w-full h-10 pl-9 pr-3 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15 ${
                      errores.nombreCliente
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {errores.nombreCliente && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errores.nombreCliente}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Apellido *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="text"
                    name="apellidoCliente"
                    value={formData.apellidoCliente}
                    onChange={handleChange}
                    placeholder="Ej: Gomez"
                    className={`w-full h-10 pl-9 pr-3 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15 ${
                      errores.apellidoCliente
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {errores.apellidoCliente && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errores.apellidoCliente}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                DNI *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  name="dniCliente"
                  value={formData.dniCliente}
                  onChange={handleChange}
                  placeholder="12345678"
                  maxLength={8}
                  className={`w-full h-10 pl-9 pr-3 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15 ${
                    errores.dniCliente
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errores.dniCliente && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errores.dniCliente}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={16} />
                </div>
                <input
                  type="email"
                  name="emailCliente"
                  value={formData.emailCliente}
                  onChange={handleChange}
                  placeholder="maria@email.com"
                  className={`w-full h-10 pl-9 pr-3 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15 ${
                    errores.emailCliente
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errores.emailCliente && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errores.emailCliente}
                </p>
              )}
            </div>

            {!esEdicion && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Contrasena *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="password"
                    name="contraCliente"
                    value={formData.contraCliente}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full h-10 pl-9 pr-3 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15 ${
                      errores.contraCliente
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {errores.contraCliente && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errores.contraCliente}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={enviando}
                className="h-9 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="h-9 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                {enviando
                  ? "Guardando..."
                  : esEdicion
                    ? "Actualizar"
                    : "Crear cliente"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
