import PropTypes from "prop-types";
import { Edit2, Power } from "lucide-react";

const ProductCard = ({ product, onEdit, onToggleActive, formatPrice }) => {
  return (
    <article
      className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-200"
      aria-labelledby={`product-${product.idProducto}-name`}
    >
      <div className="flex gap-3">
        {/* Imagen */}
        <div className="shrink-0">
          <img
            src={product.img}
            alt={product.nombreProducto}
            className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm"
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/80x80/e5e7eb/6b7280?text=Sin+Imagen")
            }
          />
        </div>

        {/* Información y Acciones */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header: Nombre y Precio */}
          <div className="mb-2">
            <h3
              id={`product-${product.idProducto}-name`}
              className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-tight"
            >
              {product.nombreProducto}
            </h3>
            <p className="text-base font-bold text-green-600">
              {formatPrice(+product.precioFinal)}
            </p>
          </div>

          {/* Info compacta */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs text-gray-500">{product.categoria}</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                product.activo
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {product.activo ? "Activo" : "Inactivo"}
            </span>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 px-3 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              title="Editar producto"
              aria-label={`Editar ${product.nombreProducto}`}
            >
              <Edit2 className="h-4 w-4" />
              <span className="text-xs font-medium">Editar</span>
            </button>
            <button
              onClick={() => onToggleActive(product)}
              className={`flex-1 px-3 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
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
              <span className="text-xs font-medium">
                {product.activo ? "Desactivar" : "Activar"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    idProducto: PropTypes.number.isRequired,
    nombreProducto: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    precioFinal: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    categoria: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    activo: PropTypes.bool.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired,
};

export default ProductCard;
