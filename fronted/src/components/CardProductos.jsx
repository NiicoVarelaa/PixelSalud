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

  const handleAgregar = () => agregarCarrito(product);

  const handleDisminuir = () => {
    if (cantidad === 1) {
      eliminarDelCarrito(product.idProducto);
    } else {
      disminuirCantidad(product.idProducto);
    }
  };

  const handleAumentar = () => aumentarCantidad(product.idProducto);

  return (
    <div className="border border-gray-200 rounded-md bg-white shadow hover:shadow-md transition duration-200 w-full h-full flex flex-col">
      
      {/* Imagen */}
      <div className="w-full h-48 flex items-center justify-center p-4 overflow-hidden">
        <img
          src={product.img}
          alt={product.nombreProducto}
          className="max-h-full object-contain transition-transform duration-200 group-hover:scale-105"
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

        {/* Precio y acciones */}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-green-600 font-bold text-lg">
            {currency}{product.precio}
          </p>

          <div className="text-green-600" onClick={(e) => e.stopPropagation()}>
            {cantidad === 0 ? (
              <button
                onClick={handleAgregar}
                aria-label="Agregar al carrito"
                className="flex items-center gap-2 px-3 py-1 text-sm border border-green-300 rounded hover:bg-green-100 transition"
              >
                <FaShoppingCart className="w-4 h-4" />
                Añadir
              </button>
            ) : (
              <div className="flex items-center gap-2 px-2 py-1 bg-green-100 rounded">
                <button
                  onClick={handleDisminuir}
                  className="text-sm px-2 font-bold"
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span className="w-5 text-center">{cantidad}</span>
                <button
                  onClick={handleAumentar}
                  className="text-sm px-2 font-bold"
                  aria-label="Aumentar cantidad"
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
