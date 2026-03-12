import { Search } from "lucide-react";
import { useVentasOnlineStore } from "../../sales/store/useVentasOnlineStore";

export const VentasOnlineFilters = () => {
  const { filtro, filtroEstado, setFiltro, setFiltroEstado } =
    useVentasOnlineStore();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={18} />
        </div>
        <input
          type="text"
          placeholder="Buscar por ID, DNI o Cliente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
        />
      </div>
      <div className="w-full md:w-48">
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
        >
          <option value="todas">📁 Todas</option>
          <option value="Pendiente">⏳ Pendiente</option>
          <option value="Retirado">✅ Retirado</option>
          <option value="Cancelado">🚫 Cancelado</option>
        </select>
      </div>
    </div>
  );
};
