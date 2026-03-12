import { motion } from "framer-motion";

export const CuponesPagination = ({
  paginaActual,
  totalPaginas,
  indicePrimero,
  indiceUltimo,
  totalItems,
  onPaginaAnterior,
  onPaginaSiguiente,
}) => {
  if (totalItems === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg"
    >
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={onPaginaAnterior}
          disabled={paginaActual === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          onClick={onPaginaSiguiente}
          disabled={paginaActual === totalPaginas}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{indicePrimero + 1}</span> a{" "}
            <span className="font-medium">
              {Math.min(indiceUltimo, totalItems)}
            </span>{" "}
            de <span className="font-medium">{totalItems}</span> cupones
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPaginaAnterior}
            disabled={paginaActual === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPaginaSiguiente}
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
