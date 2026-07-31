import { Search, X, CheckSquare2, Square } from "lucide-react";
import Default from "@assets/default.webp";
import { getProductoImageUrl } from "../utils/formatters";
import { useProductFilters } from "../hooks/useProductFilters";

export const ProductSelector = ({
  productos,
  categorias,
  idsProductosBloqueados = [],
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
    idsProductosBloqueados,
  });

  const todosSeleccionados =
    productosDisponibles.length > 0 &&
    productosSeleccionados.length === productosDisponibles.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Productos
          </p>
          <p className="text-sm font-medium text-gray-900">
            {productosSeleccionados.length} seleccionados
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onSeleccionarTodos(
              productosDisponibles.map((producto) => producto.idProducto),
            )
          }
          className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 hover:bg-gray-50 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          {todosSeleccionados ? "Desmarcar todos" : "Seleccionar todos"}
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full h-9 pl-8 pr-8 rounded-lg border border-gray-200 bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
            aria-label="Buscar producto en la lista"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => onBusquedaChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={categoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-sm text-gray-700 cursor-pointer focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div
        className="max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-2"
        role="listbox"
        aria-label="Productos disponibles"
        aria-multiselectable="true"
      >
        {productosDisponibles.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No se encontraron productos
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {productosDisponibles.map((producto) => {
              const isSelected = productosSeleccionados.includes(
                producto.idProducto,
              );
              return (
                <button
                  key={producto.idProducto}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onToggleProducto(producto.idProducto)}
                  className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                    isSelected
                      ? "border-green-400 bg-green-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare2
                      size={16}
                      className="shrink-0 text-green-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <Square
                      size={16}
                      className="shrink-0 text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={getProductoImageUrl(producto)}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain"
                      onError={(e) => (e.target.src = Default)}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-gray-800">
                      {producto.nombreProducto}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {producto.categoria}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-right text-xs text-gray-400">
        {productosDisponibles.length} productos encontrados
      </p>
    </div>
  );
};
