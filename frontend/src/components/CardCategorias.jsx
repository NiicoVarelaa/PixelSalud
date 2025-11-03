import { useState, useMemo } from "react";
import { ArrowRight, Zap, Star, TrendingUp } from "lucide-react";

const BADGE_CONFIGS = {
  isNew: {
    bgColor: "bg-gradient-to-r from-secondary-400 to-secondary-500",
    textColor: "text-white",
    icon: Zap,
    label: "NUEVO",
    borderColor: "border-secondary-500",
  },
  isTrending: {
    bgColor: "bg-gradient-to-r from-orange-500 to-red-500",
    textColor: "text-white",
    icon: TrendingUp,
    label: "TENDENCIA",
    borderColor: "border-orange-500",
  },
  isPopular: {
    bgColor: "bg-gradient-to-r from-amber-500 to-yellow-500",
    textColor: "text-white",
    icon: Star,
    label: "POPULAR",
    borderColor: "border-amber-500",
  },
};

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

const CardBadge = ({ config }) => {
  const BadgeIcon = config.icon;
  return (
    <div
      className={`
        absolute top-3 right-3
        ${config.bgColor}
        ${config.textColor}
        px-3 py-1.5
        rounded-full
        font-bold text-xs
        z-30
        flex items-center gap-1.5
        shadow-lg
        transform
        group-hover:scale-110
        transition-transform duration-300
        border ${config.borderColor}
      `}
    >
      {BadgeIcon && <BadgeIcon className="h-3 w-3" fill="currentColor" />}
      {config.label}
    </div>
  );
};

const CardCategorias = ({ categoria, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const badgeConfig = useMemo(() => {
    if (categoria.isNew) return BADGE_CONFIGS.isNew;
    if (categoria.isTrending) return BADGE_CONFIGS.isTrending;
    if (categoria.isPopular) return BADGE_CONFIGS.isPopular;
    return null;
  }, [categoria]);

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
          bg-gradient-to-r from-primary-500 to-secondary-500
          opacity-0
          group-hover:opacity-100
          group-hover:scale-105
          transition-all duration-500 ease-out
          blur-md
          -z-10
        `}
      />

      <div className={INNER_CONTENT_CLASSES}>
        <div
          className="
            absolute inset-0
            bg-gradient-to-br from-primary-50 via-white to-secondary-50
            opacity-0
            group-hover:opacity-100
            transition-opacity duration-500
            rounded-[16px]
            -z-10
          "
        />

        {badgeConfig && <CardBadge config={badgeConfig} />}

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
              bg-gradient-to-r from-primary-200/30 to-secondary-200/30
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