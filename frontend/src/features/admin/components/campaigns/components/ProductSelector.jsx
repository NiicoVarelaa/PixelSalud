import { Search, Filter, X, Package, CheckSquare, Square } from "lucide-react";
import Default from "@assets/default.webp";
import { getProductoImageUrl } from "../utils/formatters";
import { useProductFilters } from "../hooks/useProductFilters";

export const ProductSelector = ({
  productos,
  categorias,
  productosSeleccionados,
  onToggleProducto,
  onSeleccionarTodos,
  busqueda,
  onBusquedaChange,
  categoria,
  onCategoriaChange,
}) => {
  const { productosDisponibles } = useProductFilters({
    productos,
    busquedaProducto: busqueda,
    categoriaFiltro: categoria,
  });

  const todosSeleccionados =
    productosDisponibles.length > 0 &&
    productosSeleccionados.length === productosDisponibles.length;

  return (
    <div className="border-2 border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Productos de la Campaña ({productosSeleccionados.length}{" "}
          seleccionados)
        </h3>
        <button
          onClick={onSeleccionarTodos}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all"
        >
          {todosSeleccionados ? "Desmarcar Todos" : "Seleccionar Todos"}
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {busqueda && (
              <button
                onClick={() => onBusquedaChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="min-w-[200px]">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoria}
              onChange={(e) => onCategoriaChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(busqueda || categoria) && (
          <button
            onClick={() => {
              onBusquedaChange("");
              onCategoriaChange("");
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Grid de Productos */}
      <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
        {productosDisponibles.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No se encontraron productos
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-3">
              {productosDisponibles.length} productos encontrados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {productosDisponibles.map((producto) => {
                const isSelected = productosSeleccionados.includes(
                  producto.idProducto,
                );
                return (
                  <div
                    key={producto.idProducto}
                    onClick={() => onToggleProducto(producto.idProducto)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                      isSelected
                        ? "bg-purple-50 border-purple-500"
                        : "bg-white border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="shrink-0">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="w-12 h-12 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={getProductoImageUrl(producto)}
                        alt={producto.nombreProducto}
                        className="w-full h-full object-contain"
                        onError={(e) => (e.target.src = Default)}
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {producto.nombreProducto}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {producto.categoria}
                      </p>
                      <p className="text-sm font-bold text-purple-600">
                        ${producto.precio}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
