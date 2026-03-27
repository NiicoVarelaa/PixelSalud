import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Truck,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  Tags,
  ShoppingCartIcon,
} from "lucide-react";

const messages = [
  {
    text: "Descuento en productos seleccionados",
    icon: Tags,
    shortText: "Ofertas destacadas",
    to: "/productos?categoria=Ofertas",
  },
  {
    text: "Retiro en tienda sin costo adicional",
    icon: Truck,
    shortText: "Retiro en tienda",
    to: "/productos",
  },
  {
    text: "Compra 100% segura en todos tus pedidos",
    icon: ShoppingCartIcon,
    shortText: "Compra segura",
    to: "/productos",
  },
];

const ROTATION_INTERVAL = 3500;

const MiniBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeMessage = useMemo(() => messages[activeIndex], [activeIndex]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % messages.length);
  }, []);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + messages.length) % messages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section className="bg-primary-700" aria-label="Promociones destacadas">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 md:px-8 lg:px-12">
        <div
          className="grid min-h-10 grid-cols-[auto_1fr_auto] items-center gap-1.5 py-1 text-white"
          role="region"
          aria-live="polite"
          aria-atomic="true"
        >
          <button
            type="button"
            onClick={goToPrev}
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/90 transition duration-200 hover:bg-white/10 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
            aria-label="Mensaje anterior"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.26, ease: "easeOut" }}
              >
                <Link
                  to={activeMessage.to}
                  className="group flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md px-1 py-0.5 text-center text-[13px] font-medium leading-tight text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700 sm:gap-2 sm:text-sm"
                  aria-label={activeMessage.text}
                >
                  <activeMessage.icon
                    className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                    aria-hidden="true"
                  />
                  <span className="truncate sm:hidden">
                    {activeMessage.shortText}
                  </span>
                  <span className="hidden truncate sm:inline">
                    {activeMessage.text}
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={goToNext}
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/90 transition duration-200 hover:bg-white/10 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
            aria-label="Mensaje siguiente"
          >
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="sr-only" role="status">
        {`Promoción ${activeIndex + 1} de ${messages.length}`}
      </div>
    </section>
  );
};

export default MiniBanner;
