import { DatePickerDay } from "@components/molecules";
const Field = ({ label, required, htmlFor, children }) => (
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
  </div>
);

const inputCls =
  "w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 disabled:opacity-50";

const selectCls = `${inputCls} cursor-pointer`;

export const CuponModalFormSections = ({ formData, setField }) => {
  return (
    <>
      <section aria-label="Datos básicos">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Datos básicos
        </p>
        <div className="space-y-3">
          <Field label="Código" required htmlFor="codigo">
            <input
              id="codigo"
              type="text"
              value={formData.codigo}
              onChange={(e) => setField("codigo", e.target.value.toUpperCase())}
              placeholder="Ej: VERANO2026"
              className={`${inputCls} font-mono tracking-widest`}
              required
              aria-required="true"
            />
          </Field>
          <Field label="Descripción" htmlFor="descripcion">
            <input
              id="descripcion"
              type="text"
              value={formData.descripcion}
              onChange={(e) => setField("descripcion", e.target.value)}
              placeholder="Ej: Descuento especial de verano"
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      <div className="border-t border-gray-100" aria-hidden="true" />

      <section aria-label="Configuración del descuento">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Descuento
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo" required htmlFor="tipo-cupon">
            <select
              id="tipo-cupon"
              value={formData.tipoCupon}
              onChange={(e) => setField("tipoCupon", e.target.value)}
              className={selectCls}
              required
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
          >
            <input
              id="valor-descuento"
              type="number"
              value={formData.valorDescuento}
              onChange={(e) => setField("valorDescuento", e.target.value)}
              placeholder={formData.tipoCupon === "porcentaje" ? "10" : "500"}
              min="0"
              className={inputCls}
              required
              aria-required="true"
            />
          </Field>
        </div>
      </section>

      <div className="border-t border-gray-100" aria-hidden="true" />

      <section aria-label="Vigencia del cupón">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Vigencia
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha inicio" required htmlFor="fecha-inicio">
            <DatePickerDay
              id="fecha-inicio"
              value={formData.fechaInicio}
              onChange={(value) => setField("fechaInicio", value)}
              required
              ariaLabel="Fecha inicio"
              buttonClassName="cursor-pointer"
            />
          </Field>
          <Field label="Fecha vencimiento" required htmlFor="fecha-vto">
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
        <div className="grid grid-cols-3 gap-3">
          <Field label="Usos máx." htmlFor="uso-maximo">
            <input
              id="uso-maximo"
              type="number"
              value={formData.usoMaximo}
              onChange={(e) => setField("usoMaximo", e.target.value)}
              min="1"
              placeholder="Ilimitado"
              className={inputCls}
            />
          </Field>
          <Field label="Audiencia" htmlFor="tipo-usuario">
            <select
              id="tipo-usuario"
              value={formData.tipoUsuario}
              onChange={(e) => setField("tipoUsuario", e.target.value)}
              className={selectCls}
            >
              <option value="todos">Todos</option>
              <option value="nuevo">Nuevos</option>
              <option value="vip">VIP</option>
            </select>
          </Field>
          <Field label="Monto min. ($)" htmlFor="monto-minimo">
            <input
              id="monto-minimo"
              type="number"
              value={formData.montoMinimo}
              onChange={(e) => setField("montoMinimo", e.target.value)}
              min="0"
              placeholder="0"
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      <div className="border-t border-gray-100" aria-hidden="true" />
    </>
  );
};
