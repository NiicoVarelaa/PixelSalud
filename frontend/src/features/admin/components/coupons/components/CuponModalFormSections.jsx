import { DatePickerDay } from "@components/molecules";
import { AlertCircle, Hash, Percent, DollarSign, Users, FileText } from "lucide-react";

const Field = ({ label, required, htmlFor, error, touched, children }) => (
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
    {children}
    {touched && error && (
      <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
        <AlertCircle size={12} aria-hidden="true" />
        {error}
      </p>
    )}
  </div>
);

const inputBase =
  "w-full h-10 rounded-lg border bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 disabled:opacity-50";

const inputError = "border-red-400 focus:border-red-500 focus:ring-red-500/15";
const inputOk = "border-gray-200 focus:border-green-500";

const selectCls =
  "w-full h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 cursor-pointer transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 disabled:opacity-50";

export const CuponModalFormSections = ({ formData, setField, errors = {}, touched = {} }) => {
  const hasError = (key) => touched[key] && errors[key];
  const inputCls = (key, extra = "") => {
    const err = hasError(key) ? inputError : inputOk;
    return `${inputBase} ${err} ${extra}`.trim();
  };

  return (
    <>
      <section aria-label="Datos básicos">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Datos básicos
        </p>
        <div className="space-y-3">
          <Field
            label="Código"
            required
            htmlFor="codigo"
            error={errors.codigo}
            touched={touched.codigo}
          >
            <div className="relative">
              <Hash
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="codigo"
                type="text"
                value={formData.codigo}
                onChange={(e) => setField("codigo", e.target.value.toUpperCase())}
                placeholder="Ej: VERANO2026"
                className={`${inputCls("codigo", "pl-9 pr-3 font-mono tracking-widest")}`}
                required
                aria-required="true"
                aria-invalid={!!hasError("codigo")}
                aria-describedby={hasError("codigo") ? "codigo-error" : undefined}
              />
            </div>
          </Field>
          <Field
            label="Descripción"
            htmlFor="descripcion"
            error={errors.descripcion}
            touched={touched.descripcion}
          >
            <div className="relative">
              <FileText
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="descripcion"
                type="text"
                value={formData.descripcion}
                onChange={(e) => setField("descripcion", e.target.value)}
                placeholder="Ej: Descuento especial de verano"
                className={`${inputCls("descripcion", "pl-9 pr-3")}`}
              />
            </div>
          </Field>
        </div>
      </section>

      <div className="border-t border-gray-100" aria-hidden="true" />

      <section aria-label="Configuración del descuento">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Descuento
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Tipo"
            required
            htmlFor="tipo-cupon"
            error={errors.tipoCupon}
            touched={touched.tipoCupon}
          >
            <select
              id="tipo-cupon"
              value={formData.tipoCupon}
              onChange={(e) => setField("tipoCupon", e.target.value)}
              className={`${selectCls} ${hasError("tipoCupon") ? "border-red-400 focus:border-red-500 focus:ring-red-500/15" : ""}`}
              required
              aria-invalid={!!hasError("tipoCupon")}
            >
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="monto_fijo">Monto fijo ($)</option>
            </select>
          </Field>
          <Field
            label={
              formData.tipoCupon === "porcentaje" ? "Valor (%)" : "Valor ($)"
            }
            required
            htmlFor="valor-descuento"
            error={errors.valorDescuento}
            touched={touched.valorDescuento}
          >
            <div className="relative">
              {formData.tipoCupon === "porcentaje" ? (
                <Percent
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
              ) : (
                <DollarSign
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
              )}
              <input
                id="valor-descuento"
                type="number"
                value={formData.valorDescuento}
                onChange={(e) => setField("valorDescuento", e.target.value)}
                placeholder={formData.tipoCupon === "porcentaje" ? "10" : "500"}
                min="0"
                className={`${inputCls("valorDescuento", "pl-9 pr-3")}`}
                required
                aria-required="true"
                aria-invalid={!!hasError("valorDescuento")}
              />
            </div>
          </Field>
        </div>
      </section>

      <div className="border-t border-gray-100" aria-hidden="true" />

      <section aria-label="Vigencia del cupón">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Vigencia
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Fecha inicio"
            required
            htmlFor="fecha-inicio"
            error={errors.fechaInicio}
            touched={touched.fechaInicio}
          >
            <DatePickerDay
              id="fecha-inicio"
              value={formData.fechaInicio}
              onChange={(value) => setField("fechaInicio", value)}
              required
              ariaLabel="Fecha inicio"
              buttonClassName="cursor-pointer"
            />
          </Field>
          <Field
            label="Fecha vencimiento"
            required
            htmlFor="fecha-vto"
            error={errors.fechaVencimiento}
            touched={touched.fechaVencimiento}
          >
            <DatePickerDay
              id="fecha-vto"
              value={formData.fechaVencimiento}
              onChange={(value) => setField("fechaVencimiento", value)}
              required
              ariaLabel="Fecha vencimiento"
              buttonClassName="cursor-pointer"
            />
          </Field>
        </div>
      </section>

      <div className="border-t border-gray-100" aria-hidden="true" />

      <section aria-label="Restricciones del cupón">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Restricciones
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Usos máx." htmlFor="uso-maximo">
            <input
              id="uso-maximo"
              type="number"
              value={formData.usoMaximo}
              onChange={(e) => setField("usoMaximo", e.target.value)}
              min="1"
              placeholder="Ilimitado"
              className={`${inputCls("usoMaximo", "px-3")}`}
            />
          </Field>
          <Field label="Audiencia" htmlFor="tipo-usuario">
            <div className="relative">
              <Users
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <select
                id="tipo-usuario"
                value={formData.tipoUsuario}
                onChange={(e) => setField("tipoUsuario", e.target.value)}
                className={`${selectCls} pl-9 pr-3`}
              >
                <option value="todos">Todos</option>
                <option value="nuevo">Nuevos</option>
                <option value="vip">VIP</option>
              </select>
            </div>
          </Field>
          <Field label="Monto min. ($)" htmlFor="monto-minimo">
            <div className="relative">
              <DollarSign
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="monto-minimo"
                type="number"
                value={formData.montoMinimo}
                onChange={(e) => setField("montoMinimo", e.target.value)}
                min="0"
                placeholder="0"
                className={`${inputCls("montoMinimo", "pl-9 pr-3")}`}
              />
            </div>
          </Field>
        </div>
      </section>

      <div className="border-t border-gray-100" aria-hidden="true" />
    </>
  );
};
