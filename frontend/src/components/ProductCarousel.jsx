import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import bannerCarousel from "../assets/bannerCarousel.webp";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CardProductos from "./CardProductos";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap,
  Clock,
  Store,
  Tags,
} from "lucide-react";

const CYBER_MONDAY_END_DATE = new Date("November 16, 2025 23:59:59").getTime();

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

const CountdownTimer = () => {
  const timeLeft = useCountdown(CYBER_MONDAY_END_DATE);

  if (timeLeft <= 0) {
    return (
      <div className="flex items-center justify-center w-full md:w-auto gap-3 text-red-700 text-sm font-semibold p-3 border-2 border-red-300 rounded-xl bg-red-50 flex-shrink-0">
        <span>¡Promoción Finalizada!</span>
      </div>
    );
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const formatTime = (value) => String(value).padStart(2, "0");

  return (
    <div className="flex items-center justify-center w-full sm:w-auto gap-4 text-white font-bold text-sm py-3 rounded-full bg-gradient-to-b from-red-500 to-pink-600 shadow-lg  flex-shrink-0 px-6 ">
      <Clock className="w-7 h-7 flex-shrink-0 text-white" />
      <div className="flex gap-3">
        <div className="text-center">
          <span className="block text-xl leading-none bg-white/20 rounded-lg px-2 py-1 min-w-[2rem]">
            {formatTime(days)}
          </span>
          <span className="block uppercase text-white/80 font-medium mt-1 text-xs">
            Días
          </span>
        </div>
        <div className="text-center text-white/50 text-xl font-light leading-none flex items-center">
          :
        </div>
        <div className="text-center">
          <span className="block text-xl leading-none bg-white/20 rounded-lg px-2 py-1 min-w-[2rem]">
            {formatTime(hours)}
          </span>
          <span className="block uppercase text-white/80 font-medium mt-1 text-xs">
            Hrs
          </span>
        </div>
        <div className="text-center text-white/50 text-xl font-light leading-none flex items-center">
          :
        </div>
        <div className="text-center">
          <span className="block text-xl leading-none bg-white/20 rounded-lg px-2 py-1 min-w-[2rem]">
            {formatTime(minutes)}
          </span>
          <span className="block uppercase text-white/80 font-medium mt-1 text-xs">
            Min
          </span>
        </div>
        <div className="text-center text-white/50 text-xl font-light leading-none flex items-center">
          :
        </div>
        <div className="text-center">
          <span className="block text-xl leading-none bg-white/20 rounded-lg px-2 py-1 min-w-[2rem]">
            {formatTime(seconds)}
          </span>
          <span className="block uppercase text-white/80 font-medium mt-1 text-xs">
            Seg
          </span>
        </div>
      </div>
    </div>
  );
};

const ProductCarousel = ({ products }) => {
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

  const title = "Ofertas Flash";
  const subtitle = "¡Solo por tiempo limitado! Los mejores descuentos en los productos más buscados.";

  const benefits = [
    { icon: Tags, text: "Ofertas exclusivas" },
    { icon: Store, text: "Retiro gratis" },
  ];

  const NavButton = (
    <NavLink
      to={`/productos`}
      className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-gray-50 text-pink-600 font-bold py-4 px-2 cursor-pointer flex-shrink-0"
    >
      Ver Todas las Ofertas
      <ArrowRight 
        size={18} 
        className="group-hover:translate-x-1 transition-transform duration-300" 
      />
    </NavLink>
  );

  return (
    <section className={`my-16 md:my-20 relative transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-50/50 to-pink-50/30 rounded-3xl mx-4"></div>
      
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 lg:mb-12 px-4">
          <div className="text-left mb-6 lg:mb-0">
            <div className="inline-flex items-center gap-2 bg-pink-600  text-white text-sm font-extrabold py-2.5 px-5 rounded-full mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-default">
              <Zap className="h-4 w-4" fill="white" />
              CYBER MONDAY 2025
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-tight">
              {title}
              <span className="block text-transparent bg-clip-text bg-purple-700 drop-shadow-sm">
                Imbatibles
              </span>
            </h2>
            
            <p className="text-gray-700 text-lg md:text-xl max-w-2xl font-medium mb-6 leading-relaxed">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-white/80 rounded-full px-3 py-2 shadow-sm">
                  <benefit.icon className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-end lg:flex-col lg:items-end gap-4 w-full lg:w-auto mt-6 md:mt-0">
            <CountdownTimer />
            <div className="w-full sm:w-auto md:order-last">
              {NavButton}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch px-4">
          <div className="w-full lg:w-1/4 flex-shrink-0 hidden lg:block pb-8 pt-2">
            <NavLink to={`/productos`} className="group block h-full">
              <div className="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 border-2 border-white/20">
                <img
                  src={bannerCarousel}
                  alt="Ofertas Cyber Monday"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0  flex flex-col justify-start p-6">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <Tags className="h-5 w-5 text-white" />
                      <span className="font-semibold text-white uppercase tracking-wider text-sm">
                        Ofertas Especiales
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            </NavLink>
          </div>

          <div className="w-full lg:w-3/4 flex items-center gap-2 min-w-0">
            <button
              onClick={slidePrev}
              disabled={isBeginning}
              className={`p-3 rounded-full transition-all duration-300 cursor-pointer border-2 hidden sm:flex items-center justify-center ${
                isBeginning
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-primary-600 text-primary-600 hover:bg-green-50 hover:scale-105 hover:border-primary-700 hover:text-primary-700 shadow-lg active:scale-95"
              } flex-shrink-0`}
              aria-label="Productos anteriores"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex-1 w-full h-full min-w-0 relative">
              <Swiper
                onSwiper={handleSwiper}
                onSlideChange={handleSlideChange}
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  430: { slidesPerView: 1.2 },
                  640: { slidesPerView: 1.5 },
                  768: { slidesPerView: 2.2 },
                  1024: { slidesPerView: 2.5 },
                  1280: { slidesPerView: 3 },
                  1536: { slidesPerView: 3.2 },
                }}
                className="h-full py-2"
              >
                {products.map((product, index) => (
                  <SwiperSlide
                    key={product.idProducto}
                    className="h-auto pb-8 pt-2"
                  >
                    <div 
                      className="h-full transform transition-all duration-500 hover:scale-[1.02]"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <CardProductos product={product} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <button
              onClick={slideNext}
              disabled={isEnd}
              className={`p-3 rounded-full transition-all duration-300 cursor-pointer border-2 hidden sm:flex items-center justify-center ${
                isEnd
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-primary-600 text-primary-600 hover:bg-green-50 hover:scale-105 hover:border-primary-700 hover:text-primary-700 shadow-lg active:scale-95"
              } flex-shrink-0`}
              aria-label="Siguientes productos"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductCarousel;