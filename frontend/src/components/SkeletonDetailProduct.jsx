import CardSkeleton from "./CardSkeleton";

const SkeletonDetailProduct = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 my-10 animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-10"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Columna de Galería de Imágenes */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-3 justify-center">
            {/* Thumbnails */}
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
          </div>
          {/* Imagen Principal */}
          <div className="flex-1 aspect-square bg-gray-200 rounded-xl"></div>
        </div>

        {/* Columna de Información y Acciones */}
        <div className="flex flex-col">
          {/* Título */}
          <div className="h-8 bg-gray-200 rounded w-4/5 mb-3"></div>
          {/* Categoría */}
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>

          {/* Precios */}
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6 space-y-3">
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          </div>

          {/* Descripción */}
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>

          {/* Detalles */}
          <div className="space-y-3 border-t border-gray-200 pt-4 mb-8">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-4/6"></div>
          </div>

          {/* Botones */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados Skeleton */}
      <div className="mt-20">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Usamos el CardSkeleton que ya tenías */}
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonDetailProduct;
