import { useEffect } from "react";
// 1. Importa el store de autenticación y el de favoritos actualizado
import { useAuthStore } from "../store/useAuthStore";
import { useFavoritosStore } from "../store/useFavoritoStore";

import Header from "../components/Header";
import CardProductos from "../components/CardProductos";
import Footer from "../components/Footer";

const PerfilFavoritos = () => {
  // 2. Obtiene el usuario completo de useAuthStore
  const { user } = useAuthStore();
  // Obtiene el estado y las acciones del store de favoritos
  const { favoritos, getFavoritos, isLoading } = useFavoritosStore();

  useEffect(() => {
    // 3. El useEffect ahora depende del objeto 'user'.
    // Si hay un usuario, llama a getFavoritos(). Ya no necesita el ID.
    if (user) {
      getFavoritos();
    }
  }, [user, getFavoritos]); // Se ejecuta cuando el usuario cambia (ej. al iniciar sesión)

  // 4. La condición para el acceso denegado ahora se basa en si existe el 'user'
  if (!user) {
    return (
      <div>
        <Header />
        <div className="container mx-auto p-8 text-center min-h-[50vh] flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
          <p className="mt-4 text-gray-600">
            Por favor, inicia sesión para ver tus productos favoritos.
          </p>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Opcional: Mostrar un estado de carga mientras se obtienen los favoritos
  if (isLoading) {
    return (
       <div>
        <Header />
        <div className="container my-12 text-center">
            <p>Cargando tus favoritos...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="container my-12 min-h-[50vh]">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis Productos Favoritos ({favoritos.length})
        </h1>
        
        {favoritos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
              {favoritos.map((favorito) => (
                <CardProductos
                  key={favorito.idProducto}
                  product={favorito} // Se puede pasar el objeto completo directamente
                />
              ))}
            </div>
        ) : (
            <div className="text-center my-16">
                <p className="text-gray-500">Aún no has agregado ningún producto a tus favoritos.</p>
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PerfilFavoritos;