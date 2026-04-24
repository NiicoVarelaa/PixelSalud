import { useMemo } from "react";
import { Search, XCircle } from "lucide-react";
import CustomSelect from "../../../products/components/CustomSelect";
import { useVentasOnlineStore } from "../store/useVentasOnlineStore";

export const VentasOnlineFilters = () => {
  const {
    filtro,
    filtroEstado,
    filtroOrden,
    setFiltro,
    setFiltroEstado,
    setFiltroOrden,
  } = useVentasOnlineStore();

  const opcionesEstado = useMemo(
    () => [
      { value: "todas", label: "Todos los estados" },
      { value: "pendiente", label: "Pendiente" },
      { value: "retirado", label: "Retirado" },
      { value: "cancelado", label: "Cancelado" },
    ],
    [],
  );

  const opcionesOrden = useMemo(
    () => [
      { value: "mas_nuevo", label: "Mas nuevo a mas viejo" },
      { value: "mas_viejo", label: "Mas viejo a mas nuevo" },
    ],
    [],
  );

  return (
    <div
      className="relative z-20 mb-4 sm:mb-6 space-y-3 rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm p-3 sm:p-4"
      role="search"
      aria-label="Filtros de búsqueda de ventas online"
    >
      <div className="flex flex-wrap sm:flex-nowrap items-end gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-[16rem]">
          <label htmlFor="search-ventas-online" className="sr-only">
            Buscar ventas online por ID, DNI o cliente
          </label>

          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} aria-hidden="true" />
          </div>

          <input
            id="search-ventas-online"
            type="text"
            placeholder="Buscar por id, cliente"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="
              w-full h-[42px] pl-10 sm:pl-11 pr-4
              bg-gray-50 border border-gray-200 rounded-xl
              text-sm sm:text-base text-gray-900 placeholder-gray-500
              transition-all duration-200
              hover:border-gray-300 hover:bg-white
              focus:outline-none focus:ring-2 focus:ring-primary-700/40 focus:border-primary-700
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            "
            aria-describedby="search-online-hint"
          />

          {filtro && (
            <button
              type="button"
              onClick={() => setFiltro("")}
              className="
                absolute inset-y-0 right-0 pr-3 flex items-center
                text-gray-400 hover:text-gray-600 transition-colors cursor-pointer
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700/40 rounded
              "
              aria-label="Limpiar búsqueda"
            >
              <XCircle size={18} />
            </button>
          )}

          <span id="search-online-hint" className="sr-only">
            Escribe para filtrar ventas online por ID, DNI o nombre de cliente
          </span>
        </div>

        <div className="w-full sm:w-56 lg:w-64">
          <CustomSelect
            id="ventas-online-filter-estado"
            label="Estado"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={opcionesEstado}
          />
        </div>

        <div className="w-full sm:w-56 lg:w-64">
          <CustomSelect
            id="ventas-online-filter-orden"
            label="Orden"
            value={filtroOrden}
            onChange={setFiltroOrden}
            options={opcionesOrden}
          />
        </div>

        <div className="w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setFiltro("");
              setFiltroEstado("todas");
              setFiltroOrden("mas_nuevo");
            }}
            className="
              block w-full sm:w-auto h-[42px] px-4 sm:px-5 rounded-xl border border-gray-200
              bg-white text-gray-700 font-semibold text-sm sm:text-base hover:text-primary-700 hover:bg-primary-50/60
              transition-all duration-200 cursor-pointer shadow-xs
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:border-primary-500
            "
            aria-label="Limpiar todos los filtros"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};
