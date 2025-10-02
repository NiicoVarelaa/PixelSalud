import { useEffect } from "react";

import { useProductStore } from "../store/useProductStore"; 

import Header from "../components/Header";
import BannerCarrusel from "../components/BannerCarrusel";
import Categorias from "../components/Categorias";
import CardProductos from "../components/CardProductos";
import BannerPromo from "../components/BannerPromo";
import BannerGrid from "../components/BannerGrid";
import BannerInfo from "../components/BannerInfo";
import Footer from "../components/Footer";

const Inicio = () => {
  const { 
    productosArriba, 
    productosAbajo, 
    error, 
    fetchProducts 
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); 

  if (error) {
    return (
      <div className="text-center p-20 text-xl font-bold text-red-600">
        Error al cargar los datos: {error}
      </div>
    );
  }
  
  return (
    <div> 
      <Header />  
      <BannerCarrusel />
      <Categorias />
      
      <section className="my-12">
        <p className="text-2xl md:text-3xl font-medium">Recomendados</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-6">
          {productosArriba.map((p) => (
            <CardProductos key={p.idProducto} product={p} />
          ))}
        </div>
      </section>
      
      <BannerPromo />
      
      <section className="mt-12 ">
        <p className="text-2xl md:text-3xl font-medium">
          También podría interesarte
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-6">
          {productosAbajo.map((p) => (
            <CardProductos key={p.idProducto} product={p} />
          ))}
        </div>
      </section>
      
      <BannerGrid />
      <BannerInfo />
      <Footer />
    </div>
  );
};

export default Inicio;