import { useCarritoStore } from "../store/useCarritoStore";
// Importar el nuevo BotonFavoritos
import BotonFavorito from "./BotonFavorito"; 
// Importar Lucide Icons
import { Minus, Plus } from "lucide-react"; 
import { Link } from "react-router-dom";
// Ya no necesitamos importar Heart aquí

// ELIMINAMOS EL COMPONENTE BotonFavoritos SIMULADO DE AQUÍ

const CardProductos = ({ product }) => {
  const {
    carrito,
    agregarCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
  } = useCarritoStore();

  // Simplificación y mejor legibilidad
  const itemEnCarrito = carrito.find(item => item.idProducto === product.idProducto);
  const cantidadEnCarrito = itemEnCarrito?.cantidad || 0;

  // Handlers simplificados y enfocados
  const handleAgregar = (e) => {
    e.stopPropagation();
    agregarCarrito(product);
  };

  const handleDisminuir = (e) => {
    e.stopPropagation();
    if (cantidadEnCarrito === 1) {
      eliminarDelCarrito(product.idProducto);
    } else if (cantidadEnCarrito > 1) {
      disminuirCantidad(product.idProducto);
    }
  };

  const handleAumentar = (e) => {
    e.stopPropagation();
    aumentarCantidad(product.idProducto);
  };

  const esStockBajo = product.stock > 0 && product.stock <= 5;
  const estaSinStock = product.stock === 0;

  return (
    <div className="relative border border-gray-100 rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary-500 w-full h-full flex flex-col group overflow-hidden">
      
      {/* Botón de Favoritos REAL - Importado y usado aquí */}
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
             <p className="text-sm text-gray-500 font-medium tracking-wide ">{product.categoria}</p>

             <p className="text-gray-900 font-extrabold text-xl line-clamp-2 mt-1 min-h-[56px]" title={product.nombreProducto}>
              {product.nombreProducto}
            </p>
          </div>

          <div>
            <p className={`text-sm mt-2 ${estaSinStock ? 'text-red-600 font-semibold' : esStockBajo ? 'text-orange-500' : 'text-gray-500'}`}>
              {estaSinStock ? '¡Agotado!' : `Stock: ${product.stock} unidades`}
            </p>

            <p className="text-primary-700 font-black text-2xl mt-1">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(product.precio)}
            </p>
          </div>
        </div>
      </Link>

      {/* Sección de Botones (Acciones) */}
      <div className="px-4 pb-4">
        {cantidadEnCarrito === 0 ? (
          <button
            onClick={handleAgregar}
            disabled={estaSinStock}
            aria-label="Agregar al carrito"
            className={`flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-semibold rounded transition-colors shadow-md 
              ${estaSinStock 
                ? 'bg-gray-100 text-gray-700 cursor-not-allowed' 
                : 'text-white bg-primary-700 hover:bg-primary-800 cursor-pointer'}`
            }
          >
            {estaSinStock ? 'Sin Stock' : 'Agregar'}
          </button>
        ) : (
          <div className="flex items-stretch justify-center w-full rounded overflow-hidden border border-primary-500 bg-primary-100 shadow">
            <button
              onClick={handleDisminuir}
              className="flex-1 py-2 text-base font-bold text-gray-900 bg-white hover:bg-red-100 transition-colors cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-5 h-5 mx-auto" />
            </button>
            <span className="flex items-center justify-center w-12 text-base font-semibold bg-white text-gray-900 border-l border-r border-primary-500">
              {cantidadEnCarrito}
            </span>
            <button
              onClick={handleAumentar}
              className="flex-1 py-2 text-base font-bold text-gray-900 bg-white hover:bg-primary-100 transition-colors cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-5 h-5 mx-auto" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardProductos;