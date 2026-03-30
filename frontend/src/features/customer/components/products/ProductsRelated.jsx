import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { CardProductos } from "@features/customer/components/products";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const ProductsRelated = ({ relatedProducts, category }) => {
  const navigate = useNavigate();
  const sectionId = useId();
  const headingId = `related-heading-${sectionId}`;

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd]             = useState(false);

  const prevId = `swiper-prev-${sectionId}`;
  const nextId = `swiper-next-${sectionId}`;

  const handleCategoryClick = () => {
    const url = category
      ? `/productos?categoria=${encodeURIComponent(category)}`
      : "/productos";
    navigate(url);
  };

  const swiperParams = {
    modules: [Navigation, Autoplay],
    spaceBetween: 16,
    slidesPerView: 1.2,          // Shows a peek of next card on mobile
    breakpoints: {
      480: { slidesPerView: 2,   spaceBetween: 16 },
      768: { slidesPerView: 3,   spaceBetween: 20 },
      1024: { slidesPerView: 4,  spaceBetween: 24 },
    },
    navigation: { nextEl: `#${nextId}`, prevEl: `#${prevId}` },
    autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
    speed: 500,
    grabCursor: true,
    a11y: {
      prevSlideMessage: "Productos anteriores",
      nextSlideMessage: "Productos siguientes",
      firstSlideMessage: "Esta es la primera diapositiva",
      lastSlideMessage: "Esta es la última diapositiva",
    },
    onSlideChange: (s) => { setIsBeginning(s.isBeginning); setIsEnd(s.isEnd); },
    onInit:        (s) => { setIsBeginning(s.isBeginning); setIsEnd(s.isEnd); },
  };

  if (!relatedProducts?.length) return null;

  const navBtnBase = `
    flex-shrink-0 flex items-center justify-center
    w-9 h-9 rounded-full border-2
    transition-all duration-200 shadow-sm
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
  `;
  const navBtnActive = "border-primary-500 text-primary-700 bg-white hover:bg-primary-50 hover:shadow-md cursor-pointer";
  const navBtnDisabled = "border-gray-200 text-gray-300 bg-white cursor-not-allowed";

  return (
    <section aria-labelledby={headingId} className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 sm:mb-7 gap-4">
        <div>
          <h2
            id={headingId}
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight"
          >
            También te puede interesar
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {category ? `Más productos en ${category}` : "Productos seleccionados para vos"}
          </p>
        </div>

        {/* Desktop "ver todos" link */}
        <button
          onClick={handleCategoryClick}
          aria-label={category ? `Ver todos los productos en ${category}` : "Ver todos los productos"}
          className="
            hidden sm:inline-flex items-center gap-1.5 flex-shrink-0
            text-sm font-semibold text-primary-600
            hover:text-primary-800 underline-offset-2 hover:underline
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded
            transition-colors duration-150 cursor-pointer mt-1
          "
        >
          Ver todos
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Slider + nav */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Prev button — hidden on mobile (swipe handles it) */}
        <button
          id={prevId}
          aria-label="Ver productos anteriores"
          aria-disabled={isBeginning}
          className={`hidden sm:flex ${navBtnBase} ${isBeginning ? navBtnDisabled : navBtnActive}`}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <div className="flex-1 min-w-0">
          <Swiper {...swiperParams} className="!pb-2">
            {relatedProducts.map((product, idx) => (
              <SwiperSlide key={product.idProducto}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  className="h-full"
                >
                  <CardProductos product={product} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Next button — hidden on mobile */}
        <button
          id={nextId}
          aria-label="Ver más productos"
          aria-disabled={isEnd}
          className={`hidden sm:flex ${navBtnBase} ${isEnd ? navBtnDisabled : navBtnActive}`}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile CTA — full width */}
      <div className="mt-6 sm:hidden">
        <button
          onClick={handleCategoryClick}
          aria-label={category ? `Ver todos los productos en ${category}` : "Ver todos los productos"}
          className="
            w-full flex items-center justify-center gap-2
            py-3.5 rounded-xl border-2 border-primary-600
            text-primary-700 font-semibold text-sm bg-white
            hover:bg-primary-50 active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
            transition-all duration-150 cursor-pointer
          "
        >
          {category ? `Ver todos en ${category}` : "Ver todos los productos"}
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>

      {/* Desktop centered CTA */}
      <div className="hidden sm:flex justify-center mt-8">
        <button
          onClick={handleCategoryClick}
          aria-label={category ? `Ver todos los productos en ${category}` : "Ver todos los productos"}
          className="
            inline-flex items-center justify-center gap-2
            px-7 py-3 rounded-full
            bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-sm
            hover:from-primary-700 hover:to-primary-800
            shadow-md hover:shadow-lg active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
            transition-all duration-200 cursor-pointer
          "
        >
          {category ? `Ver todos en ${category}` : "Ver todos los productos"}
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default ProductsRelated;
