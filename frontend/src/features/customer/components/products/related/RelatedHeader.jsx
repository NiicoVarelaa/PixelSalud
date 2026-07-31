import { ArrowRight } from "lucide-react";

const RelatedHeader = ({ headingId, category, onCategoryClick }) => (
  <div className="mb-5 flex items-start justify-between gap-4 sm:mb-7">
    <div>
      <h2
        id={headingId}
        className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl lg:text-3xl"
      >
        También te puede interesar
      </h2>
      <p className="mt-1 text-sm text-gray-400">
        {category
          ? `Más productos en ${category}`
          : "Productos seleccionados para vos"}
      </p>
    </div>

    <button
      onClick={onCategoryClick}
      aria-label={
        category
          ? `Ver todos los productos en ${category}`
          : "Ver todos los productos"
      }
      className="
        mt-1 hidden shrink-0 items-center gap-1.5
        text-sm font-semibold text-primary-600
        transition-colors duration-150 hover:text-primary-800 hover:underline underline-offset-2
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded
        sm:inline-flex cursor-pointer
      "
    >
      Ver todos
      <ArrowRight size={14} aria-hidden="true" />
    </button>
  </div>
);

export default RelatedHeader;
