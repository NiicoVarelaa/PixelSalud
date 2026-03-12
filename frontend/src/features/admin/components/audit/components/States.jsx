import { Activity, FileText, AlertCircle } from "lucide-react";

export const LoadingState = () => (
  <tr>
    <td colSpan="6" className="px-6 py-12 text-center">
      <div className="flex flex-col items-center gap-3">
        <Activity className="w-8 h-8 text-gray-400 animate-spin" />
        <p className="text-gray-500">Cargando auditorías...</p>
      </div>
    </td>
  </tr>
);

export const EmptyState = () => (
  <tr>
    <td colSpan="6" className="px-6 py-12 text-center">
      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">
        No se encontraron registros con los filtros aplicados
      </p>
    </td>
  </tr>
);

export const ErrorBanner = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
    <AlertCircle className="w-5 h-5 text-red-600" />
    <p className="text-red-800">{error}</p>
  </div>
);
