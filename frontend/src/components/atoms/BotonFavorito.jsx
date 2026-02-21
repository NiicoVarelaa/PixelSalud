import { Heart } from "lucide-react";
// 1. Se elimina la importación del viejo useClienteStore
import { useFavoritosStore } from "@store/useFavoritoStore";

const BotonFavorito = ({ product }) => {
  // 2. Ya no necesitamos obtener el idCliente aquí. El store lo maneja.
  const { isProductFavorite, toggleFavorito } = useFavoritosStore();

  const idProducto = product.idProducto;
  const isFavorite = isProductFavorite(idProducto);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // El objeto con los datos del producto sigue siendo útil para la actualización optimista.
    const productoData = {
      nombreProducto: product.nombreProducto,
      precio: product.precio,
      img: product.img,
      categoria: product.categoria,
      stock: product.stock,
    };

    // 3. La llamada a toggleFavorito ahora es mucho más simple.
    // Ya no se le pasa el idCliente.
    toggleFavorito(idProducto, productoData);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`absolute top-3 right-3 p-2 rounded-full shadow-md z-10 transition-all duration-200 transform hover:scale-110 cursor-pointer 
        ${
          isFavorite
            ? "bg-red-50 hover:bg-red-100"
            : "bg-white hover:bg-gray-50"
        }`}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 
          ${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
      />
    </button>
  );
};

export default BotonFavorito;
