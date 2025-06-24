import React from 'react';
import { useCarritoStore } from '../store/useCarritoStore';
import { FaShoppingCart, FaStar, FaRegStar } from 'react-icons/fa';

const CardProductos = ({ product, currency = "$" }) => {
  const {
    carrito,
    agregarCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
  } = useCarritoStore();

  const itemEnCarrito = carrito.find(item => item.idProducto === product.idProducto);
  const cantidad = itemEnCarrito?.cantidad || 0;

  return (
    <div className="border border-gray-200 rounded-md bg-white shadow hover:shadow-md transition duration-200 w-full h-full flex flex-col">
      
      {/* Imagen */}
      <div className="w-full h-48 flex items-center justify-center p-4 overflow-hidden">
        <img
          src={product.img}
          alt={product.nombreProducto}
          className="max-h-full object-contain group-hover:scale-105 transition"
        />
      </div>

      {/* Información */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="mb-2">
          <p className="text-gray-400 text-sm">{product.categoria}</p>
          <p className="text-gray-800 font-semibold text-base truncate">
            {product.nombreProducto}
          </p>

          <div className="flex items-center gap-1 text-yellow-500 mt-1">
            {[...Array(5)].map((_, i) =>
              i < 4 ? (
                <FaStar key={i} className="w-4 h-4" />
              ) : (
                <FaRegStar key={i} className="w-4 h-4" />
              )
            )}
            <span className="text-xs text-gray-400 ml-1">(4)</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <p className="text-green-600 font-bold text-lg">
            {currency}{product.precio}
          </p>

          <div onClick={(e) => e.stopPropagation()} className="text-green-600">
            {cantidad === 0 ? (
              <button
                className="flex items-center gap-2 px-3 py-1 text-sm border border-green-300 rounded hover:bg-green-100 transition"
                onClick={() => agregarCarrito(product)}
              >
                <FaShoppingCart className="w-4 h-4" />
                Add
              </button>
            ) : (
              <div className="flex items-center gap-2 px-2 py-1 bg-green-100 rounded">
                <button
                  onClick={() =>
                    cantidad === 1
                      ? eliminarDelCarrito(product.idProducto)
                      : disminuirCantidad(product.idProducto)
                  }
                  className="text-sm px-2"
                >
                  -
                </button>
                <span className="w-5 text-center">{cantidad}</span>
                <button
                  onClick={() => aumentarCantidad(product.idProducto)}
                  className="text-sm px-2"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProductos;
