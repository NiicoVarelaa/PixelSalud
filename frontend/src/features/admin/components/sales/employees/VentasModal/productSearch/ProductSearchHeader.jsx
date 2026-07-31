import { Search } from "lucide-react";
import Default from "@assets/default.webp";
import CustomSelect from "../CustomSelect";

export const ProductSearchHeader = ({
  terminoBusqueda,
  setTerminoBusqueda,
  resultadosBusqueda,
  onSelectFromSearch,
  filtroCategoria,
  setFiltroCategoria,
  opcionesCategoria,
  getProductImage,
}) => {
  return (
    <div className="p-4 sm:p-5 border-b border-gray-100 bg-white shrink-0">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
        Búsqueda de Productos
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <label
            htmlFor="search-product"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1"
          >
            Buscar
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="search-product"
              type="search"
              autoComplete="off"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all hover:border-gray-300"
              placeholder="Nombre o código..."
              value={terminoBusqueda}
              onChange={(event) => setTerminoBusqueda(event.target.value)}
            />
          </div>

          {resultadosBusqueda.length > 0 && (
            <ul
              className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-50"
              role="listbox"
            >
              {resultadosBusqueda.map((producto) => (
                <li
                  key={producto.idProducto}
                  role="option"
                  aria-selected="false"
                  tabIndex="0"
                  onClick={() => onSelectFromSearch(producto)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      onSelectFromSearch(producto);
                    }
                  }}
                  className="p-3 sm:p-4 hover:bg-green-50 cursor-pointer flex justify-between items-center gap-3 transition-colors focus-visible:bg-green-50 outline-none"
                >
                  <div className="flex min-w-0 items-center gap-3 flex-1">
                    <div className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                      <img
                        src={getProductImage(producto)}
                        alt={producto.nombreProducto}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = Default;
                        }}
                      />
                    </div>

                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {producto.nombreProducto}
                      </p>
                      <p className="text-sm font-bold text-green-600 mt-0.5">
                        ${producto.precio}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                    Stock: {producto.stock}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full sm:w-2/5">
          <CustomSelect
            id="filter-category"
            label="Categoría"
            value={filtroCategoria}
            onChange={setFiltroCategoria}
            options={opcionesCategoria}
          />
        </div>
      </div>
    </div>
  );
};
