import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FolderOpen,
} from "lucide-react";
import { useVentasStore } from "../store/useVentasStore";

export const VentasFilters = () => {
  const { filtro, filtroEstado, setFiltro, setFiltroEstado } = useVentasStore();

  // Estados disponibles con iconos y colores
  const estados = [
    {
      value: "todas",
      label: "Todas las ventas",
      icon: FolderOpen,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      value: "completada",
      label: "Completadas",
      icon: CheckCircle2,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
    },
    {
      value: "anulada",
      label: "Anuladas",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const estadoActual = estados.find((e) => e.value === filtroEstado);
  const IconoEstado = estadoActual?.icon || Filter;

  return (
    <div
      className="mb-4 sm:mb-6 space-y-3 sm:space-y-0"
      role="search"
      aria-label="Filtros de búsqueda de ventas"
    >
      {/* Container flex para desktop */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Búsqueda de texto - Full width en mobile */}
        <div className="relative flex-1 sm:max-w-md">
          <label htmlFor="search-ventas" className="sr-only">
            Buscar ventas por ID, DNI o nombre de empleado
          </label>

          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} aria-hidden="true" />
          </div>

          <input
            id="search-ventas"
            type="search"
            inputMode="search"
            placeholder="Buscar por ID, DNI o empleado..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="
              w-full h-11 pl-10 sm:pl-11 pr-4 
              bg-white border border-gray-300 rounded-lg
              text-sm sm:text-base text-gray-900 placeholder-gray-500
              transition-all duration-200
              hover:border-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            "
            aria-describedby="search-hint"
          />

          {/* Indicador de búsqueda activa */}
          {filtro && (
            <button
              type="button"
              onClick={() => setFiltro("")}
              className="
                absolute inset-y-0 right-0 pr-3 flex items-center
                text-gray-400 hover:text-gray-600 transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded
              "
              aria-label="Limpiar búsqueda"
            >
              <XCircle size={18} />
            </button>
          )}

          <span id="search-hint" className="sr-only">
            Escribe para filtrar ventas por ID, DNI del empleado o nombre
          </span>
        </div>

        {/* Selector de estado - Natural width en mobile */}
        <div className="relative sm:w-52">
          <label htmlFor="filter-estado" className="sr-only">
            Filtrar por estado de venta
          </label>

          {/* Indicador visual del estado seleccionado (solo desktop) */}
          <div className="hidden sm:flex absolute inset-y-0 left-0 pl-3 items-center pointer-events-none">
            <IconoEstado
              className={estadoActual?.color || "text-gray-400"}
              size={18}
              aria-hidden="true"
            />
          </div>

          <select
            id="filter-estado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className={`
              w-full h-11 pl-3 sm:pl-10 pr-10 
              bg-white border border-gray-300 rounded-lg
              text-sm sm:text-base text-gray-900
              font-medium cursor-pointer
              transition-all duration-200
              appearance-none
              hover:border-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${estadoActual?.bgColor || ""}
            `}
            aria-label="Seleccionar estado de venta"
          >
            {estados.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>

          {/* Flecha personalizada del select */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Indicador de filtros activos (solo visible cuando hay filtros) */}
      {(filtro || filtroEstado !== "todas") && (
        <div
          className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2"
          role="status"
          aria-live="polite"
        >
          <Filter size={14} className="text-primary-600" aria-hidden="true" />
          <span>
            {filtro && filtroEstado !== "todas"
              ? `Buscando "${filtro}" en ${estadoActual?.label.toLowerCase()}`
              : filtro
                ? `Buscando: "${filtro}"`
                : `Mostrando: ${estadoActual?.label.toLowerCase()}`}
          </span>
          <button
            type="button"
            onClick={() => {
              setFiltro("");
              setFiltroEstado("todas");
            }}
            className="
              ml-auto text-primary-700 hover:text-primary-800 font-medium
              underline decoration-primary-300 hover:decoration-primary-500
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded px-1
            "
            aria-label="Limpiar todos los filtros"
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
};
