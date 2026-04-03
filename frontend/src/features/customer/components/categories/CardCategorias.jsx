import { useState } from "react";
import { ArrowRight } from "lucide-react";

const CARD_BASE_CLASSES = `
  relative group cursor-pointer
  rounded-[18px]
  shadow-xl hover:shadow-2xl
  transition-all duration-500
  overflow-hidden
  transform hover:-translate-y-2 active:translate-y-0
  bg-white
`;

const INNER_CONTENT_CLASSES = `
  relative z-20
  p-6
  rounded-[16px]
  flex flex-col items-center justify-center
  gap-4
  bg-white
  border-2 border-gray-200
  group-hover:border-primary-500
  transition-all duration-500
  h-full
`;

const CardCategorias = ({ categoria, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={CARD_BASE_CLASSES}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`
          absolute inset-[-5px]
          rounded-[20px]
          bg-linear-to-r from-primary-500 to-primary-600
          opacity-0
          group-hover:opacity-100
          group-hover:scale-105
          transition-all duration-500 ease-out
          blur-md
          -z-10
        `}
      />

      <div className={INNER_CONTENT_CLASSES}>
         

        <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-2 z-10">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 rounded-xl animate-pulse" />
          )}

          <img
            src={categoria.image}
            alt={categoria.text}
            className={`
              relative z-10
              max-w-full max-h-full
              object-contain
              transition-all duration-700
              group-hover:scale-110
              ${imageLoaded ? "opacity-100" : "opacity-0"}
              filter
              group-hover:brightness-110
            `}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          <div
            className="
              absolute inset-0
              bg-linear-to-r from-primary-600/20 to-primary-700/20
              rounded-full
              blur-xl
              opacity-0
              group-hover:opacity-100
              transition-opacity duration-500
              scale-150
            "
          />
        </div>

        <div className="text-center space-y-2 relative z-10">
          <p
            className="
              text-base font-semibold text-gray-800
              group-hover:text-primary-700
              transition-colors duration-300
              line-clamp-2
              leading-tight
            "
          >
            {categoria.text}
          </p>
        </div>

        <div
          className="
            flex items-center gap-1
            text-secondary-500
            text-sm font-semibold
            opacity-0
            group-hover:opacity-100
            transform translate-y-2
            group-hover:translate-y-0
            transition-all duration-300
            relative z-10
          "
        >
          <span>Explorar</span>
          <ArrowRight
            className={`
              h-4 w-4
              transform transition-transform duration-300
              ${isHovered ? "translate-x-1" : ""}
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default CardCategorias;