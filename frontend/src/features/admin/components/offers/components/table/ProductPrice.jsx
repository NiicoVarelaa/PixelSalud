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
        <p
          className={`text-xl font-bold ${tieneOferta ? "text-orange-600" : "text-gray-900"}`}
        >
          {formatearPrecio(precioConDescuento)}
        </p>
        {tieneOferta && (
          <p className="text-xs text-gray-400 line-through">
            {formatearPrecio(precioRegular)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span
        className={`font-semibold ${tieneOferta ? "text-orange-600 text-sm" : "text-gray-900 text-sm"}`}
      >
        {formatearPrecio(precioConDescuento)}
      </span>
      {tieneOferta && (
        <span className="text-xs text-gray-400 line-through">
          {formatearPrecio(precioRegular)}
        </span>
      )}
    </div>
  );
};
