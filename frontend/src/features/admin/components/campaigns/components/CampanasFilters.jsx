import { Search, Grid3x3, List } from "lucide-react";

export const CampanasFilters = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  vistaMode,
  setVistaMode,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar campaña por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              aria-label="Buscar campaña"
            />
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            aria-label="Filtrar por estado"
          >
            <option value="todos">Todos</option>
            <option value="activas">Activas</option>
            <option value="inactivas">Inactivas</option>
          </select>

          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setVistaMode("cards")}
              className={`p-2 rounded transition-all ${
                vistaMode === "cards"
                  ? "bg-white shadow text-purple-600"
                  : "text-gray-600 hover:text-purple-600"
              }`}
              aria-label="Vista de tarjetas"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setVistaMode("table")}
              className={`p-2 rounded transition-all ${
                vistaMode === "table"
                  ? "bg-white shadow text-purple-600"
                  : "text-gray-600 hover:text-purple-600"
              }`}
              aria-label="Vista de tabla"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
