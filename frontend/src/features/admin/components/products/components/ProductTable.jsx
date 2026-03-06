import PropTypes from "prop-types";
import { Edit2, Power } from "lucide-react";

const ProductTable = ({ products, onEdit, onToggleActive, formatPrice }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <svg
          className="mx-auto h-10 w-10 text-gray-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-gray-600 font-medium text-sm">
          No se encontraron productos
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Producto
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Precio
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Categoría
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.map((product) => (
              <tr
                key={product.idProducto}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {/* Producto (imagen + nombre) */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="shrink-0">
                      <img
                        src={product.img}
                        alt={product.nombreProducto}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/48x48/e5e7eb/6b7280?text=Sin+Imagen")
                        }
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {product.nombreProducto}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Precio */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(+product.precioFinal)}
                  </span>
                </td>

                {/* Categoría */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {product.categoria}
                  </span>
                </td>

                {/* Stock */}
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>

                {/* Estado */}
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>

                {/* Acciones */}
                <td className="px-3 py-3 whitespace-nowrap text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors cursor-pointer"
                      title="Editar producto"
                      aria-label={`Editar ${product.nombreProducto}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onToggleActive(product)}
                      className={`p-2 text-white rounded-lg transition-colors cursor-pointer ${
                        product.activo
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      title={product.activo ? "Desactivar" : "Activar"}
                      aria-label={
                        product.activo
                          ? `Desactivar ${product.nombreProducto}`
                          : `Activar ${product.nombreProducto}`
                      }
                    >
                      <Power className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ProductTable.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      idProducto: PropTypes.number.isRequired,
      nombreProducto: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
      precioFinal: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      categoria: PropTypes.string.isRequired,
      stock: PropTypes.number.isRequired,
      activo: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired,
};

export default ProductTable;
