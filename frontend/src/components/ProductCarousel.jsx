import { useRef } from "react";
import { NavLink } from "react-router-dom";
import bannerCarousel from "../assets/bannerCarousel.webp";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CardProductos from "./CardProductos";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductCarousel = ({ title, products }) => {
  const swiperRef = useRef(null);

  if (!products || products.length === 0) {
    return null;
  }

  const altBanner1 = "Dermocosmética";

  return (
    <section className="my-16 md:my-20 bg-pink-100 p-6 md:p-8 rounded-xl overflow-hidden">
      <div>
        <h2 className="text-2xl md:text-3xl font-medium mb-8 text-center lg:text-left text-gray-800">
          {title}
        </h2>
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="w-full lg:w-1/4 flex-shrink-0 hidden lg:block">
            <NavLink to={`/productos?categoria=${altBanner1}`}>
              <img
                src={bannerCarousel}
                alt={title}
                className="w-full h-[500px] object-cover rounded-xl"
              />
            </NavLink>
          </div>

          <div className="w-full lg:w-3/4 flex items-center gap-2 min-w-0">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="custom-prev p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <div className="flex-1 w-full h-full min-w-0">
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 2 },
                  1280: { slidesPerView: 3 },
                  1536: { slidesPerView: 4 },
                }}
                className="h-full"
              >
                {products.map((p) => (
                  <SwiperSlide key={p.idProducto} className="h-auto">
                    <CardProductos product={p} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="custom-next p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Siguiente"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
