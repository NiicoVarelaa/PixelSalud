import { Tags } from "lucide-react";

const ContactoTipoConsultaField = ({
  value,
  onChange,
  options,
  showLoginWarning,
}) => (
  <fieldset className="space-y-1.5">
    <label htmlFor="tipoConsulta" className="block text-sm font-medium text-slate-700">
      Tipo de consulta
    </label>

    <div className="relative">
      <Tags className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <select
        id="tipoConsulta"
        name="tipoConsulta"
        value={value}
        onChange={onChange}
        aria-label="Seleccionar tipo de consulta"
        className="h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-9 pr-8 text-sm text-slate-900 outline-none transition focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500/60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    {showLoginWarning && (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Para consultas de pedido o receta, necesitas iniciar sesión.
      </p>
    )}
  </fieldset>
);

export default ContactoTipoConsultaField;
