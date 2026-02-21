import { ShieldCheck } from "lucide-react";
import LogoCalvinKlein from "@assets/Logo-Calvin-Klein.png";
import LogoCaviahue from "@assets/Logo-Caviahue.webp";
import LogoCeraVe from "@assets/Logo-CeraVe.webp";
import LogoDior from "@assets/Logo-Dior.webp";
import LogoLoreal from "@assets/Logo-Loreal.webp";
import LogoMaybelline from "@assets/Logo-Maybelline.webp";
import LogoVichy from "@assets/Logo-Vichy.webp";
import LogoColgate from "@assets/Logo-colgate.webp";
import LogoDove from "@assets/Logo-Dove.webp";
import LogoHuggies from "@assets/Logo-Huggies.webp";
import LogoPampers from "@assets/Logo-Pampers.webp";
import LogoPantene from "@assets/Logo-Pantene.webp";

const TrustedBrand = () => {
  const companyLogos = [
    { src: LogoCalvinKlein, alt: "Calvin Klein" },
    { src: LogoCaviahue, alt: "Caviahue" },
    { src: LogoCeraVe, alt: "CeraVe" },
    { src: LogoDior, alt: "Dior" },
    { src: LogoLoreal, alt: "Loreal" },
    { src: LogoMaybelline, alt: "Maybelline" },
    { src: LogoVichy, alt: "Vichy" },
    { src: LogoColgate, alt: "Colgate" },
    { src: LogoDove, alt: "Dove" },
    { src: LogoHuggies, alt: "Huggies" },
    { src: LogoPampers, alt: "Pampers" },
    { src: LogoPantene, alt: "Pantene" },
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
        <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div className="marquee-inner flex will-change-transform min-w-[200%]">
          {marqueeLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 h-14 md:h-20 flex items-center justify-center transition-transform duration-300 hover:scale-110"
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
        <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
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
