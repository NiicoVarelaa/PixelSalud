import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import banner1 from "@assets/BannerPromo1.webp";
import banner2 from "@assets/BannerPromo2.webp";

const BannerPromo = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const banners = [
    {
      image: banner1,
      alt: "Dermocosmética",
      category: "Dermocosmética",
    },
    {
      image: banner2,
      alt: "Cuidado Personal",
      category: "Cuidado Personal",
    },
  ];

  const focusRingClasses = `
    focus:outline-none
    focus:ring-4 
    focus:ring-primary-500 
    focus:ring-opacity-100 
    focus:outline-4 
    focus:outline-transparent 
    focus:outline-offset-2
  `;

  return (
    <div
      className={`grid xl:grid-cols-2 gap-6 mt-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {banners.map((banner) => {
        return (
          <NavLink
            key={banner.category}
            to={`/productos?categoria=${banner.category}`}
            className={`
              group relative block overflow-hidden rounded-2xl shadow-xl transition-all duration-500 
              transform hover:shadow-2xl hover:-translate-y-1 
              ${focusRingClasses}
            `}
          >
            <div className="relative h-64 md:h-80 xl:h-96 overflow-hidden">
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
                <div className="max-w-full">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1">
                    {banner.category}
                  </h2>

                  <div className="flex items-center gap-2 text-lg font-medium">
                    <span className="text-white/80">Explorar ahora</span>
                    <ArrowRight
                      className={`h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
          </NavLink>
        );
      })}
    </div>
  );
};

export default BannerPromo;
