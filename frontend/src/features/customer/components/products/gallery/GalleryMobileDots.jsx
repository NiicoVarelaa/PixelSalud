const GalleryMobileDots = ({ validThumbs, selectedIndex, onSelectIndex }) => {
  if (validThumbs.length <= 1) return null;

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:hidden bg-white/60 backdrop-blur-md px-3 py-2 rounded-full shadow-sm"
      aria-hidden="true"
    >
      {validThumbs.map((_, index) => (
        <button
          key={index}
          onClick={(event) => {
            event.stopPropagation();
            onSelectIndex(index);
          }}
          aria-label={`Ir a la imagen ${index + 1}`}
          className="p-1 cursor-pointer focus-visible:outline-none"
          tabIndex={-1}
        >
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-primary-600 w-5"
                : "bg-slate-400 w-1.5 hover:bg-slate-500"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default GalleryMobileDots;
