import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const SearchSuggestions = ({ searchTerm, productos, onClose, isLoading }) => {
  const navigate = useNavigate();

  if (!searchTerm || searchTerm.length < 3) {
    return null;
  }

  // Generar sugerencias de categorías basadas en los productos encontrados
  const categorias = [...new Set(productos.map((p) => p.categoria))].slice(
    0,
    4,
  );

  // Términos de búsqueda sugeridos basados en los productos
  const sugerenciasBusqueda = [
    ...new Set([
      searchTerm.toLowerCase(),
      ...productos.slice(0, 3).map((p) => p.nombreProducto.toLowerCase()),
    ]),
  ].slice(0, 5);

  const handleCategoriaClick = (e, categoria) => {
    e.stopPropagation();
    navigate(`/productos?categoria=${encodeURIComponent(categoria)}`);
    onClose();
  };

  const handleSugerenciaClick = (e, sugerencia) => {
    e.stopPropagation();
    navigate(`/productos?busqueda=${encodeURIComponent(sugerencia)}`);
    onClose();
  };

  const handleProductoClick = (e, idProducto) => {
    e.stopPropagation();
    navigate(`/productos/${idProducto}`);
    onClose();
  };

  const formatPrice = (precio) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(precio);
  };

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-500">Buscando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              No se encontraron productos para "{searchTerm}"
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Intenta con otro término de búsqueda
            </p>
          </div>
        ) : (
          <>
            {/* Sección de Sugerencias */}
            {(sugerenciasBusqueda.length > 0 || categorias.length > 0) && (
              <div className="border-b border-gray-100">
                <div className="p-3 sm:p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Sugerencias
                  </h3>
                  <div className="space-y-1">
                    {/* Sugerencias de búsqueda */}
                    {sugerenciasBusqueda.map((sugerencia, index) => (
                      <button
                        key={`busqueda-${index}`}
                        onClick={(e) => handleSugerenciaClick(e, sugerencia)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150 flex items-center justify-between group"
                      >
                        <span className="capitalize">{sugerencia}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                      </button>
                    ))}

                    {/* Categorías relacionadas */}
                    {categorias.map((categoria) => (
                      <button
                        key={`categoria-${categoria}`}
                        onClick={(e) => handleCategoriaClick(e, categoria)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-150 flex items-center justify-between group"
                      >
                        <span className="capitalize">{categoria}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sección de Productos */}
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Productos para "{searchTerm}"
                </h3>
                <button
                  onClick={() => {
                    navigate(
                      `/productos?busqueda=${encodeURIComponent(searchTerm)}`,
                    );
                    onClose();
                  }}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Ver todos
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {productos.slice(0, 6).map((producto) => (
                  <button
                    key={producto.idProducto}
                    onClick={(e) => handleProductoClick(e, producto.idProducto)}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 text-left group"
                  >
                    {/* Imagen del producto */}
                    <div className="shrink-0 w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                      {producto.img ? (
                        <img
                          src={producto.img}
                          alt={producto.nombreProducto}
                          className="w-full h-full object-contain p-1"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex items-center justify-center text-gray-300"
                        style={{ display: producto.img ? "none" : "flex" }}
                      >
                        <svg
                          className="w-10 h-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1.5 group-hover:text-primary-700 transition-colors">
                        {producto.nombreProducto}
                      </h4>
                      <div className="flex items-baseline gap-2">
                        <p className="text-lg font-bold text-green-600">
                          {formatPrice(producto.precio)}
                        </p>
                      </div>
                      {producto.stock <= 5 && producto.stock > 0 && (
                        <p className="text-xs text-orange-600 mt-1 font-medium">
                          ¡Solo {producto.stock} disponibles!
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;
