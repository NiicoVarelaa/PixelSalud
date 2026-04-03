import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Default from "@assets/default.webp";
import BotonFavorito from "@features/customer/components/favorites/FavoriteToggleButton";
import { useProductImageGallery } from "./utils";
import { GalleryMobileDots, GalleryThumbnails } from "./gallery";

const ProductImageGallery = ({ product }) => {
  const thumbsRef = useRef(null);

  const {
    validThumbs,
    selectedIndex,
    selectedImage,
    isZoomed,
    isLoading,
    setIsZoomed,
    handleSelectByIndex,
    handlePrev,
    handleNext,
    handleKeyDown,
  } = useProductImageGallery({ product });

  useEffect(() => {
    if (thumbsRef.current) {
      const activeThumb = thumbsRef.current.querySelector(
        "[data-active='true']",
      );
      activeThumb?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedIndex]);

  return (
    <section
      aria-label="Galería de imágenes del producto"
      className="flex flex-col w-full sm:gap-4 lg:p-6"
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Mostrando imagen ${selectedIndex + 1} de ${validThumbs.length}`}
      </div>

      <div
        className="group relative w-full aspect-square bg-white sm:bg-slate-50 sm:rounded-2xl sm:border sm:border-slate-100 overflow-hidden flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50 transition-shadow"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="Imagen principal. Usa las flechas izquierda y derecha para navegar."
        role="region"
      >
        {isLoading ? (
          <div className="w-full h-full animate-pulse bg-slate-200 sm:rounded-2xl" />
        ) : (
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedImage}
              src={selectedImage}
              alt={product.nombreProducto || "Imagen del producto"}
              className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
                isZoomed
                  ? "scale-150 cursor-zoom-out"
                  : "cursor-zoom-in hover:scale-105"
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setIsZoomed((z) => !z)}
              onError={(event) => {
                event.target.src = Default;
              }}
              draggable={false}
            />
          </AnimatePresence>
        )}

        {!isLoading && !isZoomed && (
          <div
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-sm pointer-events-none text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block"
            aria-hidden="true"
          >
            <ZoomIn size={18} />
          </div>
        )}
        <div className="absolute top-4 right-4 z-20">
          <BotonFavorito product={product} />
        </div>

        {validThumbs.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Ver imagen anterior"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur-sm shadow-md rounded-full text-slate-700 hover:text-primary-700 hover:scale-110 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 z-10 cursor-pointer"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Ver imagen siguiente"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur-sm shadow-md rounded-full text-slate-700 hover:text-primary-700 hover:scale-110 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 z-10 cursor-pointer"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </>
        )}

        {validThumbs.length > 1 && (
          <GalleryMobileDots
            validThumbs={validThumbs}
            selectedIndex={selectedIndex}
            onSelectIndex={handleSelectByIndex}
          />
        )}
      </div>

      <GalleryThumbnails
        validThumbs={validThumbs}
        selectedIndex={selectedIndex}
        thumbsRef={thumbsRef}
        onSelectIndex={handleSelectByIndex}
      />
    </section>
  );
};

export default ProductImageGallery;
