import { useState } from "react";
import apiClient from "../utils/apiClient";

import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuthStore();

  // En Login.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/login", {
        email: user.email.toLowerCase().trim(),
        contrasenia: user.password,
      });

      // 1. Obtenemos la data COMPLETA (que Postman demostró que SÍ trae permisos)
      const data = response.data || {};

      // 2. ¡Validamos que tengamos lo mínimo!
      if (!data.rol || !data.token) {
        toast.warn("No se pudo obtener la sesión completa (rol o token).");
        setIsSubmitting(false);
        return;
      }

      // 3. ¡¡¡EL ARREGLO!!! Le pasamos 'data' (la respuesta COMPLETA) a loginUser.
      // ¡useAuthStore se encarga de todo lo demás!
      loginUser(data);

      // 4. El resto de tu lógica de navegación (esto ya estaba bien)
      const nombreCapitalizado =
        (data.nombre?.charAt(0)?.toUpperCase() || "") +
        (data.nombre?.slice(1) || "");
      toast.success(`¡Bienvenido, ${nombreCapitalizado}!`);

      const rol = (data.rol || "").toString().toLowerCase();

      if (rol === "cliente") {
        navigate("/");
      } else if (rol === "empleado") {
        navigate("/panelempleados");
      } else if (rol === "admin") {
        navigate("/admin");
      } else if (rol === "medico") {
        navigate("/panelMedico");
      } else {
        navigate("/");
      }
    } catch (error) {
      // ... (tu manejo de errores estaba perfecto)
      const serverMsg =
        error.response?.data?.msg ||
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        null;

      if (serverMsg) {
        toast.error(serverMsg);
      } else {
        toast.error("Error al conectar con el servidor.");
      }
      console.error("Login error:", error);
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
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600 cursor-pointer"
            aria-label="Volver a la página principal"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-extrabold text-center text-primary-700 flex-1">
            Iniciar Sesión
          </h1>
        </div>
        <p className="text-gray-600 text-center mb-8 text-md leading-relaxed">
          Accede a tu cuenta para continuar
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Correo electrónico"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div className="relative">
            <label className="sr-only" htmlFor="password">
              Contraseña
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Contraseña"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
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
                <span>Iniciando...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Iniciar sesión</span>
              </>
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/Registro"
            className="text-primary-800 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link
            to="/recuperarContraseña"
            className="text-primary-700 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
