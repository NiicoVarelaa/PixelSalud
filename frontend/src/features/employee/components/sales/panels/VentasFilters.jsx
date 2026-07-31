import { Search, X } from "lucide-react";
import CustomSelect from "@features/admin/components/products/components/CustomSelect";

const OPCIONES_ESTADO = [
  { value: "todas", label: "Todas las ventas" },
  { value: "completada", label: "Completadas" },
  { value: "anulada", label: "Anuladas" },
];

const OPCIONES_ORDEN = [
  { value: "mas_nuevo", label: "Más nuevo a más viejo" },
  { value: "mas_viejo", label: "Más viejo a más nuevo" },
];

const VentasFilters = ({ busqueda, setBusqueda, filtroEstado, setFiltroEstado, filtroOrden, setFiltroOrden }) => (
  <div className="mb-4 rounded-2xl border border-gray-100 bg-white/90 p-3 sm:p-4">
    <div className="flex flex-wrap sm:flex-nowrap items-end gap-3">
      <div className="relative w-full sm:flex-1 sm:min-w-[16rem]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por ID o empleado..."
          className="w-full h-[42px] pl-11 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 transition-all hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
        />
        {busqueda && (
          <button
            type="button"
            onClick={() => setBusqueda("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Limpiar búsqueda"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="w-full sm:w-56 lg:w-64">
        <CustomSelect id="ventas-filter-estado" label="Estado" value={filtroEstado} onChange={setFiltroEstado} options={OPCIONES_ESTADO} />
      </div>

      <div className="w-full sm:w-56 lg:w-64">
        <CustomSelect id="ventas-filter-orden" label="Orden" value={filtroOrden} onChange={setFiltroOrden} options={OPCIONES_ORDEN} />
      </div>

      <button
        type="button"
        onClick={() => { setBusqueda(""); setFiltroEstado("todas"); setFiltroOrden("mas_nuevo"); }}
        className="h-[42px] px-4 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:text-green-600 hover:bg-green-50 transition-all cursor-pointer"
      >
        Limpiar
      </button>
    </div>
  </div>
);

export default VentasFilters;
