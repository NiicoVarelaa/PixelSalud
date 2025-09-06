import { useEffect, useState } from "react";
import { FaPills, FaUserMd, FaHeartbeat } from "react-icons/fa";
import { Link } from "react-router-dom";

const messages = [
  {
    text: "Descuento del 20% en productos seleccionados",
    icon: <FaPills className="text-sm sm:text-base" />,
    shortText: "20% OFF en perfumes",
  },
  {
    text: "Envío gratis en pedidos desde $60.000",
    icon: <FaUserMd className="text-sm sm:text-base" />,
    shortText: "Envío gratis desde $60.000",
  },
  {
    text: "Monitoreo de salud con productos en promoción",
    icon: <FaHeartbeat className="text-sm sm:text-base" />,
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
    <div className="relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen bg-primary-700 px-8 sm:px-12 overflow-hidden h-10 flex items-center z-10">
      <div className="w-full text-center text-white text-sm sm:text-base font-medium relative">
        {messages.map((msg, index) => (
          <Link
            to="/tienda"
            key={index}
            className={`absolute left-0 w-full transition-opacity duration-500 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            } flex justify-center items-center h-full`}
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
  );
};


export default MiniBanner;