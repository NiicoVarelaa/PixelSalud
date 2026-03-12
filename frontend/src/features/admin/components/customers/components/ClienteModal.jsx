import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, CreditCard, Lock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Modal para crear o editar un cliente
 * Maneja validación de formulario y envío de datos
 */
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

  // Cargar datos del cliente al editar
  useEffect(() => {
    if (clienteEditar) {
      setFormData({
        nombreCliente: clienteEditar.nombreCliente || "",
        apellidoCliente: clienteEditar.apellidoCliente || "",
        dniCliente: clienteEditar.dni || "",
        emailCliente: clienteEditar.emailCliente || "",
        contraCliente: "", // No prellenamos la contraseña en edición
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
    // Limpiar error del campo al escribir
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
      nuevosErrores.dniCliente = "DNI inválido (7-8 dígitos)";
    }
    if (!formData.emailCliente.trim()) {
      nuevosErrores.emailCliente = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailCliente)) {
      nuevosErrores.emailCliente = "Email inválido";
    }
    if (!esEdicion && !formData.contraCliente.trim()) {
      nuevosErrores.contraCliente = "La contraseña es obligatoria";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <User className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {esEdicion ? "Editar Cliente" : "Nuevo Cliente"}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4 max-h-[calc(90vh-180px)] overflow-y-auto">
                  {/* Nombre y Apellido */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                        Nombre *
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="text"
                          name="nombreCliente"
                          value={formData.nombreCliente}
                          onChange={handleChange}
                          placeholder="Ej: María"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errores.nombreCliente
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
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
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                        Apellido *
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="text"
                          name="apellidoCliente"
                          value={formData.apellidoCliente}
                          onChange={handleChange}
                          placeholder="Ej: Gómez"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errores.apellidoCliente
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
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

                  {/* DNI */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                      DNI *
                    </label>
                    <div className="relative">
                      <CreditCard
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="dniCliente"
                        value={formData.dniCliente}
                        onChange={handleChange}
                        placeholder="12345678"
                        maxLength={8}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errores.dniCliente
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-green-500"
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

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="email"
                        name="emailCliente"
                        value={formData.emailCliente}
                        onChange={handleChange}
                        placeholder="maria@email.com"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errores.emailCliente
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-green-500"
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

                  {/* Contraseña (solo en creación) */}
                  {!esEdicion && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                        Contraseña *
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="password"
                          name="contraCliente"
                          value={formData.contraCliente}
                          onChange={handleChange}
                          placeholder="*******"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errores.contraCliente
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
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
                </div>

                {/* Botones */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={enviando}
                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 shadow-lg"
                  >
                    {enviando
                      ? "Guardando..."
                      : esEdicion
                        ? "Actualizar Cliente"
                        : "Crear Cliente"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
