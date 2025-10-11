import { useEffect } from "react";

import { useFavoritosStore } from "../store/useFavoritoStore";
import { useClienteStore } from "../store/useClienteStore";

import Header from "../components/Header";
import CardProductos from "../components/CardProductos";
import Footer from "../components/Footer";

const PerfilFavoritos = () => {
  const idCliente = useClienteStore((state) => state.cliente?.idCliente);

  const { favoritos, getFavoritos } = useFavoritosStore();

  useEffect(() => {
    console.log("Favoritos cargados:", favoritos);
  }, [favoritos]);

  useEffect(() => {
    if (idCliente) {
      getFavoritos(idCliente);
    }
  }, [idCliente, getFavoritos]);

  if (!idCliente) {
    return (
      <div>
        <Header />
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
          <p className="mt-4">
            Por favor, inicia sesión para ver tus productos favoritos.
          </p>
        </div>{" "}
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container my-12">
        <h1 className="text-3xl font-bold">
          Mis Productos Favoritos ({favoritos.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
          {favoritos.map((favorito) => (
            <CardProductos
              key={favorito.idProducto}
              product={{
                idProducto: favorito.idProducto,
                nombreProducto: favorito.nombreProducto,
                precio: favorito.precio,
                img: favorito.img,
                categoria: favorito.categoria,
                stock: favorito.stock,
              }}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PerfilFavoritos;
