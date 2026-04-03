import { Eye, EyeOff, Lock } from "lucide-react";

const RegistroPasswordField = ({
  value,
  showPassword,
  onChange,
  onToggle,
  disabled,
}) => {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor="contraCliente"
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
          id="contraCliente"
          name="contraCliente"
          placeholder="Contrasena"
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition duration-200 focus:border-primary-700 focus:outline-none focus:ring focus:ring-primary-600/60 disabled:cursor-not-allowed disabled:bg-slate-50"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={disabled}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 inline-flex min-w-11 cursor-pointer items-center justify-center rounded-r-xl px-2 text-slate-500 transition hover:text-primary-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70"
          aria-label={
            showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
          }
          aria-controls="contraCliente"
          aria-pressed={showPassword}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
};

export default RegistroPasswordField;
