import { Search } from "lucide-react";
import CustomSelect from "@features/admin/components/products/components/CustomSelect";

const OPCIONES_ESTADO = [
  { value: "todos", label: "Todos los mensajes" },
  { value: "nuevo", label: "Nuevos" },
  { value: "en_proceso", label: "En proceso" },
  { value: "respondido", label: "Respondidos" },
  { value: "cerrado", label: "Cerrados" },
];

export const MensajesFilters = ({
  filtroEstado,
  setFiltroEstado,
  busqueda,
  setBusqueda,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
      <div className="flex flex-wrap sm:flex-nowrap items-end gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-0">
          <label htmlFor="search-mensajes" className="sr-only">
            Buscar mensajes
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            id="search-mensajes"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="
              w-full h-[42px] pl-11 pr-4 bg-gray-50 
              border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500/15
            "
            placeholder="Buscar por nombre, email o asunto..."
            aria-label="Buscar mensajes"
          />
        </div>

        <div className="w-full sm:w-48">
          <CustomSelect
            id="filter-mensaje-estado"
            label="Estado"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={OPCIONES_ESTADO}
            hideLabel
          />
        </div>
      </div>
    </div>
  );
};
