import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CardProductos from "./CardProductos";
import { Zap } from "lucide-react";
import {
  CountdownTimer,
  CarouselInfoPanel,
  CarouselNavButton,
} from "./carousel";

const SWIPER_BREAKPOINTS = {
  480: { slidesPerView: 2, spaceBetween: 20 },
  640: { slidesPerView: 3.1, spaceBetween: 20 },
  1024: { slidesPerView: 3, spaceBetween: 24 },
  1280: { slidesPerView: 4, spaceBetween: 24 },
  1440: { slidesPerView: 4, spaceBetween: 24 },
};

const ProductCarousel = ({
  products,
  title = "Campaña",
  campaignId,
  campaignEndDate,
  showFlashLabel = true,
}) => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sectionId = useMemo(
    () => `flash-offers-title-${campaignId || "default"}`,
    [campaignId],
  );

  const campaignUrl = useMemo(
    () => `/productos?categoria=${encodeURIComponent(title)}`,
    [title],
  );

  const handleSwiper = useCallback((swiper) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  const handleSlideChange = useCallback((swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  const slideNext = useCallback(() => swiperRef.current?.slideNext(), []);
  const slidePrev = useCallback(() => swiperRef.current?.slidePrev(), []);

  if (!products || products.length === 0) return null;

  return (
    <section
      className={`relative transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      aria-labelledby={sectionId}
    >
      <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center md:justify-between">
        <h2
          id={sectionId}
          className="flex items-center gap-3 text-3xl font-extrabold tracking-tighter text-slate-950 md:text-4xl"
        >
          <Zap
            className="h-8 w-8 text-orange-600 fill-orange-100"
            aria-hidden="true"
          />
          {title}
          {showFlashLabel && <span className="text-orange-500">Flash</span>}
        </h2>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <CountdownTimer targetDate={campaignEndDate} />
          <NavLink
            to={campaignUrl}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-bold text-white shadow transition hover:bg-orange-600"
          >
            Ver campaña
          </NavLink>
        </div>
      </div>

      <div className="relative rounded-3xl border border-gray-100 bg-slate-50 p-5 md:p-6">
        <div className="flex flex-row items-stretch gap-5 lg:gap-6">
          <CarouselInfoPanel />

          <div className="relative flex-1 overflow-hidden">
            <CarouselNavButton
              direction="left"
              onClick={slidePrev}
              disabled={isBeginning}
              label="Productos anteriores"
            />

            <Swiper
              onSwiper={handleSwiper}
              onSlideChange={handleSlideChange}
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={2}
              grabCursor={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={SWIPER_BREAKPOINTS}
              className="h-auto py-1 [&_.swiper-wrapper]:items-stretch"
            >
              {products.map((product) => (
                <SwiperSlide key={product.idProducto} className="h-auto! flex">
                  <div className="h-full w-full">
                    <CardProductos product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <CarouselNavButton
              direction="right"
              onClick={slideNext}
              disabled={isEnd}
              label="Siguientes productos"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
