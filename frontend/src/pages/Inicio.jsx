import { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";

import Header from "../components/Header";
import BannerCarrusel from "../components/BannerCarrusel";
import Categorias from "../components/Categorias";
import ProductSection from "../components/ProductSection.jsx";
import BannerPromo from "../components/BannerPromo";
import ProductCarousel from "../components/ProductCarousel.jsx";
import BannerGrid from "../components/BannerGrid";
import Footer from "../components/Footer";
import TrustedBrand from "../components/TrustedBrand.jsx";

const Inicio = () => {
  const { productosArriba, productosAbajo, error, fetchProducts } =
    useProductStore();

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
      <main>
        <div className="my-16 md:my-20">
          <Categorias />
        </div>

        <ProductSection title="Recomendados" products={productosArriba} />

        <div className="my-16 md:my-20">
          <BannerPromo />
        </div>

        <ProductCarousel
          title="Cyber Monday Ofertas"
          products={productosAbajo}
        />

        <div className="my-16 md:my-20">
          <BannerGrid />
        </div>

        <div className="my-16 md:my-20">
          <TrustedBrand />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Inicio;
