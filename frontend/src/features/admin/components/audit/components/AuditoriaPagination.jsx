import { motion } from "framer-motion";

export const AuditoriaPagination = ({
  totalRegistros,
  offset,
  limite,
  onAnterior,
  onSiguiente,
  onCambiarLimite,
}) => {
  const esPrimeraPagina = offset === 0;
  const puedeAvanzar = totalRegistros === limite;
  const paginaActual = Math.floor(offset / limite) + 1;
  const desde = offset + 1;
  const hasta = offset + totalRegistros;

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Info y selector de límite */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">
            Mostrando <span className="font-medium text-gray-900">{desde}</span>{" "}
            - <span className="font-medium text-gray-900">{hasta}</span>{" "}
            registros
          </span>
          <div className="flex items-center gap-2">
            <label className="text-gray-600">Por página:</label>
            <select
              value={limite}
              onChange={(e) => onCambiarLimite(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Página {paginaActual}</span>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAnterior}
              disabled={esPrimeraPagina}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSiguiente}
              disabled={!puedeAvanzar}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
