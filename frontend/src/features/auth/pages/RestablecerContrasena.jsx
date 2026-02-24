import {  useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLock, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const RestablecerContrasena = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, ] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener el token de la URL
  const token = new URLSearchParams(location.search).get("token");

  const primaryColor = "bg-green-600";
  const primaryHover = "hover:bg-green-700";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    if (!token) {
      toast.error("Token de recuperación no válido.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Lógica para restablecer la contraseña en el backend
      // Reemplaza esta URL con la ruta de tu API
      await axios.post(`http://localhost:5000/clientes/restablecer-password/${token}`, {
    nuevaPassword: password, // Asegurate que la variable se llame igual que en el controller
  });

      toast.success("¡Contraseña restablecida con éxito!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || "Error al restablecer la contraseña.");
      } else {
        toast.error("Error al conectar con el servidor.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        {/* Encabezado */}
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600 cursor-pointer"
            aria-label="Volver atrás"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <h1 className="text-3xl font-extrabold text-center text-green-700 flex-1">
            {" "}
            Nueva Contraseña
          </h1>
        </div>
        <p className="text-gray-600 text-center mb-8 text-md leading-relaxed">
          Ingresa y confirma tu nueva contraseña.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de Contraseña */}
          <div className="relative">
            <label className="sr-only" htmlFor="password">
              Nueva Contraseña
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaLock className="text-sm" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Nueva Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200"
              required
            />
          </div>

          {/* Campo de Confirmar Contraseña */}
          <div className="relative">
            <label className="sr-only" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaLock className="text-sm" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${primaryColor} text-white py-3 rounded-lg ${primaryHover} transition duration-300 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg cursor-pointer ${
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
                <span>Cambiando...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="text-xl" />
                <span>Restablecer Contraseña</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestablecerContrasena;