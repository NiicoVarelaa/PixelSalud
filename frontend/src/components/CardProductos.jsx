import { useCarritoStore } from "../store/useCarritoStore";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

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
  const cantidad = itemEnCarrito?.cantidad || 0;

  const handleAgregar = (e) => {
    e.stopPropagation();
    agregarCarrito(product);
  };

  const handleDisminuir = (e) => {
    e.stopPropagation();
    if (cantidad === 1) {
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
    <div className="border border-gray-200 rounded-md bg-white shadow transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] w-full h-full flex flex-col">
      <Link
        to={`/productos/${product.idProducto}`}
        className="flex flex-col flex-1"
      >
        {/* Imagen */}
        <div className="w-full h-48 flex items-center justify-center p-4 overflow-hidden">
          <img
            src={product.img}
            alt={product.nombreProducto}
            className="max-h-full object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Información */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-gray-400 text-sm">{product.categoria}</p>
          <p className="text-gray-800 font-semibold text-base truncate">
            {product.nombreProducto}
          </p>

          {/* Stock */}
          <p className="text-sm text-gray-500 mt-1">
            Stock Disponible: {product.stock}
          </p>

          {/* Precio */}
          <p className="text-green-600 font-bold text-lg mt-2">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(product.precio)}
          </p>
        </div>
      </Link>

      {/* Botón agregar */}
      <div className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
        {cantidad === 0 ? (
          <button
            onClick={handleAgregar}
            aria-label="Agregar al carrito"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm text-primary-900 border border-primary-700 rounded hover:bg-primary-100 transition cursor-pointer"
          >
            <FaShoppingCart className="w-4 h-4" />
            Añadir
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full px-2 py-2 bg-green-100 rounded">
            <button
              onClick={handleDisminuir}
              className="text-sm px-2 font-bold cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              -
            </button>
            <span className="w-5 text-center">{cantidad}</span>
            <button
              onClick={handleAumentar}
              className="text-sm px-2 font-bold cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardProductos;
