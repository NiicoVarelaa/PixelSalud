import Default from "@assets/default.webp";

const GalleryThumbnails = ({
  validThumbs,
  selectedIndex,
  thumbsRef,
  onSelectIndex,
}) => {
  if (validThumbs.length <= 1) return null;

  return (
    <div
      ref={thumbsRef}
      role="listbox"
      aria-label="Miniaturas de imágenes del producto"
      aria-orientation="horizontal"
      className="hidden sm:flex gap-3 overflow-x-auto py-2 px-1 -mx-1 scrollbar-hide"
    >
      {validThumbs.map((img, index) => {
        const isDefault = img.urlImagen === Default;
        const isSelected = selectedIndex === index;

        return (
          <button
            key={index}
            role="option"
            aria-selected={isSelected}
            aria-label={`Seleccionar imagen ${index + 1}`}
            data-active={isSelected}
            onClick={() => !isDefault && onSelectIndex(index)}
            disabled={isDefault}
            className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
              isSelected
                ? "border-primary-600 shadow-md ring-1 ring-primary-600"
                : "border-slate-200 hover:border-slate-400 bg-white"
            } ${
              isDefault
                ? "opacity-40 cursor-not-allowed"
                : "cursor-pointer hover:-translate-y-1"
            }`}
          >
            {!isSelected && !isDefault && (
              <div className="absolute inset-0 bg-white/20 transition-opacity hover:opacity-0" />
            )}
            <img
              src={img.urlImagen}
              alt={img.altText || `Miniatura ${index + 1}`}
              className="w-full h-full object-cover p-1"
              onError={(event) => {
                event.target.src = Default;
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default GalleryThumbnails;
