import { ChevronLeft, ChevronRight } from "lucide-react";

const CarouselNavButton = ({ direction, disabled, onClick, label }) => {
  const isLeft = direction === "left";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute ${isLeft ? "left-0" : "right-0"} top-1/2 z-20 -translate-y-1/2 rounded-full p-2.5 shadow-xl transition-all duration-300 cursor-pointer ${
        disabled
          ? "invisible opacity-0"
          : "visible bg-white/95 text-slate-950 opacity-100 hover:scale-110 hover:text-orange-600 active:scale-95"
      }`}
      aria-label={label}
    >
      {isLeft ? (
        <ChevronLeft size={22} strokeWidth={3} />
      ) : (
        <ChevronRight size={22} strokeWidth={3} />
      )}
    </button>
  );
};

export default CarouselNavButton;
