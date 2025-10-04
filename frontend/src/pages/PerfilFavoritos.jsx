import { useEffect } from "react";
import { useFavoritosStore } from "../store/useFavoritoStore";
import { useClienteStore } from "../store/useClienteStore";
// Asume que tienes un componente CardProductos y CardFavorito
import CardProductos from "../components/CardProductos";

const PerfilFavoritos = () => {
  // 1. Obtener ID del Cliente
  const idCliente = useClienteStore((state) => state.cliente?.idCliente);

  // 2. Obtener estado y función de carga de favoritos
  const { favoritos, isLoading, getFavoritos } = useFavoritosStore();

  // Cargar los favoritos al montar el componente (y si el cliente cambia)
  useEffect(() => {
    if (idCliente) {
      getFavoritos(idCliente);
    }
  }, [idCliente, getFavoritos]);

  if (!idCliente) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
        <p className="mt-4">
          Por favor, inicia sesión para ver tus productos favoritos.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Cargando Favoritos...</h1>
        <p className="mt-4">
          Un momento, estamos buscando tus productos guardados.
        </p>
        {/* Puedes añadir un spinner de carga aquí */}
      </div>
    );
  }

  if (favoritos.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          ¡Aún no tienes favoritos!
        </h1>
        <p className="mt-4 text-gray-600">
          Haz clic en el corazón de los productos que te gusten para guardarlos
          aquí.
        </p>
      </div>
    );
  }

  // El backend te devuelve los datos del producto dentro de la lista de favoritos.
  // ... (código anterior)

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Mis Productos Favoritos ({favoritos.length})</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoritos.map(favorito => (
                    <CardProductos 
                        // CORRECCIÓN FINAL: Usamos idFavorito, ya que este es el ID de la fila en la DB 
                        // y es único para cada elemento de esta lista.
                        // Alternativamente, si no lo traes, debes usar el ID del producto: favorito.idProducto
                        key={favorito.idFavorito || favorito.idProducto} 
                        product={{
                            idProducto: favorito.idProducto, // El ID que la Card necesita para el carrito/toggle
                            nombreProducto: favorito.nombreProducto, 
                            precio: favorito.precio,
                            img: favorito.img,
                            // Asegúrate que estos campos coincidan con tu SELECT en favoritos.js
                        }} 
                    />
                ))}
            </div>
        </div>
    );
};
// ... (código posterior)

export default PerfilFavoritos;
