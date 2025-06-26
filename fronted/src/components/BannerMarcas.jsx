import React from "react";
import { NavLink } from "react-router-dom";

const BannerMarcas = () => {
  const farmaciaLogos = [
    {
      name: "Pampers",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Logo_Bayer.svg/2048px-Logo_Bayer.svg.png",
    },
    {
      name: "Bayer",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Logo_Bayer.svg/2048px-Logo_Bayer.svg.png",
    },
    {
      name: "Dove",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dove_logo.png",
    },
    {
      name: "Roche",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Logo_Bayer.svg/2048px-Logo_Bayer.svg.png",
    },
    {
      name: "Sanofi",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dove_logo.png",
    },
    {
      name: "GSK",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dove_logo.png",
    },
    {
      name: "AstraZeneca",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dove_logo.png",
    },
    {
      name: "AstraZeneca",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dove_logo.png",
    },
    {
      name: "AstraZeneca",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dove_logo.png",
    },
    {
      name: "AstraZeneca",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dove_logo.png",
    },
    {
      name: "AstraZeneca",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dove_logo.png",
    },
    {
      name: "AstraZeneca",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dove_logo.png",
    },
  ];

  return (
    <div className="w-full bg-gray-50 py-8 overflow-hidden rounded-lg mt-12">
      <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                    display: flex;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
      <div className="w-full relative">
        
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent" />

        <div className="marquee-inner" style={{ animationDuration: "20s" }}>
          {[...farmaciaLogos, ...farmaciaLogos].map((logo, index) => (
            <div key={index} className="flex-shrink-0 mx-8 flex items-center">
              <NavLink to="/error404" className="cursor-pointer">
                <img
                  src={logo.image}
                  alt={logo.name}
                  className="h-12 object-contain max-w-[120px] opacity-70 hover:opacity-100 transition-opacity"
                  draggable={false}
                />
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerMarcas;
