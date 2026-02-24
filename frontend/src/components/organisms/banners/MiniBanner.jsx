import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SquarePercent, Truck, HeartPulse } from "lucide-react";

const messages = [
  {
    text: "Descuento del 20% en productos seleccionados",
    icon: <SquarePercent className="text-sm sm:text-base min-w-[16px]" />,
    shortText: "20% OFF en perfumes",
  },
  {
    text: "Envío gratis en pedidos desde $60.000",
    icon: <Truck className="text-sm sm:text-base min-w-[16px]" />,
    shortText: "Envío gratis desde $100.000",
  },
  {
    text: "Monitoreo de salud con productos en promoción",
    icon: <HeartPulse className="text-sm sm:text-base min-w-[16px]" />,
    shortText: "Monitorea tu salud",
  },
];

const MiniBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % messages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary-700 overflow-hidden h-10 flex items-center">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="w-full text-center text-white text-sm sm:text-base font-medium relative h-10">
          {messages.map((msg, index) => (
            <Link
              to="/productos"
              key={index}
              className={`absolute left-0 w-full transition-opacity duration-500 ease-in-out ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              } flex justify-center items-center h-10 hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700 rounded-sm`}
              aria-label={msg.text}
            >
              <span className="flex items-center gap-2 px-1 sm:px-2 leading-none">
                {msg.icon}
                <span className="hidden sm:inline">{msg.text}</span>
                <span className="sm:hidden">{msg.shortText}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniBanner;
