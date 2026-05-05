const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const ProductCardPricing = ({
  product,
  isOffert,
  isPromoDosPorUno,
  regularPrice,
  priceToDisplay,
  precioSinImpuestos,
}) => {
  return (
    <div className="p-4 flex flex-col flex-1 justify-between">
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {product.categoria}
          </p>
        </div>

        <div className="min-h-12 flex items-center">
          <h3
            className="text-gray-900 font-bold text-base leading-tight line-clamp-2 group-hover:text-primary-700 transition-colors duration-300"
            title={product.nombreProducto}
          >
            {product.nombreProducto}
          </h3>
        </div>
      </div>

      <div className="mt-4 space-y-2 min-h-15">
        <div className="space-y-1 min-h-8">
          <p
            className={`font-black whitespace-nowrap ${isOffert ? "text-xl text-red-600" : "text-xl text-gray-900"}`}
          >
            {currencyFormatter.format(priceToDisplay)}
          </p>

          {isOffert && regularPrice && (
            <p className="text-sm text-gray-500 line-through font-medium">
              {currencyFormatter.format(regularPrice)}
            </p>
          )}
        </div>

        <p className="text-xs text-gray-500">
          Precio sin impuestos: {currencyFormatter.format(precioSinImpuestos)}
        </p>

        {isPromoDosPorUno && (
          <p className="text-xs text-primary-700 font-semibold">
            Llevas 2 y pagas 1
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCardPricing;
