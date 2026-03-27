import { useProductStore } from "@store/useProductStore";

export const ProductSidebar = ({ filtroCategoria, updateParams, campanaActiva }) => {
  const { categorias } = useProductStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-3 border-b border-gray-200">
        <h2 className="font-medium text-gray-800 text-sm uppercase">Categorías</h2>
      </div>
      <div className="p-1">
        <button
          onClick={() => updateParams("categoria", "todos", true)}
          className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-colors cursor-pointer ${
            filtroCategoria === "todos"
              ? "bg-primary-50 text-primary-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Todos
        </button>

        {campanaActiva && (
          <button
            onClick={() => updateParams("categoria", campanaActiva.nombreCampana, true)}
            className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-colors cursor-pointer ${
              filtroCategoria === campanaActiva.nombreCampana
                ? "bg-primary-50 text-primary-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {campanaActiva.nombreCampana}
          </button>
        )}

        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParams("categoria", cat, true)}
            className={`w-full text-left px-3 py-2 rounded text-sm flex items-center transition-colors ${
              filtroCategoria === cat
                ? "bg-primary-50 text-primary-700 font-medium cursor-pointer"
                : "text-gray-600 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};