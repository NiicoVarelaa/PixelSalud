import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import carruselDesktop from "@assets/Carrusel.webp";
import carruselDesktop2 from "@assets/Carrusel2.webp";
import carruselDesktop3 from "@assets/Carrusel3.webp";

import PromoSideCard from "./PromoSideCard";
import { usePromoBannerData } from "./usePromoBannerData";

const DESKTOP_CAROUSEL_IMAGES = [
  carruselDesktop,
  carruselDesktop2,
  carruselDesktop3,
];

const SIDE_CARDS_FALLBACK = [
  {
    id: "fallback-dermo",
    badge: "Oferta activa",
    title: "Dermocosmetica",
    subtitle: "Promociones activas",
    detail: "Descubri productos destacados",
    ctaTo: "/productos?categoria=Dermocosmetica",
    ctaAriaLabel: "Ver ofertas de dermocosmetica",
  },
  {
    id: "fallback-cuidado",
    badge: "Destacado",
    title: "Cuidado personal",
    subtitle: "Promociones activas",
    detail: "Explora la categoria completa",
    ctaTo: "/productos",
    ctaAriaLabel: "Ver ofertas de cuidado personal",
  },
  {
    id: "fallback-bienestar",
    badge: "Mas elegidos",
    title: "Bienestar",
    subtitle: "Promociones activas",
    detail: "Encontrá tus productos favoritos",
    ctaTo: "/productos",
    ctaAriaLabel: "Ver ofertas de bienestar",
  },
  {
    id: "fallback-capilar",
    badge: "Oferta activa",
    title: "Capilar",
    subtitle: "Promociones activas",
    detail: "Tratamientos y cuidado diario",
    ctaTo: "/productos",
    ctaAriaLabel: "Ver ofertas capilares",
  },
];

const SLIDE_INTERVAL = 5500;

const slideMotion = {
  initial: { opacity: 0, x: 44 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.46, ease: "easeOut" },
  },
  exit: { opacity: 0, x: -44, transition: { duration: 0.3, ease: "easeIn" } },
};

const mobileCardMotion = {
  initial: { opacity: 0, x: 26 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: "easeOut" },
  },
  exit: { opacity: 0, x: -26, transition: { duration: 0.24, ease: "easeIn" } },
};

const PromoHeroCarousel = ({ autoplay = true, interval = SLIDE_INTERVAL }) => {
  const { sideCards } = usePromoBannerData();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);

  const cards = sideCards.length ? sideCards : SIDE_CARDS_FALLBACK;
  const slidesCount = DESKTOP_CAROUSEL_IMAGES.length;
  const cardsCount = cards.length;
  const currentCarouselImage = useMemo(
    () =>
      DESKTOP_CAROUSEL_IMAGES[currentSlide % DESKTOP_CAROUSEL_IMAGES.length],
    [currentSlide],
  );
  const currentCardData = useMemo(
    () => cards[currentCard],
    [cards, currentCard],
  );
  const desktopLeftCards = useMemo(() => cards.slice(0, 2), [cards]);
  const desktopRightCards = useMemo(() => cards.slice(2), [cards]);

  const goToSlide = useCallback(
    (index) => {
      const nextIndex = (index + slidesCount) % slidesCount;
      setCurrentSlide(nextIndex);
    },
    [slidesCount],
  );

  const goToPrev = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const goToCard = useCallback(
    (index) => {
      if (!cardsCount) return;
      const nextIndex = (index + cardsCount) % cardsCount;
      setCurrentCard(nextIndex);
    },
    [cardsCount],
  );

  const goToPrevCard = useCallback(() => {
    goToCard(currentCard - 1);
  }, [currentCard, goToCard]);

  const goToNextCard = useCallback(() => {
    goToCard(currentCard + 1);
  }, [currentCard, goToCard]);

  useEffect(() => {
    if (!autoplay || isPaused) return undefined;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, isPaused, slidesCount]);

  useEffect(() => {
    if (!cardsCount) {
      setCurrentCard(0);
      return;
    }

    if (currentCard > cardsCount - 1) {
      setCurrentCard(0);
    }
  }, [cardsCount, currentCard]);

  return (
    <section className="mt-8 w-full lg:mt-14">
      <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-3 shadow-sm sm:p-4 lg:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_2.2fr_1fr] lg:items-stretch lg:gap-5">
          <aside className="hidden lg:flex lg:flex-col lg:gap-4">
            {desktopLeftCards.map((card) => (
              <div key={card.id} className="flex-1">
                <PromoSideCard card={card} className="h-full" />
              </div>
            ))}
          </aside>

          <div className="space-y-3 lg:flex lg:h-full lg:flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                variants={slideMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                className="lg:flex-1"
              >
                <Link
                  to="/productos?categoria=Ofertas"
                  aria-label="Ver ofertas"
                  className="block cursor-pointer"
                >
                  <img
                    src={currentCarouselImage}
                    alt="Carrusel promocional"
                    className="h-[360px] w-full rounded-2xl object-cover lg:h-[400px]"
                    loading="lazy"
                  />
                </Link>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrev}
                  aria-label="Slide anterior"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Slide siguiente"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {DESKTOP_CAROUSEL_IMAGES.map((_, index) => {
                  const active = index === currentSlide;

                  return (
                    <button
                      key={`slide-${index}`}
                      type="button"
                      aria-label={`Ir al slide ${index + 1}`}
                      onClick={() => goToSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        active
                          ? "w-7 cursor-pointer bg-orange-500"
                          : "w-2.5 cursor-pointer bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={
                  isPaused
                    ? "Reanudar reproduccion automatica"
                    : "Pausar reproduccion automatica"
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 cursor-pointer"
              >
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <aside className="space-y-2 lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCardData.id}
                variants={mobileCardMotion}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <PromoSideCard card={currentCardData} />
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevCard}
                  aria-label="Card anterior"
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={goToNextCard}
                  aria-label="Card siguiente"
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {cards.map((card, index) => {
                  const active = index === currentCard;

                  return (
                    <button
                      key={card.id}
                      type="button"
                      aria-label={`Ir a card ${index + 1}`}
                      onClick={() => goToCard(index)}
                      className={`h-2 rounded-full transition-all ${
                        active
                          ? "w-6 cursor-pointer bg-orange-500"
                          : "w-2 cursor-pointer bg-slate-300"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </aside>

          <aside className="hidden lg:flex lg:flex-col lg:gap-4">
            {desktopRightCards.map((card) => (
              <div key={card.id} className="flex-1">
                <PromoSideCard card={card} className="h-full" />
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PromoHeroCarousel;
