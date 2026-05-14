import { Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";
import { normalizeApiBaseUrl } from "@utils/normalizeApiBaseUrl";

const LoginForm = ({
  register,
  showPassword,
  isSubmitting,
  onSubmit,
  onTogglePassword,
  errors,
}) => {
  const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google-auth`;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700"
        >
          Correo electronico
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Mail className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            type="email"
            id="email"
            placeholder="tuemail@ejemplo.com"
            autoComplete="email"
            inputMode="email"
            disabled={isSubmitting}
            {...register("email")}
            className={`h-11 w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition duration-200 focus:border-primary-700 focus:outline-none focus:ring focus:ring-primary-600/60 disabled:cursor-not-allowed disabled:bg-slate-50 ${
              errors.email ? "border-red-400" : "border-slate-300"
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700"
        >
          Contrasena
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Contrasena"
            autoComplete="current-password"
            disabled={isSubmitting}
            {...register("password")}
            className={`h-11 w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition duration-200 focus:border-primary-700 focus:outline-none focus:ring focus:ring-primary-600/60 disabled:cursor-not-allowed disabled:bg-slate-50 ${
              errors.password ? "border-red-400" : "border-slate-300"
            }`}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 inline-flex min-w-11 cursor-pointer items-center justify-center rounded-r-xl px-2 text-slate-500 transition hover:text-primary-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70"
            aria-label={
              showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
            }
            aria-controls="password"
            aria-pressed={showPassword}
            disabled={isSubmitting}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className={`flex min-h-11 w-full cursor-pointer items-center justify-center space-x-2 rounded-xl border border-primary-700 bg-primary-700 py-3 text-sm font-semibold text-white shadow-md transition duration-300 hover:bg-primary-800 hover:shadow-lg active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2 ${
          isSubmitting ? "cursor-not-allowed opacity-75" : ""
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            <span>Iniciando...</span>
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" aria-hidden="true" />
            <span>Iniciar sesión</span>
          </>
        )}
      </button>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink px-4 text-xs font-medium text-gray-400 uppercase">
          o continúa con
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex min-h-11 w-full cursor-pointer items-center justify-center space-x-2 rounded-xl border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition duration-300 hover:bg-gray-50 hover:shadow active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span>Continuar con Google</span>
      </button>
    </form>
  );
};

export default LoginForm;
