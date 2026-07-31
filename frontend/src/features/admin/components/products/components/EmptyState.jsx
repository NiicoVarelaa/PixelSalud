import { PackageOpen } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <PackageOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-600 font-medium">No se encontraron productos</p>
      <p className="text-sm text-gray-500 mt-1">
        Intenta ajustar los filtros de búsqueda
      </p>
    </div>
  );
};

export default EmptyState;
