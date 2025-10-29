import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; 

import { ChevronLeft, ChevronRight } from "lucide-react";

import CardProductos from "../components/CardProductos";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const ProductsRelated = ({ relatedProducts, category }) => {
  const navigate = useNavigate();

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleCategoryClick = () => {
    let url = "/productos"; 

    if (category) {
      const encodedCategoria = encodeURIComponent(category);
      url = `/productos?categoria=${encodedCategoria}`;
    }

    navigate(url);
  };

  const swiperParams = {
    modules: [Navigation, Autoplay], 
    spaceBetween: 24,
    slidesPerView: 1,
    breakpoints: {
      640: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
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
    speed: 600,
    grabCursor: true,
    onSlideChange: (swiper) => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    },
    onInit: (swiper) => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    },
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
        <div className="flex flex-col mb-4 lg:mb-0">
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900">
            También te puede interesar
          </h2>
          <p className="text-gray-600 text-sm lg:text-base mt-1">
            Productos seleccionados especialmente para ti
          </p>
        </div>
      </div>
      <div className="container bg-gradient-to-t from-white via-white to-gray-50 rounded-xl px-4">
        <div className="flex items-center gap-2">
          {relatedProducts.length > 1 && (
            <button
              className={`swiper-button-prev-custom p-2 rounded-full border transition-all duration-300 shadow-sm flex items-center justify-center ${
                isBeginning
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-primary-500 text-primary-700 hover:bg-primary-100 hover:shadow-md hover:scale-105 cursor-pointer"
              }`}
              aria-label="Productos anteriores"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div className="flex-1 min-w-0 w-full"> 
            <Swiper {...swiperParams} className="products-related-swiper">
              {relatedProducts.map((product) => (
                <SwiperSlide key={product.idProducto}>
                  <div className="h-full transform transition-all duration-500 hover:scale-[1.02] hover:z-10 pb-8">
                    <CardProductos product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {relatedProducts.length > 1 && (
            <button
              className={`swiper-button-next-custom p-2 rounded-full border transition-all duration-300 shadow-sm flex items-center justify-center ${
                isEnd
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-primary-500 text-primary-700 hover:bg-primary-100 hover:shadow-md hover:scale-105 cursor-pointer"
              }`}
              aria-label="Siguientes productos"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        <div className="text-center mt-4 pb-8">
          <button
            onClick={handleCategoryClick} 
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-3">
              {category
                ? `Ver todos en ${category}`
                : "Ver todos los productos"}
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsRelated;