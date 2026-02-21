import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import SectionHeader from "@components/molecules/navigation/SectionHeader";
import CarouselNavigation from "@components/molecules/navigation/CarouselNavigation";
import LoadingState from "@components/atoms/LoadingState";
import ProductOfferCard from "./ProductOfferCard";

const SWIPER_CONFIG = {
  modules: [Navigation, Pagination, Autoplay],
  spaceBetween: 20,
  slidesPerView: 2.2,
  pagination: {
    clickable: true,
    dynamicBullets: true,
    renderBullet: (index, className) =>
      `<span class="${className} custom-bullet bg-gradient-to-r from-primary-600 to-primary-700"></span>`,
  },
  navigation: {
    nextEl: ".swiper-button-next-custom",
    prevEl: ".swiper-button-prev-custom",
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  loop: true,
  breakpoints: {
    480: { slidesPerView: 2.5 },
    640: { slidesPerView: 3.2 },
    768: { slidesPerView: 4.2 },
    1024: { slidesPerView: 5.2 },
    1280: { slidesPerView: 6.2 },
  },
  className: "products-offer-swiper",
};

const FeaturedOffersSection = ({ productosArriba, isLoading }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden md:col-span-3 lg:col-span-4 transition-all duration-500 hover:shadow-xl border border-gray-200">
    <div className="p-6 md:p-8">
      <SectionHeader
        title="Ofertas Destacadas"
        subtitle="En Productos Seleccionados"
        link="/productos"
        linkText="Ver Todos"
      />

      <div className="relative">
        {!isLoading && productosArriba.length > 0 && (
          <>
            <Swiper {...SWIPER_CONFIG}>
              {productosArriba.map((product) => (
                <SwiperSlide key={product.idProducto}>
                  <ProductOfferCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            <CarouselNavigation />
          </>
        )}
        {isLoading && <LoadingState />}
      </div>
    </div>
  </div>
);

export default FeaturedOffersSection;
