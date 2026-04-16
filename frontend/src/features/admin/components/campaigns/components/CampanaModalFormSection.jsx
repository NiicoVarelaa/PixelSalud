import { Percent } from "lucide-react";

const TIPOS = ["DESCUENTO", "2X1", "EVENTO", "LIQUIDACION", "TEMPORADA"];

const inputCls =
  "w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:opacity-50 disabled:cursor-not-allowed";

const Field = ({ label, required, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
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

export const CampanaModalFormSection = ({
  campana,
  esDosPorUno,
  onCampanaChange,
}) => {
  const updateCampana = (changes) =>
    onCampanaChange({ ...campana, ...changes });

  return (
    <section aria-label="Datos de la campaña">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Datos de la campaña
      </p>

      <div className="space-y-3">
        <Field label="Nombre" required>
          <input
            type="text"
            value={campana.nombreCampana}
            onChange={(e) => updateCampana({ nombreCampana: e.target.value })}
            placeholder="Ej: Cyber Monday 2026"
            className={inputCls}
            required
            aria-required="true"
          />
        </Field>

        <Field label="Descripción">
          <textarea
            value={campana.descripcion}
            onChange={(e) => updateCampana({ descripcion: e.target.value })}
            placeholder="Descripción breve (opcional)..."
            rows={2}
            className={`${inputCls} h-auto py-2.5 resize-none`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo">
            <select
              value={campana.tipo}
              onChange={(e) => updateCampana({ tipo: e.target.value })}
              className={`${inputCls} cursor-pointer`}
            >
              {TIPOS.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label={esDosPorUno ? "Descuento (no aplica)" : "Descuento (%)"}
            required={!esDosPorUno}
          >
            <div className="relative">
              <Percent
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={esDosPorUno ? 0 : campana.porcentajeDescuento}
                onChange={(e) =>
                  updateCampana({ porcentajeDescuento: e.target.value })
                }
                placeholder={esDosPorUno ? "-" : "Ej: 20"}
                className={`${inputCls} pl-8`}
                required={!esDosPorUno}
                disabled={esDosPorUno}
              />
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha de inicio" required>
            <input
              type="date"
              value={campana.fechaInicio}
              onChange={(e) => updateCampana({ fechaInicio: e.target.value })}
              className={`${inputCls} cursor-pointer`}
              required
              aria-required="true"
            />
          </Field>

          <Field label="Fecha de fin" required>
            <input
              type="date"
              value={campana.fechaFin}
              onChange={(e) => updateCampana({ fechaFin: e.target.value })}
              className={`${inputCls} cursor-pointer`}
              required
              aria-required="true"
            />
          </Field>
        </div>
      </div>
    </section>
  );
};
