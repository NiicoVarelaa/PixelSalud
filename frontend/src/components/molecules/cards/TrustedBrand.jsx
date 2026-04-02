import { ShieldCheck } from "lucide-react";
import { ASSETS } from "../../../utils/images";

const TrustedBrand = () => {
  const companyLogos = [
    { src: ASSETS.logo1, alt: "Vichy" },
    { src: ASSETS.logo2, alt: "Pantene" },
    { src: ASSETS.logo3, alt: "Pampers" },
    { src: ASSETS.logo4, alt: "Maybelline" },
    { src: ASSETS.logo5, alt: "Loreal" },
    { src: ASSETS.logo6, alt: "Huggies" },
    { src: ASSETS.logo7, alt: "Dove" },
    { src: ASSETS.logo8, alt: "Dior" },
    { src: ASSETS.logo9, alt: "Colgate" },
    { src: ASSETS.logo10, alt: "CeraVe" },
    { src: ASSETS.logo11, alt: "Caviahue" },
    { src: ASSETS.logo12, alt: "Calvin Klein" },
  ];
  const marqueeLogos = [...companyLogos, ...companyLogos];

  return (
    <section className="w-full py-10 g-gradient-to-r from-white via-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 my-8">
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="text-green-500" size={28} />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Marcas que confían en nosotros
          </h2>
        </div>
        <p className="text-gray-500 text-sm md:text-base text-center max-w-xl">
          Trabajamos con las marcas más reconocidas para garantizar calidad y
          confianza en cada compra.
        </p>
      </div>
      <style>{`
                .marquee-inner {
                    animation: marqueeScroll 18s linear infinite;
                }
                @keyframes marqueeScroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
      <div className="overflow-hidden select-none relative">
        <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none bg-linear-to-r from-white to-transparent" />
        <div className="marquee-inner flex will-change-transform min-w-[200%]">
          {marqueeLogos.map((logo, index) => (
            <div
              key={index}
              className="shrink-0 mx-8 h-14 md:h-20 flex items-center justify-center transition-transform duration-300 hover:scale-110"
              style={{ width: "auto" }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full object-contain filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                draggable={false}
              />
            </div>
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none bg-linear-to-l from-white to-transparent" />
      </div>
      <div className="flex justify-center items-center gap-6 md:gap-10 mt-8 md:mt-10 pt-6 border-t border-gray-200/60">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-gray-900">
            + 50
          </div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">
            Marcas asociadas
          </div>
        </div>
        <div className="w-px h-8 bg-gray-300/60"></div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-gray-900">
            99 %
          </div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">
            Satisfacción
          </div>
        </div>
        <div className="w-px h-8 bg-gray-300/60"></div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-gray-900">5 ★</div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">
            Calificación
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBrand;
