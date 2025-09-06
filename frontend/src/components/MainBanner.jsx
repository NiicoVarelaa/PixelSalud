import { useState, useEffect, useCallback } from 'react';
import bannerSm1 from '../assets/bannerSm1.webp';
import bannerSm2 from '../assets/bannerSm2.webp';
import bannerSm3 from '../assets/bannerSm3.webp';

const MainBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [leavingIndex, setLeavingIndex] = useState(null);

  const desktopImages = [
    'https://cdn.batitienda.com/baticloud/images/section_picture_f1424a5a19ff4eb0973f12e4b7effe22_638850739937396556_0_k.webp',
    'https://cdn.batitienda.com/baticloud/images/section_picture_2d15cd0f93d24bd3b58fde503ef4340e_638857998633550357_0_k.webp',
    'https://cdn.batitienda.com/baticloud/images/section_picture_c11b601b51494b5ab55a775fefa4e14c_638858006686257310_0_k.webp',
  ];

  const mobileImages = [bannerSm1, bannerSm2, bannerSm3];
  const images = isMobile ? mobileImages : desktopImages; 

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const goToPrevious = () => {
    setLeavingIndex(currentIndex); 
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = useCallback(() => {
    setLeavingIndex(currentIndex);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [currentIndex, images.length]); 

  const goToSlide = (index) => {
    setLeavingIndex(currentIndex);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentIndex, goToNext]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full aspect-[4/3] md:aspect-[16/5] px-0 3xl:px-32">
        {images.map((imageSrc, idx) => (
          <img
            key={idx}
            src={imageSrc}
            alt={`Slide ${idx + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl transition-opacity duration-1000 ease-in-out
              ${currentIndex === idx ? 'opacity-100' : 'opacity-0'}
              ${leavingIndex === idx && currentIndex !== idx ? 'opacity-0' : ''}
            `}
          />
        ))}

        {/* Botón anterior */}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/20 text-white p-2 rounded-full hover:bg-black/30 transition z-10 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Botón siguiente */}
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/20 text-white p-2 rounded-full hover:bg-black/30 transition z-10 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores de abajo */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-3 w-3 rounded-full transition-all cursor-pointer ${currentIndex === idx ? 'bg-white scale-125' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainBanner;