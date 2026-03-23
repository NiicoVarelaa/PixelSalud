import { Sparkles } from "lucide-react";

export const ProductImage = ({ src, alt, tieneOferta, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full rounded-xl object-cover border-2 border-gray-200 group-hover:border-primary-300 transition-colors shadow-sm"
        loading="lazy"
      />
      {tieneOferta && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center lg:w-5 lg:h-5 lg:-top-1 lg:-right-1">
          <Sparkles size={12} className="text-white" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export const ProductImageMobile = ({ src, alt, tieneOferta }) => {
  return (
    <div className="relative shrink-0">
      <img
        src={src}
        alt={alt}
        className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-sm"
        loading="lazy"
      />
      {tieneOferta && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
          <Sparkles size={16} className="text-white" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};
