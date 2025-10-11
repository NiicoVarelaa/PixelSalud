import { Heart } from "lucide-react"; 
import { useFavoritosStore } from "../store/useFavoritoStore"; 
import { useClienteStore } from "../store/useClienteStore";

const BotonFavorito = ({ product }) => {
  const idCliente = useClienteStore(state => state.cliente?.idCliente); 
  const { isProductFavorite, toggleFavorito } = useFavoritosStore();

  const idProducto = product.idProducto;
  const isFavorite = isProductFavorite(idProducto); 

  const handleToggleFavorite = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    const productoData = {
        nombreProducto: product.nombreProducto, 
        precio: product.precio,
        img: product.img,
        categoria: product.categoria,
        stock: product.stock,
    };

    toggleFavorito(idCliente, idProducto, productoData);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`absolute top-3 right-3 p-2 rounded-full shadow-md z-10 transition-all duration-200 transform hover:scale-110 cursor-pointer 
        ${isFavorite 
          ? 'bg-red-50 hover:bg-red-100' 
          : 'bg-white hover:bg-gray-50'
        }`}
    >
      <Heart 
        className={`w-5 h-5 transition-all duration-200 
          ${isFavorite 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-400 hover:text-red-400'
          }`
        } 
      />
    </button>
  );
};

export default BotonFavorito;