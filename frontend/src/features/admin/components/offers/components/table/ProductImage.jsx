export const ProductImage = ({ src, alt, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full rounded-xl object-cover border-2 border-gray-200 group-hover:border-primary-300 transition-colors shadow-sm"
        loading="lazy"
      />
    </div>
  );
};

export const ProductImageMobile = ({ src, alt }) => {
  return (
    <div className="relative shrink-0">
      <img
        src={src}
        alt={alt}
        className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-sm"
        loading="lazy"
      />
    </div>
  );
};
