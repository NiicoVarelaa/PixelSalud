import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useFavoritosStore } from "../store/useFavoritoStore";
import { Link, useNavigate } from "react-router-dom"; 

import Header from "../components/Header";
import CardProductos from "../components/CardProductos";
import Footer from "../components/Footer";

const PerfilFavoritos = () => {
  const { user } = useAuthStore();
  const { favoritos, getFavoritos, isLoading } = useFavoritosStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getFavoritos();
    } else {
      navigate("/login");
    }
  }, [user, getFavoritos, navigate]);


  
  if (isLoading || !user) { 
    return (
       <div>
        <Header />
        <div className="container my-12 text-center min-h-[50vh] flex justify-center items-center">
            <p className="text-gray-600 font-medium">Cargando tus favoritos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis Productos Favoritos ({favoritos.length})
        </h1>
        
        {favoritos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
              {favoritos.map((favorito) => (
                <CardProductos
                  key={favorito.idProducto}
                  product={favorito} 
                />
              ))}
            </div>
        ) : (
            <div className="text-center ">
                <p className="text-gray-500">Aún no has agregado ningún producto a tus favoritos.</p>
                <Link to="/productos" className="mt-4 inline-block text-primary-700 hover:underline font-medium">
                    Explorar la tienda
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default PerfilFavoritos;