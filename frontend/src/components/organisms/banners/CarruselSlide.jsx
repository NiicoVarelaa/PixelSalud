import { useState } from "react";

const CarruselSlide = ({ src, alt, isCurrent, isLeaving }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`
        absolute top-0 left-0 w-full h-full rounded-lg sm:rounded-xl
        ${isCurrent ? "z-10" : "z-0"}
      `}
      role="group"
      aria-hidden={!isCurrent}
      tabIndex={isCurrent ? 0 : -1}
    >
      {!loaded && (
        <div
          className="w-full h-full bg-gray-200 rounded-lg sm:rounded-xl animate-shimmer relative overflow-hidden"
          aria-label="Cargando imagen"
        >
          <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 opacity-60 animate-shimmerMove" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`
          w-full h-full object-cover rounded-lg sm:rounded-xl
          transition-opacity duration-700 ease-in-out
          ${loaded && isCurrent ? "opacity-100" : "opacity-0"}
          ${isLeaving ? "opacity-0" : ""}
          outline-none ring-0 focus-visible:ring-4 focus-visible:ring-primary-500 select-none shadow-sm
        `}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default CarruselSlide;


