import { useCallback, useEffect, useMemo, useState } from "react";
import { ASSETS } from "../../../../../utils/images";

const DESKTOP_CAROUSEL_IMAGES = [
  ASSETS.carruselDesktop,
  ASSETS.carruselDesktop2,
  ASSETS.carruselDesktop3,
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
    detail: "Encontra tus productos favoritos",
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

const usePromoHeroCarousel = ({ sideCards, autoplay, interval }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const cards = useMemo(
    () => (sideCards.length ? sideCards : SIDE_CARDS_FALLBACK),
    [sideCards],
  );

  const slidesCount = DESKTOP_CAROUSEL_IMAGES.length;
  const cardsCount = cards.length;
  const slideIndicators = useMemo(
    () => DESKTOP_CAROUSEL_IMAGES.map((_, index) => ({ id: `slide-${index}` })),
    [],
  );

  const currentCarouselImage = useMemo(
    () => DESKTOP_CAROUSEL_IMAGES[currentSlide % slidesCount],
    [currentSlide, slidesCount],
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

  const goToPrevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const goToNextSlide = useCallback(() => {
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

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

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

  return {
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
  };
};

export default usePromoHeroCarousel;
