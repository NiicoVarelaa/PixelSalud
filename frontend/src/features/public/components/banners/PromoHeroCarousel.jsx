import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

import PromoSideCard from "./PromoSideCard";
import { PromoControlButton, PromoDots } from "./promoHero";
import usePromoHeroCarousel from "./hooks/usePromoHeroCarousel";
import { usePromoBannerData } from "./hooks/usePromoBannerData";

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
  const {
    cards,
    currentSlide,
    currentCard,
    isPaused,
    currentCarouselImage,
    slideIndicators,
    currentCardData,
    desktopLeftCards,
    desktopRightCards,
    goToSlide,
    goToPrevSlide,
    goToNextSlide,
    goToCard,
    goToPrevCard,
    goToNextCard,
    togglePause,
  } = usePromoHeroCarousel({ sideCards, autoplay, interval });

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
                <PromoControlButton
                  onClick={goToPrevSlide}
                  label="Slide anterior"
                  direction="left"
                />
                <PromoControlButton
                  onClick={goToNextSlide}
                  label="Slide siguiente"
                  direction="right"
                />
              </div>

              <PromoDots
                items={slideIndicators}
                activeIndex={currentSlide}
                onSelect={goToSlide}
              />

              <button
                type="button"
                onClick={togglePause}
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
                <PromoControlButton
                  onClick={goToPrevCard}
                  label="Card anterior"
                  direction="left"
                  size="sm"
                />
                <PromoControlButton
                  onClick={goToNextCard}
                  label="Card siguiente"
                  direction="right"
                  size="sm"
                />
              </div>

              <PromoDots
                items={cards}
                activeIndex={currentCard}
                onSelect={goToCard}
                compact={true}
              />
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
