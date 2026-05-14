import { Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";

const LoginForm = ({
  register,
  showPassword,
  isSubmitting,
  onSubmit,
  onTogglePassword,
  errors,
}) => {
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
    </form>
  );
};

export default LoginForm;
