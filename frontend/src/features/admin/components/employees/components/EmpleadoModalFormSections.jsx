import { User, Mail, CreditCard, Lock, AlertCircle } from "lucide-react";
import { PermisosSection } from "./PermisosSection";

const Field = ({ label, required, htmlFor, error, icon: Icon, children }) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-semibold text-gray-600"
    >
      {label}
      {required && (
        <span className="ml-0.5 text-red-400" aria-hidden="true">
          *
        </span>
      )}
    </label>

    <div className="relative">
      {Icon && (
        <Icon
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
      )}
      {children}
    </div>

    {error && (
      <p
        role="alert"
        className="mt-1 flex items-center gap-1 text-[11px] text-red-600"
      >
        <AlertCircle size={11} aria-hidden="true" />
        {error}
      </p>
    )}
  </div>
);

const inputCls = (hasIcon, hasError) =>
  `w-full h-10 rounded-lg border bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
    hasIcon ? "pl-8.5 pr-3" : "px-3"
  } ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-green-500 focus:ring-green-100"
  }`;

export const EmpleadoModalFormSections = ({
  esEdicion,
  formData,
  errores,
  onChange,
  onPermisoChange,
}) => {
  return (
    <>
      <section aria-label="Datos personales">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Datos personales
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Nombre"
            required
            htmlFor="nombre"
            error={errores.nombreEmpleado}
            icon={User}
          >
            <input
              id="nombre"
              type="text"
              name="nombreEmpleado"
              value={formData.nombreEmpleado}
              onChange={onChange}
              placeholder="Ej: Juan"
              className={inputCls(true, !!errores.nombreEmpleado)}
              aria-required="true"
              aria-invalid={!!errores.nombreEmpleado}
              aria-describedby={
                errores.nombreEmpleado ? "err-nombre" : undefined
              }
            />
          </Field>

          <Field
            label="Apellido"
            required
            htmlFor="apellido"
            error={errores.apellidoEmpleado}
            icon={User}
          >
            <input
              id="apellido"
              type="text"
              name="apellidoEmpleado"
              value={formData.apellidoEmpleado}
              onChange={onChange}
              placeholder="Ej: Pérez"
              className={inputCls(true, !!errores.apellidoEmpleado)}
              aria-required="true"
              aria-invalid={!!errores.apellidoEmpleado}
            />
          </Field>

          <Field
            label="DNI"
            required
            htmlFor="dni"
            error={errores.dniEmpleado}
            icon={CreditCard}
          >
            <input
              id="dni"
              type="text"
              inputMode="numeric"
              name="dniEmpleado"
              value={formData.dniEmpleado}
              onChange={onChange}
              placeholder="30123456"
              className={inputCls(true, !!errores.dniEmpleado)}
              aria-required="true"
              aria-invalid={!!errores.dniEmpleado}
            />
          </Field>

          <Field
            label="Email"
            required
            htmlFor="email"
            error={errores.emailEmpleado}
            icon={Mail}
          >
            <input
              id="email"
              type="email"
              name="emailEmpleado"
              value={formData.emailEmpleado}
              onChange={onChange}
              autoComplete="off"
              placeholder="juan@farmacia.com"
              className={inputCls(true, !!errores.emailEmpleado)}
              aria-required="true"
              aria-invalid={!!errores.emailEmpleado}
            />
          </Field>
        </div>
      </section>

      <div className="border-t border-gray-100" aria-hidden="true" />

      <section aria-label="Contraseña">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {esEdicion ? "Cambiar contraseña" : "Contraseña"}
        </p>

        {esEdicion && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5">
            <AlertCircle
              size={14}
              className="shrink-0 text-orange-600"
              aria-hidden="true"
            />
            <p className="text-xs text-orange-700">
              Dejá vacío para no modificar la contraseña actual.
            </p>
          </div>
        )}

        <Field
          label={esEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
          required={!esEdicion}
          htmlFor="contra"
          error={errores.contraEmpleado}
          icon={Lock}
        >
          <input
            id="contra"
            type="password"
            name="contraEmpleado"
            value={formData.contraEmpleado}
            onChange={onChange}
            autoComplete="new-password"
            placeholder={
              esEdicion ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"
            }
            className={inputCls(true, !!errores.contraEmpleado)}
            aria-required={!esEdicion}
            aria-invalid={!!errores.contraEmpleado}
          />
        </Field>
      </section>

      <div className="border-t border-gray-100" aria-hidden="true" />

      <section aria-label="Permisos del empleado">
        <PermisosSection
          permisos={formData.permisos}
          onChange={onPermisoChange}
        />
      </section>
    </>
  );
};
