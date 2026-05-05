import PropTypes from "prop-types";

const ProductCard = ({ product, onEdit, onToggleActive, formatPrice }) => {
  return (
    <article
      className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-200"
      aria-labelledby={`product-${product.idProducto}-name`}
    >
      <div className="flex gap-3">
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

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="mb-2">
            <h3
              id={`product-${product.idProducto}-name`}
              className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-tight"
            >
              {product.nombreProducto}
            </h3>
            <div className="space-y-1 w-full">
              <p className="text-base font-bold text-green-600">
                {formatPrice(+product.precioFinal)}
              </p>
              {+product.precioRegular !== +product.precioFinal && (
                <p className="text-xs text-gray-500 line-through wrap-break-word">
                  {formatPrice(+product.precioRegular)}
                </p>
              )}
            </div>
          </div>

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
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.activo ? "Activo" : "Inactivo"}
            </span>
          </div>

          <div className="flex gap-2 mt-auto">
            <ProductActions
              className="p-2 rounded-lg flex-1 flex items-center justify-center"
              iconSize={16}
              product={product}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              showTitles
            />
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
    precioRegular: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
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
