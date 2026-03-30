import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Default from "@assets/default.webp";
import BotonFavorito from "@features/customer/components/favorites/FavoriteToggleButton";
import apiClient from "@utils/apiClient";

const ProductImageGallery = ({ product }) => {
  const [imagenes, setImagenes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const thumbsRef = useRef(null);

  useEffect(() => {
    const fetchImagenes = async () => {
      if (!product?.idProducto) return;
      setIsLoading(true);
      try {
        const res = await apiClient.get(
          `/productos/${product.idProducto}/imagenes`,
        );
        const imgs = res.data && Array.isArray(res.data) ? res.data : [];
        setImagenes(imgs);
        if (imgs.length > 0) {
          const principal = imgs.find((img) => img.esPrincipal) || imgs[0];
          setSelectedImage(principal.urlImagen);
          setSelectedIndex(imgs.indexOf(principal));
        } else {
          setSelectedImage(product.img || Default);
        }
      } catch {
        setImagenes([]);
        setSelectedImage(product.img || Default);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImagenes();
  }, [product]);

  const thumbnails =
    imagenes.length > 0
      ? imagenes
      : [
          {
            urlImagen: product.img || Default,
            altText: product.nombreProducto,
          },
          {
            urlImagen: product.img2 || Default,
            altText: product.nombreProducto,
          },
          {
            urlImagen: product.img3 || Default,
            altText: product.nombreProducto,
          },
          {
            urlImagen: product.img4 || Default,
            altText: product.nombreProducto,
          },
          {
            urlImagen: product.img5 || Default,
            altText: product.nombreProducto,
          },
        ].filter((img) => img.urlImagen !== Default);

  const validThumbs = useMemo(
    () =>
      thumbnails.length > 0
        ? thumbnails
        : [{ urlImagen: Default, altText: product.nombreProducto }],
    [thumbnails, product.nombreProducto],
  );

  const handleSelect = useCallback((imgUrl, idx) => {
    setSelectedImage(imgUrl);
    setSelectedIndex(idx);
    setIsZoomed(false); 
  }, []);

  const handlePrev = useCallback(() => {
    const newIdx =
      (selectedIndex - 1 + validThumbs.length) % validThumbs.length;
    handleSelect(validThumbs[newIdx].urlImagen, newIdx);
  }, [selectedIndex, validThumbs, handleSelect]);

  const handleNext = useCallback(() => {
    const newIdx = (selectedIndex + 1) % validThumbs.length;
    handleSelect(validThumbs[newIdx].urlImagen, newIdx);
  }, [selectedIndex, validThumbs, handleSelect]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setIsZoomed(false);
    },
    [handlePrev, handleNext],
  );

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
      {/* Anunciador para lectores de pantalla (Accesibilidad) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Mostrando imagen ${selectedIndex + 1} de ${validThumbs.length}`}
      </div>

      {/* Contenedor Principal: Edge-to-edge en mobile, contenido en desktop */}
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
              onError={(e) => {
                e.target.src = Default;
              }}
              draggable={false}
            />
          </AnimatePresence>
        )}

        {/* Indicador visual de Zoom */}
        {!isLoading && !isZoomed && (
          <div
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-sm pointer-events-none text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block"
            aria-hidden="true"
          >
            <ZoomIn size={18} />
          </div>
        )}

        {/* Botón Favorito */}
        <div className="absolute top-4 right-4 z-20">
          <BotonFavorito product={product} />
        </div>

        {/* Controles de Navegación (Flechas) */}
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

        {/* Paginación Mobile (Dots) */}
        {validThumbs.length > 1 && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:hidden bg-white/60 backdrop-blur-md px-3 py-2 rounded-full shadow-sm"
            aria-hidden="true"
          >
            {validThumbs.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(validThumbs[i].urlImagen, i);
                }}
                aria-label={`Ir a la imagen ${i + 1}`}
                className="p-1 cursor-pointer focus-visible:outline-none"
                tabIndex={-1}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === selectedIndex
                      ? "bg-primary-600 w-5"
                      : "bg-slate-400 w-1.5 hover:bg-slate-500"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Miniaturas Desktop */}
      {validThumbs.length > 1 && (
        <div
          ref={thumbsRef}
          role="listbox"
          aria-label="Miniaturas de imágenes del producto"
          aria-orientation="horizontal"
          className="hidden sm:flex gap-3 overflow-x-auto py-2 px-1 -mx-1 scrollbar-hide"
        >
          {validThumbs.map((img, idx) => {
            const isDefault = img.urlImagen === Default;
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                role="option"
                aria-selected={isSelected}
                aria-label={`Seleccionar imagen ${idx + 1}`}
                data-active={isSelected}
                onClick={() => !isDefault && handleSelect(img.urlImagen, idx)}
                disabled={isDefault}
                className={`
                  relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2
                  ${isSelected ? "border-primary-600 shadow-md ring-1 ring-primary-600" : "border-slate-200 hover:border-slate-400 bg-white"}
                  ${isDefault ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1"}
                `}
              >
                {!isSelected && !isDefault && (
                  <div className="absolute inset-0 bg-white/20 transition-opacity hover:opacity-0" />
                )}
                <img
                  src={img.urlImagen}
                  alt={img.altText || `Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover p-1"
                  onError={(e) => {
                    e.target.src = Default;
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductImageGallery;
