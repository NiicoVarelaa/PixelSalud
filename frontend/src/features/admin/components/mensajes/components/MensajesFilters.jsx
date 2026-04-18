import { Search, SlidersHorizontal, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ESTADOS = [
  { value: "todos", label: "Todos" },
  { value: "nuevo", label: "Nuevos" },
  { value: "en_proceso", label: "En proceso" },
  { value: "respondido", label: "Respondidos" },
  { value: "cerrado", label: "Cerrados" },
];

export const MensajesFilters = ({
  filtroEstado,
  onFiltroEstadoChange,
  busqueda,
  onBusquedaChange,
  onLimpiar,
}) => {
  const hayFiltros = filtroEstado !== "todos" || busqueda;

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-gray-200 bg-white shadow-xs"
      role="search"
      aria-label="Filtros de mensajes"
    >
      <div className="flex flex-col gap-2.5 p-3 sm:flex-row sm:items-center sm:p-3.5">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Buscar por nombre, email o asunto..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 pl-8.5 pr-8 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
            aria-label="Buscar mensajes"
          />
          <AnimatePresence>
            {busqueda && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => onBusquedaChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
                aria-label="Limpiar búsqueda"
              >
                <XCircle size={15} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal
            size={14}
            className="shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <select
            value={filtroEstado}
            onChange={(e) => onFiltroEstadoChange(e.target.value)}
            className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-sm text-gray-700 cursor-pointer transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
            aria-label="Filtrar por estado del mensaje"
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        <AnimatePresence>
          {hayFiltros && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              type="button"
              onClick={onLimpiar}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              aria-label="Limpiar todos los filtros"
            >
              <XCircle size={13} aria-hidden="true" />
              Limpiar
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
