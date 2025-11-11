import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Mail, Calendar, Shield, Edit, Info } from "lucide-react";

const Perfil = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombreCliente: "",
    apellidoCliente: "",
    emailCliente: "",
    dni: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombreCliente: user.nombreCliente || "",
        apellidoCliente: user.apellidoCliente || "",
        emailCliente: user.emailCliente || "",
        dni: user.dni || "",
      });
    }
    // Opcional: enfocar el primer campo al entrar en modo edición
    if (isEditing) {
      document.querySelector('input[name="nombreCliente"]')?.focus();
    }
  }, [user, isEditing]); // Añadir isEditing a las dependencias

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el perfil (API call)
    console.log("Datos a actualizar:", formData);
    setIsEditing(false);
    // TODO: Mostrar toast de éxito: "¡Perfil actualizado con éxito!"
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <p className="text-gray-600">Cargando información del perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-0"> {/* Añadido padding móvil */}
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8 transition-shadow duration-300">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
              Mi Perfil
            </h1>
            <p className="text-gray-600 text-lg">
              Gestiona tu información personal y preferencias
            </p>
          </div>
          {/* Botón de Edición/Cancelar Mejorado UX */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md
              ${isEditing 
                ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50" 
                : "bg-primary-600 text-white hover:bg-primary-700"
              }`}
          >
            <span>{isEditing ? "Cancelar edición" : "Editar perfil"}</span>
            <Edit size={18} />
          </button>
        </div>
      </div>

      {/* Información del Usuario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información Personal */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
              Información Personal
            </h2>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label htmlFor="nombreCliente" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      id="nombreCliente"
                      type="text"
                      name="nombreCliente"
                      value={formData.nombreCliente}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                               focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                      required
                    />
                  </div>
                  {/* Apellido */}
                  <div>
                    <label htmlFor="apellidoCliente" className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      id="apellidoCliente"
                      type="text"
                      name="apellidoCliente"
                      value={formData.apellidoCliente}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                               focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="emailCliente" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="emailCliente"
                    type="email"
                    name="emailCliente"
                    value={formData.emailCliente}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                    required
                  />
                </div>

                {/* DNI */}
                <div>
                  <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                    DNI
                  </label>
                  <input
                    id="dni"
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  {/* Botón Principal: Guardar Cambios */}
                  <button
                    type="submit"
                    className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl 
                             hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Guardar Cambios
                  </button>
                  {/* Botón Secundario: Cancelar */}
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl 
                             hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Bloque: Nombre Completo */}
                <div className="grid grid-cols-2 items-center py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <User className="w-6 h-6 text-primary-500" />
                    <p className="text-base text-gray-600">Nombre completo</p>
                  </div>
                  <p className="font-bold text-gray-900 justify-self-end text-right text-lg">
                    {user.nombreCliente} {user.apellidoCliente}
                  </p>
                </div>

                {/* Bloque: Email */}
                <div className="grid grid-cols-2 items-center py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6 text-primary-500" />
                    <p className="text-base text-gray-600">Email</p>
                  </div>
                  <p className="font-semibold text-gray-900 justify-self-end text-right">
                    {user.emailCliente}
                  </p>
                </div>

                {/* Bloque: DNI */}
                <div className="grid grid-cols-2 items-center py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <Shield className="w-6 h-6 text-primary-500" />
                    <p className="text-base text-gray-600">DNI</p>
                  </div>
                  <p className="font-semibold text-gray-900 justify-self-end text-right">
                    {user.dni}
                  </p>
                </div>

                {/* Bloque: Miembro Desde */}
                <div className="grid grid-cols-2 items-center py-3">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-6 h-6 text-primary-500" />
                    <p className="text-base text-gray-600">Miembro desde</p>
                  </div>
                  <p className="font-semibold text-gray-900 justify-self-end text-right">
                    {formatDate(user.fecha_registro)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columnas laterales (Resumen y Acciones) */}
        <div className="space-y-8">
          {/* Resumen de Cuenta */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              <Info className="inline w-5 h-5 mr-2 text-gray-500" />
              Resumen de Cuenta
            </h3>
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Estado</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Activo
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Rol</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {user.rol}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600">Última actividad</span>
                <span className="font-semibold text-gray-900">Hoy</span>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Acciones Rápidas
            </h3>
            <div className="space-y-3 pt-2">
              <button
                className="w-full text-left p-4 rounded-xl border border-gray-200 bg-white
                              hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 shadow-sm"
              >
                <p className="font-semibold text-gray-900">Cambiar contraseña</p>
                <p className="text-sm text-gray-600 mt-1">
                  Actualiza tu contraseña de acceso por seguridad
                </p>
              </button>
              <button
                className="w-full text-left p-4 rounded-xl border border-gray-200 bg-white
                              hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 shadow-sm"
              >
                <p className="font-semibold text-gray-900">
                  Preferencias de notificación
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Configura cómo y cuándo te contactamos
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;