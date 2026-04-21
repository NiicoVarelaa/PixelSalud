import { Search } from "lucide-react";

export const EmptyProductSearchState = () => {
  return (
    <div className="text-gray-400 text-center flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search size={28} className="text-gray-300" aria-hidden="true" />
      </div>
      <p className="text-gray-500 font-medium">
        Busca y selecciona un producto
      </p>
      <p className="text-sm text-gray-400 mt-1">
        Aparecerá aquí para configurar su cantidad.
      </p>
    </div>
  );
};
