const LoadingState = () => (
  <div className="flex justify-center items-center p-12">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
      <p className="text-gray-600 font-medium">Cargando ofertas...</p>
    </div>
  </div>
);

export default LoadingState;