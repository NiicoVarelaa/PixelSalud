import { formatearPrecio } from "./utils";

export const ProductPrice = ({
  precioRegular,
  precioConDescuento,
  tieneOferta,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Precio actual</p>
        {tieneOferta && (
          <p className="text-sm text-gray-400 line-through font-medium">
            {formatearPrecio(precioRegular)}
          </p>
        )}
        <p
          className={`text-2xl font-bold ${tieneOferta ? "text-red-600" : "text-gray-900"}`}
        >
          {formatearPrecio(precioConDescuento)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {tieneOferta && (
        <span className="text-sm text-gray-400 line-through font-medium">
          {formatearPrecio(precioRegular)}
        </span>
      )}
      <span
        className={`font-bold ${tieneOferta ? "text-red-600 text-lg" : "text-gray-900 text-base"}`}
      >
        {formatearPrecio(precioConDescuento)}
      </span>
    </div>
  );
};
