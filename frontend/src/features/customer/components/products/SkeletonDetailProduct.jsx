import CardSkeleton from "@components/molecules/cards/CardSkeleton";

// Reusable shimmer block
const Shimmer = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
);

const SkeletonDetailProduct = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando detalle del producto…"
      role="status"
      className="max-w-7xl mx-auto px-4 sm:px-6 my-8 sm:my-10"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8">
        <Shimmer className="h-3.5 w-12 rounded-full" />
        <Shimmer className="h-3.5 w-2 rounded-full" />
        <Shimmer className="h-3.5 w-20 rounded-full" />
        <Shimmer className="h-3.5 w-2 rounded-full" />
        <Shimmer className="h-3.5 w-36 rounded-full" />
      </div>

      {/* Product card shell */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">

          {/* Gallery column */}
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4">
            {/* Main image */}
            <Shimmer className="w-full aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl" />
            {/* Thumbs */}
            <div className="hidden sm:flex gap-2">
              {[...Array(4)].map((_, i) => (
                <Shimmer key={i} className="w-16 h-16 rounded-xl flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Info column */}
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-5 border-t lg:border-t-0 lg:border-l border-gray-100">
            {/* Category */}
            <Shimmer className="h-3 w-24 rounded-full" />
            {/* Title */}
            <div className="flex flex-col gap-2">
              <Shimmer className="h-7 w-4/5 rounded-lg" />
              <Shimmer className="h-7 w-2/3 rounded-lg" />
            </div>
            {/* Stock badge */}
            <Shimmer className="h-8 w-36 rounded-full" />

            {/* Price block */}
            <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-4 flex flex-col gap-2.5">
              <Shimmer className="h-10 w-40 rounded-lg" />
              <Shimmer className="h-4 w-28 rounded-lg" />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Shimmer className="h-4 w-full rounded-lg" />
              <Shimmer className="h-4 w-full rounded-lg" />
              <Shimmer className="h-4 w-3/5 rounded-lg" />
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-4 gap-2 py-3 border-y border-gray-100">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <Shimmer className="w-9 h-9 rounded-full" />
                  <Shimmer className="h-3 w-12 rounded" />
                </div>
              ))}
            </div>

            {/* Payment methods image */}
            <Shimmer className="h-12 w-full rounded-xl" />

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-2">
              <Shimmer className="h-12 flex-1 rounded-xl" />
              <Shimmer className="h-12 flex-1 rounded-xl" />
            </div>
          </div>

        </div>
      </div>

      {/* Related products */}
      <div>
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-col gap-2">
            <Shimmer className="h-7 w-56 rounded-lg" />
            <Shimmer className="h-3.5 w-36 rounded" />
          </div>
          <Shimmer className="hidden sm:block h-5 w-20 rounded" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Screen reader announcement */}
      <span className="sr-only">Cargando información del producto, por favor esperá.</span>
    </div>
  );
};

export default SkeletonDetailProduct;
