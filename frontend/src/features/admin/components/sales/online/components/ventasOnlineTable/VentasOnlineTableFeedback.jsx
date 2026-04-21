import { Eye } from "lucide-react";
import { normalizeEstado } from "./utils/ventasOnlineTable.utils";

export const VentasOnlineTableLoading = () => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
      role="status"
      aria-live="polite"
    >
      <div className="p-8 sm:p-12 text-center">
        <div
          className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-3 border-primary-600 border-t-transparent mx-auto mb-4"
          aria-hidden="true"
        />
        <p className="text-sm sm:text-base text-gray-600 font-medium">
          Cargando pedidos online...
        </p>
      </div>
    </div>
  );
};

export const VentasOnlineTableEmpty = ({ filtro, filtroEstado }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center"
      role="status"
    >
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
        aria-hidden="true"
      >
        <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
        No se encontraron ventas
      </h3>
      <p className="text-sm sm:text-base text-gray-600">
        {filtro || normalizeEstado(filtroEstado) !== "todas"
          ? "Intenta ajustar los filtros de búsqueda"
          : "No hay ventas online registradas todavía"}
      </p>
    </div>
  );
};
