import { Search, Grid3x3, List, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CampanasFilters = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  vistaMode,
  setVistaMode,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">

      {/* Búsqueda */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Buscar campaña..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full h-9 pl-8.5 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          aria-label="Buscar campaña por nombre"
        />
        <AnimatePresence>
          {busqueda && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => setBusqueda("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
              aria-label="Limpiar búsqueda"
            >
              <XCircle size={15} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Filtro estado */}
      <div
        className="flex rounded-lg border border-gray-200 bg-white p-0.5"
        role="group"
        aria-label="Filtrar por estado"
      >
        {[
          { key: "todos",    label: "Todos"    },
          { key: "activas",  label: "Activas"  },
          { key: "inactivas",label: "Inactivas"},
        ].map((opt) => {
          const active = filtroEstado === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setFiltroEstado(opt.key)}
              className={`h-8 rounded-md px-3 text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                active
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Toggle vista */}
      <div
        className="flex rounded-lg border border-gray-200 bg-white p-0.5"
        role="group"
        aria-label="Modo de vista"
      >
        <button
          type="button"
          onClick={() => setVistaMode("cards")}
          className={`flex h-8 w-8 items-center justify-center rounded-md transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
            vistaMode === "cards"
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
          aria-label="Vista de tarjetas"
          aria-pressed={vistaMode === "cards"}
        >
          <Grid3x3 size={15} />
        </button>
        <button
          type="button"
          onClick={() => setVistaMode("table")}
          className={`flex h-8 w-8 items-center justify-center rounded-md transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
            vistaMode === "table"
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
          aria-label="Vista de tabla"
          aria-pressed={vistaMode === "table"}
        >
          <List size={15} />
        </button>
      </div>
    </div>
  );
};
