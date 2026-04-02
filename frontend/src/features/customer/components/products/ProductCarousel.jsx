import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CardProductos from "./CardProductos";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock3,
  Store,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(targetDate - new Date().getTime());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(targetDate - new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeLeft;
};

const CountdownTimer = ({ targetDate }) => {
  const parsedTarget = new Date(targetDate).getTime();
  const isValidTarget = Number.isFinite(parsedTarget) && parsedTarget > 0;

  if (!isValidTarget) {
    return (
      <div className="inline-flex h-12 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-bold text-emerald-700">
        <Clock3 className="h-4 w-4" />
        Promoción activa
      </div>
    );
  }

  const timeLeft = useCountdown(parsedTarget);

  if (timeLeft <= 0) {
    return (
      <div className="inline-flex h-12 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-700">
        <Clock3 className="h-4 w-4" />
        Promoción finalizada
      </div>
    );
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const formatTime = (value) => String(value).padStart(2, "0");

  const units = [
    `${formatTime(days)} DÍAS`,
    `${formatTime(hours)} HRS`,
    `${formatTime(minutes)} MIN`,
    `${formatTime(seconds)} SEG`,
  ];

  return (
    <div className="inline-flex h-12 items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 shadow-sm">
      <Clock3 className="h-4 w-4 text-orange-600" />
      <div className="flex items-center gap-1 text-xs font-extrabold text-slate-900 sm:text-sm">
        {units.map((unit, index) => (
          <div key={unit} className="inline-flex items-center gap-1">
            <span className="rounded-md bg-orange-50 px-2 py-1 leading-none tabular-nums">
              {unit}
            </span>
            {index < units.length - 1 && (
              <span className="text-orange-500">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
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

  if (!products || products.length === 0) return null;

  const handleSwiper = (swiper) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const slideNext = () => swiperRef.current?.slideNext();
  const slidePrev = () => swiperRef.current?.slidePrev();

  return (
    <section
      className={`relative transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      aria-labelledby={`flash-offers-title-${campaignId || "default"}`}
    >
      <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center md:justify-between">
        <h2
          id={`flash-offers-title-${campaignId || "default"}`}
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
            to={`/productos?categoria=${encodeURIComponent(title)}`}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-bold text-white shadow transition hover:bg-orange-600"
          >
            Ver campaña
          </NavLink>
        </div>
      </div>

      <div className="relative rounded-3xl border border-gray-100 bg-slate-50 p-5 md:p-6">
        <div className="flex flex-row items-stretch gap-5 lg:gap-6">
          <div className="hidden shrink-0 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:flex lg:w-[290px]">
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-orange-600">
                  Tu Farmacia Digital
                </span>
                <h3 className="text-4xl font-extrabold leading-tight text-slate-950 tracking-tight">
                  Pixel
                  <br /> Salud
                </h3>
              </div>
              <ul className="space-y-5 text-sm font-medium text-slate-700">
                <li className="flex items-center gap-3">
                  <Store
                    className="h-5 w-5 text-emerald-600"
                    aria-hidden="true"
                  />
                  Retiro en sucursal disponible
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle
                    className="h-5 w-5 text-emerald-600"
                    aria-hidden="true"
                  />
                  Seguimiento por WhatsApp
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck
                    className="h-5 w-5 text-emerald-600"
                    aria-hidden="true"
                  />
                  Pago online seguro integrado
                </li>
              </ul>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <button
              onClick={slidePrev}
              disabled={isBeginning}
              className={`absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full p-2.5 shadow-xl transition-all duration-300 cursor-pointer ${isBeginning ? "invisible opacity-0" : "visible bg-white/95 text-slate-950 opacity-100 hover:scale-110 hover:text-orange-600 active:scale-95"}`}
              aria-label="Productos anteriores"
            >
              <ChevronLeft size={22} strokeWidth={3} />
            </button>

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
              breakpoints={{
                480: { slidesPerView: 2, spaceBetween: 20 },
                640: { slidesPerView: 3.1, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 24 },
                1440: { slidesPerView: 4, spaceBetween: 24 },
              }}
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

            <button
              onClick={slideNext}
              disabled={isEnd}
              className={`absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full p-2.5 shadow-xl transition-all duration-300 cursor-pointer ${isEnd ? "invisible opacity-0" : "visible bg-white/95 text-slate-950 opacity-100 hover:scale-110 hover:text-orange-600 active:scale-95"}`}
              aria-label="Siguientes productos"
            >
              <ChevronRight size={22} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
