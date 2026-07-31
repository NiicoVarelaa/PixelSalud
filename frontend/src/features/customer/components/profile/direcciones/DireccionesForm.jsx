import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import {
  ARGENTINA,
  inputBaseClass,
  provinciasArgentina,
} from "./direccionesConfig";

const DireccionesForm = ({
  isVisible,
  modoEdicion,
  form,
  cupoCompleto,
  guardando,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) => {
  if (!isVisible) return null;

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, delay: 0.08 }}
      className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900">
        {modoEdicion ? "Editar Direccion" : "Agregar Direccion"}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          name="alias"
          value={form.alias}
          onChange={onChange}
          placeholder="Alias (Ej: Casa, Trabajo)"
          className={inputBaseClass}
          disabled={!modoEdicion && cupoCompleto}
        />
        <input value={ARGENTINA} readOnly className={inputBaseClass} />
        <input
          name="calle"
          value={form.calle}
          onChange={onChange}
          placeholder="Calle"
          className={inputBaseClass}
          disabled={!modoEdicion && cupoCompleto}
        />
        <input
          name="numero"
          value={form.numero}
          onChange={onChange}
          placeholder="Numero"
          className={inputBaseClass}
          disabled={!modoEdicion && cupoCompleto}
        />
        <input
          name="piso"
          value={form.piso}
          onChange={onChange}
          placeholder="Piso (opcional)"
          className={inputBaseClass}
          disabled={!modoEdicion && cupoCompleto}
        />
        <input
          name="departamento"
          value={form.departamento}
          onChange={onChange}
          placeholder="Departamento (opcional)"
          className={inputBaseClass}
          disabled={!modoEdicion && cupoCompleto}
        />
        <input
          name="localidad"
          value={form.localidad}
          onChange={onChange}
          placeholder="Localidad"
          className={inputBaseClass}
          disabled={!modoEdicion && cupoCompleto}
        />
        <select
          name="provincia"
          value={form.provincia}
          onChange={onChange}
          className={inputBaseClass}
          disabled={!modoEdicion && cupoCompleto}
        >
          <option value="">Provincia</option>
          {provinciasArgentina.map((provincia) => (
            <option key={provincia} value={provincia}>
              {provincia}
            </option>
          ))}
        </select>
        <input
          name="codigoPostal"
          value={form.codigoPostal}
          onChange={onChange}
          placeholder="Codigo Postal (4 digitos)"
          className={inputBaseClass}
          disabled={!modoEdicion && cupoCompleto}
        />
        <input
          name="referencias"
          value={form.referencias}
          onChange={onChange}
          placeholder="Referencias (opcional)"
          className={inputBaseClass}
          disabled={!modoEdicion && cupoCompleto}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={(!modoEdicion && cupoCompleto) || guardando || loading}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={16} aria-hidden="true" />
          {guardando
            ? "Guardando..."
            : modoEdicion
              ? "Actualizar Direccion"
              : "Guardar Direccion"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </motion.form>
  );
};

export default DireccionesForm;
