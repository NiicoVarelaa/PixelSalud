import { useMemo } from "react";
import { Search, Plus } from "lucide-react";
import CustomSelect from "@features/admin/components/products/components/CustomSelect";

export const EmpleadosFilters = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  totalFiltrados = 0,
  totalEmpleados = 0,
  onCrearEmpleado,
}) => {
  const opcionesEstado = useMemo(
    () => [
      { value: "todos", label: "Todos los empleados" },
      { value: "activos", label: "Activos" },
      { value: "inactivos", label: "Inactivos" },
    ],
    [],
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
      <div className="flex flex-wrap sm:flex-nowrap items-end gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-0">
          <label htmlFor="search-empleados" className="sr-only">
            Buscar empleados
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            id="search-empleados"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="
              w-full h-[42px] pl-11 pr-4 bg-gray-50 
              border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15
            "
            placeholder="Buscar por nombre, DNI, email o ID..."
            aria-label="Buscar empleados"
          />
        </div>

        <div className="w-full sm:w-48">
          <CustomSelect
            id="filter-emp-status"
            label="Estado"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={opcionesEstado}
            hideLabel
          />
        </div>

        <div className="w-full sm:w-auto">
          <button
            onClick={onCrearEmpleado}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-green-600/20 focus-visible:ring-4 focus-visible:ring-green-500/30 outline-none cursor-pointer whitespace-nowrap h-[42px]"
            title="Nuevo Empleado"
            aria-label="Nuevo Empleado"
          >
            <Plus size={18} />
            <span className="text-sm font-medium hidden sm:inline">Nuevo empleado</span>
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs font-medium text-gray-500">
        {totalFiltrados} de {totalEmpleados} empleados visibles
      </p>
    </div>
  );
};
