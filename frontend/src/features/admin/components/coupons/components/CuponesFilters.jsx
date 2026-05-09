import { useMemo } from "react";
import { Search, Plus, Download } from "lucide-react";
import CustomSelect from "@features/admin/components/products/components/CustomSelect";
import { exportarCuponesCSV } from "../utils/exportCSV";

export const CuponesFilters = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroTipo,
  setFiltroTipo,
  onResetPaginacion,
  onCrearCupon,
  cuponesFiltrados,
}) => {
  const handleBusqueda = (v) => {
    setBusqueda(v);
    onResetPaginacion();
  };
  const handleEstado = (v) => {
    setFiltroEstado(v);
    onResetPaginacion();
  };
  const handleTipo = (v) => {
    setFiltroTipo(v);
    onResetPaginacion();
  };

  const opcionesEstado = useMemo(
    () => [
      { value: "todos", label: "Todos los estados" },
      { value: "activo", label: "Activos" },
      { value: "inactivo", label: "Inactivos" },
      { value: "expirado", label: "Expirados" },
    ],
    [],
  );

  const opcionesTipo = useMemo(
    () => [
      { value: "todos", label: "Todos los usuarios" },
      { value: "nuevo", label: "Nuevos" },
      { value: "vip", label: "VIP" },
    ],
    [],
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
      <div className="flex flex-wrap sm:flex-nowrap items-end gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-0">
          <label htmlFor="search-cupones" className="sr-only">
            Buscar cupones
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            id="search-cupones"
            value={busqueda}
            onChange={(e) => handleBusqueda(e.target.value)}
            className="
              w-full h-[42px] pl-11 pr-4 bg-gray-50 
              border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15
            "
            placeholder="Buscar por codigo o descripcion..."
            aria-label="Buscar cupones"
          />
        </div>

        <div className="w-full sm:w-44">
          <CustomSelect
            id="filter-cupon-estado"
            label="Estado"
            value={filtroEstado}
            onChange={handleEstado}
            options={opcionesEstado}
            hideLabel
          />
        </div>

        <div className="w-full sm:w-44">
          <CustomSelect
            id="filter-cupon-tipo"
            label="Tipo usuario"
            value={filtroTipo}
            onChange={handleTipo}
            options={opcionesTipo}
            hideLabel
          />
        </div>

        <div className="w-full sm:w-auto">
          <button
            onClick={() => exportarCuponesCSV(cuponesFiltrados)}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2.5 rounded-xl transition-all border border-gray-200 focus-visible:ring-4 focus-visible:ring-green-500/30 outline-none cursor-pointer whitespace-nowrap h-[42px]"
            title="Exportar cupones"
            aria-label="Exportar cupones a CSV"
          >
            <Download size={18} />
            <span className="text-sm font-medium hidden sm:inline">Exportar</span>
          </button>
        </div>

        <div className="w-full sm:w-auto">
          <button
            onClick={onCrearCupon}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-green-600/20 focus-visible:ring-4 focus-visible:ring-green-500/30 outline-none cursor-pointer whitespace-nowrap h-[42px]"
            title="Crear cupon"
            aria-label="Crear cupon"
          >
            <Plus size={18} />
            <span className="text-sm font-medium hidden sm:inline">Crear cupon</span>
          </button>
        </div>
      </div>
    </div>
  );
};
