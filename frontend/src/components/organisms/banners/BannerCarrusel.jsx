import { useState, useEffect, useCallback, useMemo } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import bannerSm1 from "@assets/bannerSm1.webp";
import bannerSm2 from "@assets/bannerSm2.webp";
import bannerSm3 from "@assets/bannerSm3.webp";

const DESKTOP_IMAGE_URLS = [
  "https://cdn.batitienda.com/baticloud/images/section_picture_f1424a5a19ff4eb0973f12e4b7effe22_638850739937396556_0_k.webp",
  "https://cdn.batitienda.com/baticloud/images/section_picture_2d15cd0f93d24bd3b58fde503ef4340e_638857998633550357_0_k.webp",
  "https://cdn.batitienda.com/baticloud/images/section_picture_c11b601b51494b5ab55a775fefa4e14c_638858006686257310_0_k.webp",
];

const MOBILE_IMAGES = [bannerSm1, bannerSm2, bannerSm3];
const AUTOPLAY_DELAY = 4000;
const MOBILE_BREAKPOINT = 768;

const BannerCarrusel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [leavingIndex, setLeavingIndex] = useState(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const images = useMemo(
    () => (isMobile ? MOBILE_IMAGES : DESKTOP_IMAGE_URLS),
    [isMobile],
  );

  const updateIndex = useCallback(
    (newIndex) => {
      setLeavingIndex(currentIndex);
      setCurrentIndex(newIndex);
    },
    [currentIndex],
  );

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    updateIndex(newIndex);
  };

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    updateIndex(newIndex);
  }, [currentIndex, images.length, updateIndex]);

  const goToSlide = (index) => {
    updateIndex(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, AUTOPLAY_DELAY);

    return () => clearTimeout(timer);
  }, [currentIndex, goToNext]);

  return (
    <div className="relative w-full overflow-hidden mt-16 shadow-lg rounded-xl">
      <div className="relative w-full aspect-[4/3] md:aspect-[16/5] px-0 3xl:px-32">
        {images.map((imageSrc, idx) => {
          const isCurrent = currentIndex === idx;
          const isLeaving = leavingIndex === idx && !isCurrent;

          return (
            <img
              key={idx}
              src={imageSrc}
              alt={`Slide ${idx + 1}`}
              className={`
                absolute top-0 left-0 w-full h-full object-cover rounded-xl 
                transition-opacity duration-1000 ease-in-out
                ${isCurrent ? "opacity-100" : "opacity-0"}
                ${isLeaving ? "opacity-0" : ""} 
              `}
            />
          );
        })}

        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/20 text-white p-2 rounded-full hover:bg-black/30 transition z-10 cursor-pointer"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/20 text-white p-2 rounded-full hover:bg-black/30 transition z-10 cursor-pointer"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-3 w-3 rounded-full transition-all cursor-pointer ${currentIndex === idx ? "bg-white scale-125" : "bg-white/50"}`}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarrusel;
