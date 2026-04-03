import { Loader2, LogIn, Mail, User } from "lucide-react";
import RegistroInputField from "./RegistroInputField";
import RegistroPasswordField from "./RegistroPasswordField";

const RegistroForm = ({
  form,
  showPassword,
  isSubmitting,
  onChange,
  onTogglePassword,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-4">
        <RegistroInputField
          id="nombreCliente"
          name="nombreCliente"
          label="Nombre"
          placeholder="Nombre"
          value={form.nombreCliente}
          onChange={onChange}
          icon={<User className="h-4 w-4" aria-hidden="true" />}
          autoComplete="given-name"
          minLength={2}
          disabled={isSubmitting}
        />

        <RegistroInputField
          id="apellidoCliente"
          name="apellidoCliente"
          label="Apellido"
          placeholder="Apellido"
          value={form.apellidoCliente}
          onChange={onChange}
          icon={<User className="h-4 w-4" aria-hidden="true" />}
          autoComplete="family-name"
          minLength={2}
          disabled={isSubmitting}
        />
      </div>

      <RegistroInputField
        id="email"
        type="email"
        name="email"
        label="Correo electronico"
        placeholder="tuemail@ejemplo.com"
        value={form.email}
        onChange={onChange}
        icon={<Mail className="h-4 w-4" aria-hidden="true" />}
        autoComplete="email"
        inputMode="email"
        disabled={isSubmitting}
      />

      <RegistroPasswordField
        value={form.contraCliente}
        showPassword={showPassword}
        onChange={onChange}
        onToggle={onTogglePassword}
        disabled={isSubmitting}
      />

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
            <span>Creando cuenta...</span>
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" aria-hidden="true" />
            <span>Crear Cuenta</span>
          </>
        )}
      </button>
    </form>
  );
};

export default RegistroForm;
