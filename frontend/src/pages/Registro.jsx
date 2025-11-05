import { useState } from "react";
import apiClient from "../utils/apiClient";
import { 
  User, 
  Mail, 
  Lock, 
  LogIn, 
  ArrowLeft,
  ScanText,
  Eye,       
  EyeOff,    
  Loader2    
} 
from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; 

const Registro = () => {
  const [form, setForm] = useState({
    nombreCliente: "",
    apellidoCliente: "",
    email: "", // Usaremos 'email' en el estado para el frontend
    contraCliente: "",
    dni: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    // Lógica para DNI (solo números)
    if (name === 'dni') {
        newValue = value.replace(/\D/g, '');
    }

    // Corregido: Usar el 'name' del input directamente para actualizar el estado
    setForm(prevForm => ({ ...prevForm, [name]: newValue }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mapeo final de datos para el backend
    const dataToSend = {
        ...form,
        // Renombrar 'email' del estado a 'emailCliente' para el backend
        emailCliente: form.email 
    };
    // El campo 'email' se mantiene en 'dataToSend', pero el backend lo ignorará 
    // si solo usa 'emailCliente', 'contraCliente', etc.
    // Si tu backend es estricto, podrías usar: delete dataToSend.email;

    try {
      const res = await apiClient.post(
        "/registroCliente",
        dataToSend
      );
      
      toast.success(res.data.mensaje); 
      setForm({
        nombreCliente: "",
        apellidoCliente: "",
        email: "",
        contraCliente: "",
        dni: "", 
      });
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.mensaje || "Error al registrar el cliente";
      toast.error(errorMessage); 
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-gray-500 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600 cursor-pointer"
            aria-label="Volver al inicio de sesión"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-extrabold text-center text-primary-700 flex-1">
            Crear Cuenta
          </h1>
        </div>
        <p className="text-gray-600 text-center mb-8 text-md leading-relaxed">
          Únete a nuestra farmacia y comienza tu experiencia
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="relative">
              <label className="sr-only" htmlFor="nombreCliente">
                Nombre
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="nombreCliente"
                name="nombreCliente"
                placeholder="Nombre"
                value={form.nombreCliente}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Apellido */}
            <div className="relative">
              <label className="sr-only" htmlFor="apellidoCliente">
                Apellido
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="apellidoCliente"
                name="apellidoCliente"
                placeholder="Apellido"
                value={form.apellidoCliente}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
          </div>
          
          {/* DNI */}
          <div className="relative">
            <label className="sr-only" htmlFor="dni">
              DNI / Identificación
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <ScanText className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="dni"
              name="dni" 
              placeholder="DNI / Cédula"
              value={form.dni}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition duration-200"
              required
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

          {/* Email (CORREGIDO) */}
          <div className="relative">
            <label className="sr-only" htmlFor="email">
              Correo electrónico
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              id="email"
              name="email" // Nombre del campo en el estado del componente
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition duration-200"
              required
            />
          </div>
          
          {/* Contraseña */}
          <div className="relative">
            <label className="sr-only" htmlFor="contraCliente">
              Contraseña
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="contraCliente"
              name="contraCliente"
              placeholder="Contraseña"
              value={form.contraCliente}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary-700 transition cursor-pointer"
              aria-label="Mostrar u ocultar contraseña"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" /> 
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Botón Registro */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-primary-700 text-white py-3 rounded-lg hover:bg-primary-800 transition duration-300 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg cursor-pointer ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Registrarse</span>
              </>
            )}
          </button>
        </form>
        {/* Enlace a Login */}
        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a
            href="#"
            onClick={() => navigate("/login")}
            className="text-primary-800 font-semibold hover:underline"
          >
            Inicia sesión
          </a>
        </div>
        {/* Términos y condiciones */}
        <p className="mt-4 text-xs text-gray-500 text-center leading-relaxed">
          Al registrarte, aceptas nuestros{" "}
          <Link to="/Error404" className="text-primary-800 hover:underline">
            Términos de servicio
          </Link>{" "}
          y{" "}
          <Link to="/Error404" className="text-primary-800 hover:underline">
            Política de privacidad.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;