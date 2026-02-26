import { useState, useEffect, useCallback, useMemo } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import bannerSm1 from "@assets/bannerSm1.webp";
import bannerSm2 from "@assets/bannerSm2.webp";
import bannerSm3 from "@assets/bannerSm3.webp";
import CarruselSlide from "./CarruselSlide";
import CarruselDots from "./CarruselDots";
import useIsMobile from "@hooks/useIsMobile";

const DESKTOP_IMAGE_URLS = [
  "https://cdn.batitienda.com/baticloud/images/section_picture_f1424a5a19ff4eb0973f12e4b7effe22_638850739937396556_0_k.webp",
  "https://cdn.batitienda.com/baticloud/images/section_picture_2d15cd0f93d24bd3b58fde503ef4340e_638857998633550357_0_k.webp",
  "https://cdn.batitienda.com/baticloud/images/section_picture_c11b601b51494b5ab55a775fefa4e14c_638858006686257310_0_k.webp",
];

const MOBILE_IMAGES = [bannerSm1, bannerSm2, bannerSm3];
const AUTOPLAY_DELAY = 4000;

const BannerCarrusel = () => {
  const isMobile = useIsMobile();
  const images = useMemo(
    () => (isMobile ? MOBILE_IMAGES : DESKTOP_IMAGE_URLS),
    [isMobile],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState(null);

  const updateIndex = useCallback(
    (newIndex) => {
      setLeavingIndex(currentIndex);
      setCurrentIndex(newIndex);
    },
    [currentIndex],
  );

  const goToPrevious = useCallback(() => {
    updateIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length, updateIndex]);

  const goToNext = useCallback(() => {
    updateIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length, updateIndex]);

  const goToSlide = useCallback((idx) => updateIndex(idx), [updateIndex]);

  useEffect(() => {
    const timer = setTimeout(goToNext, AUTOPLAY_DELAY);
    return () => clearTimeout(timer);
  }, [currentIndex, goToNext, images.length]);

  return (
    <div className="relative w-full overflow-hidden mt-20 shadow-lg rounded-xl">
      <div className="relative w-full aspect-4/3 md:aspect-16/5 px-0 3xl:px-32">
        {images.map((src, idx) => (
          <CarruselSlide
            key={idx}
            src={src}
            alt={`Slide ${idx + 1}`}
            isCurrent={currentIndex === idx}
            isLeaving={leavingIndex === idx && currentIndex !== idx}
          />
        ))}

        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-black/20 text-white p-2 rounded-full hover:bg-black/30 focus-visible:ring-2 focus-visible:ring-primary-500 transition z-10 cursor-pointer"
          aria-label="Anterior"
          tabIndex={0}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-black/20 text-white p-2 rounded-full hover:bg-black/30 focus-visible:ring-2 focus-visible:ring-primary-500 transition z-10 cursor-pointer"
          aria-label="Siguiente"
          tabIndex={0}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <CarruselDots
          images={images}
          currentIndex={currentIndex}
          goToSlide={goToSlide}
        />
      </div>
    </div>
  );
};

export default BannerCarrusel;
