import { Package } from "lucide-react";

const EmptyState = ({ search }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-4">
      <Package size={24} className="text-gray-400" />
    </div>
    {search ? (
      <>
        <p className="text-sm font-semibold text-gray-700">Sin resultados</p>
        <p className="mt-1 text-xs text-gray-400">No se encontraron productos con "{search}"</p>
      </>
    ) : (
      <>
        <p className="text-sm font-semibold text-gray-700">No hay productos</p>
        <p className="mt-1 text-xs text-gray-400">El inventario está vacío</p>
      </>
    )}
  </div>
);

export default EmptyState;
