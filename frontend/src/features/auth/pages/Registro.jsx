import { useState } from "react";
import apiClient from "@utils/apiClient";
import {
  User,
  Mail,
  Lock,
  LogIn,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "@store/useAuthStore";

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
  const { loginUser } = useAuthStore();

  const normalizeApiBaseUrl = (rawUrl) => {
    const sanitized = (rawUrl || "http://localhost:5000/api").replace(
      /\/$/,
      "",
    );
    return /\/api$/i.test(sanitized) ? sanitized : `${sanitized}/api`;
  };

  const apiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

  const googleAuthUrl =
    import.meta.env.VITE_GOOGLE_AUTH_URL || `${apiBaseUrl}/google-auth`;

  const navigateByRole = (data) => {
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
  };

  const validateForm = () => {
    const nombre = form.nombreCliente.trim();
    const apellido = form.apellidoCliente.trim();
    const email = form.email.trim();
    const password = form.contraCliente;

    if (!nombre || !apellido || !email || !password) {
      return "Completá todos los campos para crear tu cuenta.";
    }

    if (nombre.length < 2 || apellido.length < 2) {
      return "Nombre y apellido deben tener al menos 2 caracteres.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Ingresá un correo electrónico válido.";
    }

    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    return null;
  };

  const getApiErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (responseData?.errors && Array.isArray(responseData.errors)) {
      const first = responseData.errors[0];
      if (first?.field && first?.message) {
        return `${first.field}: ${first.message}`;
      }
      if (first?.message) {
        return first.message;
      }
    }

    const rawMessage =
      responseData?.message ||
      responseData?.mensaje ||
      responseData?.error ||
      "No pudimos crear tu cuenta. Intenta nuevamente en unos segundos.";

    if (
      /duplicate|duplicado|ya existe|already exists|ER_DUP_ENTRY/i.test(
        rawMessage,
      )
    ) {
      return "Ese email o DNI ya está registrado. Probá iniciar sesión o recuperar contraseña.";
    }

    if (/validaci[oó]n|validation/i.test(rawMessage)) {
      return "Revisá los datos ingresados. Hay campos con formato inválido.";
    }

    return rawMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.warning(validationError);
      return;
    }

    setIsSubmitting(true);

    const dataToSend = {
      nombreCliente: form.nombreCliente.trim(),
      apellidoCliente: form.apellidoCliente.trim(),
      emailCliente: form.email.toLowerCase().trim(),
      contraCliente: form.contraCliente,
    };

    try {
      const registerResponse = await apiClient.post(
        "/registroCliente",
        dataToSend,
      );

      const loginResponse = await apiClient.post("/login", {
        email: dataToSend.emailCliente,
        contrasenia: dataToSend.contraCliente,
      });

      const authData = loginResponse.data || {};
      if (!authData.token || !authData.rol) {
        throw new Error("No se pudo completar el inicio de sesión automático.");
      }

      loginUser(authData);

      toast.success(
        registerResponse.data.mensaje ||
          "Cuenta creada con éxito. Ya iniciamos tu sesión.",
      );

      setForm({
        nombreCliente: "",
        apellidoCliente: "",
        email: "",
        contraCliente: "",
      });

      setTimeout(() => {
        navigateByRole(authData);
      }, 800);
    } catch (error) {
      console.error("Error de registro:", error);
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = () => {
    if (!googleAuthUrl || !/^https?:\/\//.test(googleAuthUrl)) {
      toast.info(
        "El acceso con Google aún no está configurado en este entorno.",
      );
      return;
    }

    window.location.href = googleAuthUrl;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden  p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="mb-6 flex items-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="cursor-pointer rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
            aria-label="Volver al inicio de sesión"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-center text-3xl font-extrabold text-primary-700">
            Crear Cuenta
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <input
                name="nombreCliente"
                placeholder="Nombre"
                value={form.nombreCliente}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition focus:outline-none focus:ring-2 focus:ring-primary-600"
                required
                minLength={2}
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <input
                name="apellidoCliente"
                placeholder="Apellido"
                value={form.apellidoCliente}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition focus:outline-none focus:ring-2 focus:ring-primary-600"
                required
                minLength={2}
              />
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition focus:outline-none focus:ring-2 focus:ring-primary-600"
              required
            />
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="contraCliente"
              placeholder="Contraseña"
              value={form.contraCliente}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 transition focus:outline-none focus:ring-2 focus:ring-primary-600"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition hover:text-primary-700"
              aria-label="Mostrar u ocultar contraseña"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-primary-700 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-primary-800 hover:shadow-lg ${
              isSubmitting ? "cursor-not-allowed opacity-75" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Crear Cuenta</span>
              </>
            )}
          </button>
        </form>

        <div className="mb-5 mt-5 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          o con google
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="group inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.29h6.45a5.52 5.52 0 0 1-2.39 3.63v3.02h3.87c2.26-2.08 3.56-5.15 3.56-8.67z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3.02c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.76-2.11-6.7-4.95H1.3v3.11A11.99 11.99 0 0 0 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.28A7.2 7.2 0 0 1 4.92 12c0-.79.14-1.55.38-2.28V6.61H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.39l4-3.11z"
            />
            <path
              fill="#EA4335"
              d="M12 4.77c1.76 0 3.34.6 4.58 1.77l3.43-3.43C17.94 1.17 15.24 0 12 0A11.99 11.99 0 0 0 1.3 6.61l4 3.11c.94-2.84 3.58-4.95 6.7-4.95z"
            />
          </svg>
          Continuar con Google
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary-800 hover:underline"
          >
            Inicia sesión
          </Link>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
          Al registrarte, aceptas nuestros{" "}
          <Link
            to="/terminos-condiciones"
            className="text-primary-800 hover:underline"
          >
            Términos de servicio
          </Link>{" "}
          y{" "}
          <Link
            to="/terminos-condiciones"
            className="text-primary-800 hover:underline"
          >
            Política de privacidad.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
