import { motion } from "framer-motion";
import { Check, Pencil, Trash2 } from "lucide-react";

const DireccionesList = ({
  loading,
  direcciones,
  onEditar,
  onEliminar,
  onMarcarPredeterminada,
}) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600"
      >
        Cargando direcciones...
      </motion.div>
    );
  }

  if (direcciones.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600"
      >
        Aun no guardaste direcciones.
      </motion.div>
    );
  }

  return direcciones.map((dir, index) => (
    <motion.article
      key={dir.idDireccion}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: 0.03 * index }}
      className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">
              {dir.alias}
            </h2>
            {dir.esPredeterminada && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-800">
                <Check size={12} aria-hidden="true" /> Predeterminada
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-700">
            {dir.calle} {dir.numero}
            {dir.piso ? `, Piso ${dir.piso}` : ""}
            {dir.departamento ? `, Depto ${dir.departamento}` : ""}
          </p>
          <p className="text-sm text-gray-700">
            {dir.localidad}, {dir.provincia} ({dir.codigoPostal}) - {dir.pais}
          </p>
          {dir.referencias && (
            <p className="mt-1 text-xs text-gray-500">Ref: {dir.referencias}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {!dir.esPredeterminada && (
            <button
              type="button"
              onClick={() => onMarcarPredeterminada(dir.idDireccion)}
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-800"
            >
              <Check size={14} aria-hidden="true" />
              Marcar predeterminada
            </button>
          )}
          <button
            type="button"
            onClick={() => onEditar(dir)}
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <Pencil size={14} aria-hidden="true" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => onEliminar(dir.idDireccion)}
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
          >
            <Trash2 size={15} aria-hidden="true" />
            Eliminar
          </button>
        </div>
      </div>
    </motion.article>
  ));
};

export default DireccionesList;
