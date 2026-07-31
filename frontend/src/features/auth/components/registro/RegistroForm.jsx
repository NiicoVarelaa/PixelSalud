import { Loader2, LogIn, Mail, User } from "lucide-react";
import RegistroInputField from "./RegistroInputField";
import RegistroPasswordField from "./RegistroPasswordField";

const RegistroForm = ({
  register,
  showPassword,
  isSubmitting,
  onSubmit,
  onTogglePassword,
  errors,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-4">
        <RegistroInputField
          id="nombreCliente"
          name="nombreCliente"
          label="Nombre"
          placeholder="Nombre"
          register={register}
          icon={<User className="h-4 w-4" aria-hidden="true" />}
          autoComplete="given-name"
          disabled={isSubmitting}
          error={errors.nombreCliente}
        />

        <RegistroInputField
          id="apellidoCliente"
          name="apellidoCliente"
          label="Apellido"
          placeholder="Apellido"
          register={register}
          icon={<User className="h-4 w-4" aria-hidden="true" />}
          autoComplete="family-name"
          disabled={isSubmitting}
          error={errors.apellidoCliente}
        />
      </div>

      <RegistroInputField
        id="email"
        name="email"
        label="Correo electronico"
        placeholder="tuemail@ejemplo.com"
        register={register}
        type="email"
        icon={<Mail className="h-4 w-4" aria-hidden="true" />}
        autoComplete="email"
        inputMode="email"
        disabled={isSubmitting}
        error={errors.email}
      />

      <RegistroPasswordField
        register={register}
        showPassword={showPassword}
        onToggle={onTogglePassword}
        disabled={isSubmitting}
        error={errors.contraCliente}
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
