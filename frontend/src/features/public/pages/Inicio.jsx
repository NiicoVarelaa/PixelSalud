import { useEffect, useMemo } from "react";
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

const HOME_CAMPAIGN_NAME =
  import.meta.env.VITE_HOME_CAMPAIGN_NAME || "Otoño 2026";

const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const Inicio = () => {
  const { productosArriba, campanasInicio, error, fetchProducts } =
    useProductStore();

  const campaignToRender = useMemo(() => {
    const target = normalizeText(HOME_CAMPAIGN_NAME);
    if (!target || !Array.isArray(campanasInicio)) return null;

    return (
      campanasInicio.find((campana) => {
        const currentName = normalizeText(campana?.nombreCampana);
        return currentName === target || currentName.includes(target);
      }) || null
    );
  }, [campanasInicio]);

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
      <main className="w-full max-w-7xl mx-auto lg:px-8">
        <Header />
        <PromoHeroCarousel />
        <div className="my-16 md:my-20">
          <Categorias />
        </div>

        <ProductSection title="Recomendados" products={productosArriba} />

        <div className="my-16 md:my-20">
          <BannerPromo />
        </div>

        {campaignToRender && (
          <div className="my-16 md:my-20">
            <ProductCarousel
              campaignId={campaignToRender.idCampana}
              title={campaignToRender.nombreCampana}
              campaignEndDate={campaignToRender.fechaFin}
              products={campaignToRender.productos}
              showFlashLabel={false}
            />
          </div>
        )}

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
