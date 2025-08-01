import { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; 

const Registro = () => {
  const [form, setForm] = useState({
    nombreCliente: "",
    apellidoCliente: "",
    email: "",
    contraCliente: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/registroCliente",
        form
      );
      toast.success(res.data.mensaje); 
      setForm({
        nombreCliente: "",
        apellidoCliente: "",
        email: "",
        contraCliente: "",
      });
      navigate("/login");
    } catch (error) {
      toast.error("Error al registrar el cliente"); 
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      {" "}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        {" "}
        {/* Encabezado */}
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-gray-500 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600 cursor-pointer"
            aria-label="Volver al inicio de sesión"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <h1 className="text-3xl font-extrabold text-center text-primary-700 flex-1">
            {" "}
            Crear Cuenta
          </h1>
        </div>
        <p className="text-gray-600 text-center mb-8 text-md leading-relaxed">
          {" "}
          Únete a nuestra farmacia y comienza tu experiencia
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="sr-only" htmlFor="nombreCliente">
                Nombre
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaUser className="text-sm" />
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

            <div className="relative">
              <label className="sr-only" htmlFor="apellidoCliente">
                Apellido
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaUser className="text-sm" />
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
          {/* Email */}
          <div className="relative">
            <label className="sr-only" htmlFor="email">
              Correo electrónico
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaEnvelope className="text-sm" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
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
              <FaLock className="text-sm" />
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
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
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <FaSignInAlt />
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