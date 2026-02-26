const CarruselDots = ({ images, currentIndex, goToSlide }) => {
  return (
    <nav
      className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-10"
      aria-label="Selector de slides"
      role="navigation"
    >
      {images.map((_, idx) => (
        <button
          key={idx}
          onClick={() => goToSlide(idx)}
          className={`h-3 w-3 rounded-full transition-all cursor-pointer border border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${currentIndex === idx ? "bg-white scale-125" : "bg-white/50"} hover:bg-primary-200 active:bg-primary-400`}
          aria-label={`Ir al slide ${idx + 1}`}
          aria-current={currentIndex === idx ? "true" : undefined}
          tabIndex={0}
        />
      ))}
    </nav>
  );
};

export default CarruselDots;
