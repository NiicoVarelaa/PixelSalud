import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Mail, Calendar, Shield, Edit } from "lucide-react";

const Perfil = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombreCliente: "",
    apellidoCliente: "",
    emailCliente: "",
    dni: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombreCliente: user.nombreCliente || "",
        apellidoCliente: user.apellidoCliente || "",
        emailCliente: user.emailCliente || "",
        dni: user.dni || ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el perfil
    console.log("Datos a actualizar:", formData);
    setIsEditing(false);
    // Mostrar toast de éxito
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Mi Perfil
            </h1>
            <p className="text-gray-600">
              Gestiona tu información personal y preferencias
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white 
                     rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Edit size={18} />
            <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
          </button>
        </div>
      </div>

      {/* Información del Usuario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Información Personal
            </h2>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombreCliente"
                      value={formData.nombreCliente}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="apellidoCliente"
                      value={formData.apellidoCliente}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="emailCliente"
                    value={formData.emailCliente}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg 
                             hover:bg-primary-700 transition-colors duration-200"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg 
                             hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Nombre completo</p>
                    <p className="font-medium text-gray-900">
                      {user.nombreCliente} {user.apellidoCliente}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user.emailCliente}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">DNI</p>
                    <p className="font-medium text-gray-900">{user.dni}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Miembro desde</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(user.fecha_registro)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Resumen de Cuenta
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Estado</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Activo
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Rol</span>
                <span className="font-medium text-gray-900 capitalize">
                  {user.rol}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Última actividad</span>
                <span className="font-medium text-gray-900">Hoy</span>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 
                              hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
                <p className="font-medium text-gray-900">Cambiar contraseña</p>
                <p className="text-sm text-gray-600">Actualiza tu contraseña de acceso</p>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 
                              hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
                <p className="font-medium text-gray-900">Preferencias de notificación</p>
                <p className="text-sm text-gray-600">Configura cómo te contactamos</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;