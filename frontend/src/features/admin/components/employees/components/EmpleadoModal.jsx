import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  CreditCard,
  Lock,
  AlertCircle,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PermisosSection } from "./PermisosSection";

/**
 * Modal para crear o editar un empleado
 * Maneja validación de formulario, permisos y envío de datos
 */
export const EmpleadoModal = ({
  isOpen,
  onClose,
  onGuardar,
  empleadoEditar = null,
}) => {
  const esEdicion = !!empleadoEditar;

  const [formData, setFormData] = useState({
    nombreEmpleado: "",
    apellidoEmpleado: "",
    dniEmpleado: "",
    emailEmpleado: "",
    contraEmpleado: "",
    permisos: {
      crear_productos: false,
      modificar_productos: false,
      modificar_ventasE: false,
      ver_ventasTotalesE: false,
    },
  });

  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Cargar datos del empleado al editar
  useEffect(() => {
    if (empleadoEditar) {
      setFormData({
        nombreEmpleado: empleadoEditar.nombreEmpleado || "",
        apellidoEmpleado: empleadoEditar.apellidoEmpleado || "",
        dniEmpleado: empleadoEditar.dniEmpleado || "",
        emailEmpleado: empleadoEditar.emailEmpleado || "",
        contraEmpleado: "", // No prellenamos la contraseña en edición
        permisos: {
          crear_productos:
            empleadoEditar.crear_productos === 1 ||
            empleadoEditar.crear_productos === true,
          modificar_productos:
            empleadoEditar.modificar_productos === 1 ||
            empleadoEditar.modificar_productos === true,
          modificar_ventasE:
            empleadoEditar.modificar_ventasE === 1 ||
            empleadoEditar.modificar_ventasE === true,
          ver_ventasTotalesE:
            empleadoEditar.ver_ventasTotalesE === 1 ||
            empleadoEditar.ver_ventasTotalesE === true,
        },
      });
    } else {
      setFormData({
        nombreEmpleado: "",
        apellidoEmpleado: "",
        dniEmpleado: "",
        emailEmpleado: "",
        contraEmpleado: "",
        permisos: {
          crear_productos: false,
          modificar_productos: false,
          modificar_ventasE: false,
          ver_ventasTotalesE: false,
        },
      });
    }
    setErrores({});
  }, [empleadoEditar, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePermisoChange = (permiso, checked) => {
    setFormData((prev) => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [permiso]: checked,
      },
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreEmpleado.trim()) {
      nuevosErrores.nombreEmpleado = "El nombre es obligatorio";
    }
    if (!formData.apellidoEmpleado.trim()) {
      nuevosErrores.apellidoEmpleado = "El apellido es obligatorio";
    }
    if (!formData.dniEmpleado.trim()) {
      nuevosErrores.dniEmpleado = "El DNI es obligatorio";
    }
    if (!formData.emailEmpleado.trim()) {
      nuevosErrores.emailEmpleado = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailEmpleado)) {
      nuevosErrores.emailEmpleado = "Email inválido";
    }
    if (!esEdicion && !formData.contraEmpleado.trim()) {
      nuevosErrores.contraEmpleado = "La contraseña es obligatoria";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setEnviando(true);
    const exito = await onGuardar(formData, empleadoEditar?.idEmpleado);
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <User className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {esEdicion ? "Editar Empleado" : "Nuevo Empleado"}
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
                <div className="space-y-4 max-h-[calc(90vh-180px)] overflow-y-auto pr-2">
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
                          name="nombreEmpleado"
                          value={formData.nombreEmpleado}
                          onChange={handleChange}
                          placeholder="Ej: Juan"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errores.nombreEmpleado
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        />
                      </div>
                      {errores.nombreEmpleado && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errores.nombreEmpleado}
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
                          name="apellidoEmpleado"
                          value={formData.apellidoEmpleado}
                          onChange={handleChange}
                          placeholder="Ej: Pérez"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errores.apellidoEmpleado
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        />
                      </div>
                      {errores.apellidoEmpleado && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errores.apellidoEmpleado}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* DNI y Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          type="number"
                          name="dniEmpleado"
                          value={formData.dniEmpleado}
                          onChange={handleChange}
                          placeholder="30123456"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errores.dniEmpleado
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        />
                      </div>
                      {errores.dniEmpleado && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errores.dniEmpleado}
                        </p>
                      )}
                    </div>

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
                          name="emailEmpleado"
                          value={formData.emailEmpleado}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="juan@farmacia.com"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errores.emailEmpleado
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        />
                      </div>
                      {errores.emailEmpleado && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errores.emailEmpleado}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div
                    className={
                      esEdicion
                        ? "bg-yellow-50 p-4 rounded-lg border border-yellow-200"
                        : ""
                    }
                  >
                    <label
                      className={`block text-sm font-bold mb-2 uppercase ${esEdicion ? "text-yellow-700" : "text-gray-700"}`}
                    >
                      {esEdicion
                        ? "Nueva Contraseña (Opcional)"
                        : "Contraseña *"}
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        name="contraEmpleado"
                        value={formData.contraEmpleado}
                        onChange={handleChange}
                        autoComplete="new-password"
                        placeholder={
                          esEdicion ? "Dejar vacío para no cambiar" : "*******"
                        }
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errores.contraEmpleado
                            ? "border-red-500 focus:ring-red-500"
                            : esEdicion
                              ? "border-yellow-300 focus:ring-yellow-500 bg-white"
                              : "border-gray-300 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    {errores.contraEmpleado && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errores.contraEmpleado}
                      </p>
                    )}
                  </div>

                  {/* Sección de Permisos */}
                  <PermisosSection
                    permisos={formData.permisos}
                    onChange={handlePermisoChange}
                  />
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
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 shadow-lg"
                  >
                    {enviando
                      ? "Guardando..."
                      : esEdicion
                        ? "Actualizar Empleado"
                        : "Crear Empleado"}
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
