import { ArrowRight } from "lucide-react";

const RelatedCategoryCta = ({ category, onCategoryClick, mobile = false }) => {
  const label = category
    ? `Ver todos en ${category}`
    : "Ver todos los productos";
  const ariaLabel = category
    ? `Ver todos los productos en ${category}`
    : "Ver todos los productos";

  if (mobile) {
    return (
      <button
        onClick={onCategoryClick}
        aria-label={ariaLabel}
        className="
          w-full flex items-center justify-center gap-2
          py-3.5 rounded-xl border-2 border-primary-600
          text-primary-700 font-semibold text-sm bg-white
          hover:bg-primary-50 active:scale-[0.98]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          transition-all duration-150 cursor-pointer
        "
      >
        {label}
        <ArrowRight size={15} aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      onClick={onCategoryClick}
      aria-label={ariaLabel}
      className="
        inline-flex items-center justify-center gap-2
        px-7 py-3 rounded-full
        bg-primary-600 text-white font-semibold text-sm
        hover:bg-primary-700
        shadow-md hover:shadow-lg active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        transition-all duration-200 cursor-pointer
      "
    >
      {label}
      <ArrowRight
        size={15}
        className="group-hover:translate-x-1 transition-transform"
        aria-hidden="true"
      />
    </button>
  );
};

export default RelatedCategoryCta;
