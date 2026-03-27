import { useEffect } from "react";
import { useProductStore } from "@store/useProductStore";

import Header from "@features/public/components/navigation/Header";
import Footer from "@features/public/components/footer/Footer";
import PromoHeroCarousel from "@features/public/components/banners/PromoHeroCarousel";
import BannerGrid from "@features/public/components/banners/BannerGrid";
import BannerPromo from "@features/public/components/banners/BannerPromo";
import { Categorias } from "@features/customer/components/categories";
import {
  ProductSection,
  ProductCarousel,
} from "@features/customer/components/products";
import { TrustedBrand } from "@components/molecules/cards";
import { WhatsAppButton } from "@components/molecules/navigation";

const Inicio = () => {
  const { productosArriba, productosCyberMonday, error, fetchProducts } =
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
      <PromoHeroCarousel />
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
          products={productosCyberMonday}
        />

        <div className="my-16 md:my-20">
          <BannerGrid />
        </div>

        <div className="my-16 md:my-20">
          <TrustedBrand />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Inicio;
