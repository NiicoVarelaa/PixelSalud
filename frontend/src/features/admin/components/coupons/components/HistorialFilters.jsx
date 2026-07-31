import { useMemo } from "react";
import { Search } from "lucide-react";
import CustomSelect from "@features/admin/components/products/components/CustomSelect";

export const HistorialFilters = ({
  busqueda,
  setBusqueda,
  filtroCodigo,
  setFiltroCodigo,
  opcionesCodigo,
}) => {
  const opcionesCodigoConTodos = useMemo(
    () => [{ value: "todos", label: "Todos los cupones" }, ...opcionesCodigo],
    [opcionesCodigo]
  );

  return (
    <div className="border-b border-gray-100 bg-white p-3 sm:p-4">
      <div className="flex flex-wrap sm:flex-nowrap items-end gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-0">
          <label htmlFor="search-historial" className="sr-only">
            Buscar en historial
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            id="search-historial"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full h-[42px] pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15"
            placeholder="Buscar por codigo, cliente o email..."
            aria-label="Buscar en historial"
          />
        </div>

        {opcionesCodigo.length > 0 && (
          <div className="w-full sm:w-48">
            <CustomSelect
              id="filter-historial-codigo"
              label="Cupon"
              value={filtroCodigo}
              onChange={setFiltroCodigo}
              options={opcionesCodigoConTodos}
              hideLabel
            />
          </div>
        )}
      </div>
    </div>
  );
};
