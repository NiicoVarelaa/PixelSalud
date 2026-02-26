import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Componente de Galería de Imágenes para productos
 * Muestra múltiples imágenes con navegación y miniaturas
 *
 * @param {Array} imagenes - Array de objetos de imagen con { urlImagen, altText, esPrincipal, orden }
 * @param {String} nombreProducto - Nombre del producto (fallback para alt)
 * @param {String} className - Clases CSS adicionales
 */
const ProductImageGallery = ({
  imagenes = [],
  nombreProducto = "",
  className = "",
}) => {
  const [imagenActual, setImagenActual] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Si no hay imágenes, mostrar placeholder
  if (!imagenes || imagenes.length === 0) {
    return (
      <div
        className={`relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-24 h-24 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Ordenar imágenes: principal primero, luego por orden
  const imagenesOrdenadas = [...imagenes].sort((a, b) => {
    if (a.esPrincipal) return -1;
    if (b.esPrincipal) return 1;
    return (a.orden || 0) - (b.orden || 0);
  });

  const imagenMostrar = imagenesOrdenadas[imagenActual];
  const tieneMultiplesImagenes = imagenesOrdenadas.length > 1;

  const siguiente = () => {
    setImageLoaded(false);
    setImagenActual((prev) => (prev + 1) % imagenesOrdenadas.length);
  };

  const anterior = () => {
    setImageLoaded(false);
    setImagenActual((prev) =>
      prev === 0 ? imagenesOrdenadas.length - 1 : prev - 1,
    );
  };

  const irAImagen = (index) => {
    if (index !== imagenActual) {
      setImageLoaded(false);
      setImagenActual(index);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Imagen Principal */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="relative w-full aspect-square flex items-center justify-center p-4 sm:p-8">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}

          {/* Imagen */}
          <img
            src={imagenMostrar.urlImagen}
            alt={imagenMostrar.altText || nombreProducto}
            className={`max-h-full max-w-full object-contain transition-all duration-500 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />

          {/* Fallback en caso de error */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
            style={{ display: "none" }}
          >
            <svg
              className="w-20 h-20 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>

        {/* Controles de navegación - Solo si hay múltiples imágenes */}
        {tieneMultiplesImagenes && (
          <>
            {/* Botón Anterior */}
            <button
              onClick={anterior}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>

            {/* Botón Siguiente */}
            <button
              onClick={siguiente}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>

            {/* Indicadores de posición */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {imagenesOrdenadas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => irAImagen(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === imagenActual
                      ? "bg-primary-600 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas - Solo si hay múltiples imágenes */}
      {tieneMultiplesImagenes && (
        <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
          {imagenesOrdenadas.map((imagen, index) => (
            <button
              key={index}
              onClick={() => irAImagen(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 focus:outline-none ${
                index === imagenActual
                  ? "border-primary-600 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img
                src={imagen.urlImagen}
                alt={`${nombreProducto} - Miniatura ${index + 1}`}
                className="w-full h-full object-contain p-1 bg-white"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
              {/* Fallback miniatura */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-gray-100"
                style={{ display: "none" }}
              >
                <svg
                  className="w-6 h-6 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Badge de imagen principal */}
              {imagen.esPrincipal && (
                <div className="absolute top-1 right-1 bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded">
                  Principal
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
