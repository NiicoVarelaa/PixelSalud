const Skeleton = () => (
  <div className="flex h-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-green-200 border-t-green-600" />
      <p className="text-sm text-gray-400">Cargando panel...</p>
    </div>
  </div>
);

export default Skeleton;
