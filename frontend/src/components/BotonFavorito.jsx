import { Heart } from "lucide-react"; 

import { useFavoritosStore } from "../store/useFavoritoStore"; 
import { useClienteStore } from "../store/useClienteStore";

const BotonFavorito = ({ product }) => {
  // Obtener la ID del cliente logueado (necesaria para la API)
  // Utilizamos el encadenamiento opcional (?) por si el cliente es null
  const idCliente = useClienteStore(state => state.cliente?.idCliente); 
  
  // Obtener funciones y estado de Favoritos
  const { isProductFavorite, toggleFavorito } = useFavoritosStore();

  // El ID del producto que se envía al backend
  const idProducto = product.idProducto;

  // Determinar si el producto ya es un favorito
  const isFavorite = isProductFavorite(idProducto); 

  const handleToggleFavorite = (e) => {
    // Es crucial detener la propagación para que no se active el Link de la Card
    e.preventDefault(); 
    e.stopPropagation(); 
    
    // Si no hay idCliente, el toggleFavorito en el store mostrará un toast de error.
    
    // Datos mínimos del producto para actualizar el estado local de la lista de favoritos.
    // **NOTA:** Asegúrate de que las keys (nombre, precio, img) coincidan con lo que
    // el backend devuelve en 'obtenerFavoritosPorCliente'.
    const productoData = {
        nombre: product.nombreProducto, 
        precio: product.precio,
        imagen_url: product.img, 
    };

    toggleFavorito(idCliente, idProducto, productoData);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md z-10 hover:text-red-500 transition-colors"
    >
      <Heart 
        className={`w-5 h-5 transition-colors duration-200 
          ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:fill-red-400'}`
        } 
      />
    </button>
  );
};

export default BotonFavorito;