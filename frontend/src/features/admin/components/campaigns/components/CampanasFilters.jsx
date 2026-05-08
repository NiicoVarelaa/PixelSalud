import { useMemo } from "react";
import { Search, Plus, Grid3x3, List } from "lucide-react";
import CustomSelect from "@features/admin/components/products/components/CustomSelect";

export const CampanasFilters = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  vistaMode,
  setVistaMode,
  onCrearCampana,
}) => {
  const opcionesEstado = useMemo(
    () => [
      { value: "todos", label: "Todas las campanas" },
      { value: "activas", label: "Activas" },
      { value: "inactivas", label: "Inactivas" },
    ],
    [],
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
      <div className="flex flex-wrap sm:flex-nowrap items-end gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-0">
          <label htmlFor="search-campanas" className="sr-only">
            Buscar campanas
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            id="search-campanas"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="
              w-full h-[42px] pl-11 pr-4 bg-gray-50 
              border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15
            "
            placeholder="Buscar campana..."
            aria-label="Buscar campanas por nombre"
          />
        </div>

        <div className="w-full sm:w-48">
          <CustomSelect
            id="filter-campana-status"
            label="Estado"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={opcionesEstado}
            hideLabel
          />
        </div>

        <div
          className="flex rounded-lg border border-gray-200 bg-white p-0.5 shrink-0 h-[42px]"
          role="group"
          aria-label="Modo de vista"
        >
          <button
            type="button"
            onClick={() => setVistaMode("cards")}
            className={`flex h-full w-9 items-center justify-center rounded-md transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
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
            className={`flex h-full w-9 items-center justify-center rounded-md transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
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

        <div className="w-full sm:w-auto">
          <button
            onClick={onCrearCampana}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-green-600/20 focus-visible:ring-4 focus-visible:ring-green-500/30 outline-none cursor-pointer whitespace-nowrap h-[42px]"
            title="Nueva Campana"
            aria-label="Nueva Campana"
          >
            <Plus size={18} />
            <span className="text-sm font-medium hidden sm:inline">Nueva campana</span>
          </button>
        </div>
      </div>
    </div>
  );
};
