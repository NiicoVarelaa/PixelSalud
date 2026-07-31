import { useCallback, useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Autoplay, Navigation } from "swiper/modules";

const SWIPER_BREAKPOINTS = {
  480: { slidesPerView: 2, spaceBetween: 16 },
  768: { slidesPerView: 3, spaceBetween: 20 },
  1024: { slidesPerView: 4, spaceBetween: 24 },
};

const useProductsRelated = ({ category }) => {
  const navigate = useNavigate();
  const rawId = useId();
  const sectionId = rawId.replace(/:/g, "");

  const headingId = `related-heading-${sectionId}`;
  const prevId = `swiper-prev-${sectionId}`;
  const nextId = `swiper-next-${sectionId}`;

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleCategoryClick = useCallback(() => {
    const url = category
      ? `/productos?categoria=${encodeURIComponent(category)}`
      : "/productos";
    navigate(url);
  }, [category, navigate]);

  const handleSwiperState = useCallback((swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  const swiperParams = useMemo(
    () => ({
      modules: [Navigation, Autoplay],
      spaceBetween: 16,
      slidesPerView: 1.2,
      breakpoints: SWIPER_BREAKPOINTS,
      navigation: { nextEl: `#${nextId}`, prevEl: `#${prevId}` },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      speed: 500,
      grabCursor: true,
      a11y: {
        prevSlideMessage: "Productos anteriores",
        nextSlideMessage: "Productos siguientes",
        firstSlideMessage: "Esta es la primera diapositiva",
        lastSlideMessage: "Esta es la última diapositiva",
      },
      onSlideChange: handleSwiperState,
      onInit: handleSwiperState,
    }),
    [handleSwiperState, nextId, prevId],
  );

  return {
    headingId,
    isBeginning,
    isEnd,
    nextId,
    prevId,
    swiperParams,
    handleCategoryClick,
  };
};

export default useProductsRelated;
