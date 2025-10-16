import { Link } from "react-router-dom";
import { useCarritoStore } from "../store/useCarritoStore";
import BotonFavorito from "./BotonFavorito";
import { Minus, Plus } from "lucide-react";

const CardProductos = ({ product }) => {
  const {
    carrito,
    agregarCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
  } = useCarritoStore();

  const itemEnCarrito = carrito.find(
    (item) => item.idProducto === product.idProducto
  );
  const cantidadEnCarrito = itemEnCarrito?.cantidad || 0;

  const precioSinImpuestos = product.precio / 1.21;

  const handleAgregar = (e) => {
    e.stopPropagation();
    agregarCarrito(product);
  };

  const handleDisminuir = (e) => {
    e.stopPropagation();
    if (cantidadEnCarrito === 1) {
      eliminarDelCarrito(product.idProducto);
    } else {
      disminuirCantidad(product.idProducto);
    }
  };

  const handleAumentar = (e) => {
    e.stopPropagation();
    aumentarCantidad(product.idProducto);
  };

  return (
    <div className="relative border-2 border-gray-100 rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary-700 w-full h-full flex flex-col group overflow-hidden">
      <BotonFavorito product={product} />

      <Link
        to={`/productos/${product.idProducto}`}
        className="flex flex-col flex-1"
      >
        <div className="w-full h-48 flex items-center justify-center p-4 overflow-hidden bg-white rounded-t-xl">
          <img
            src={product.img}
            alt={product.nombreProducto}
            className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium tracking-wide ">
              {product.categoria}
            </p>
            <p
              className="text-gray-900 font-extrabold text-xl line-clamp-2 mt-1 min-h-[56px]"
              title={product.nombreProducto}
            >
              {product.nombreProducto}
            </p>
          </div>

          <div>
            <p className="text-primary-700 font-black text-2xl mt-2">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(product.precio)}
            </p>
            <p className="text-xs text-gray-500 -mt-1">
              Precio sin impuestos:{" "}
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(precioSinImpuestos)}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 h-[92px] flex flex-col justify-center">
        {cantidadEnCarrito === 0 ? (
          <button
            onClick={handleAgregar}
            aria-label="Agregar al carrito"
            className="flex items-center justify-center gap-2 w-full px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Agregar
          </button>
        ) : (
          <div className="flex flex-col gap-2 animate-fade-in"> 
            <div className="flex items-stretch justify-between w-full rounded-full overflow-hidden border border-primary-700 bg-white shadow-sm">
              <button
                onClick={handleDisminuir}
                className="flex items-center justify-center w-12 py-3 text-base font-bold text-gray-700 bg-white hover:bg-red-50 hover:text-red-600 active:bg-red-100 transition-all duration-150 cursor-pointer border-r border-gray-200"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center flex-1 px-4 py-2">
                <span className="text-lg font-bold text-gray-900">
                  {cantidadEnCarrito}
                </span>
              </div>

              <button
                onClick={handleAumentar}
                className="flex items-center justify-center w-12 py-3 text-base font-bold text-gray-700 bg-white hover:bg-primary-100 hover:text-primary-700 active:bg-primary-100 transition-all duration-150 cursor-pointer border-l border-gray-200"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                eliminarDelCarrito(product.idProducto);
              }}
              className="text-xs text-gray-500 hover:text-red-500 font-medium transition-colors duration-150 self-center py-1 cursor-pointer"
            >
              Quitar del carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardProductos;