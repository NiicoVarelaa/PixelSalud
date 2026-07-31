const MisComprasLoading = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-600/30 border-t-primary-600" />
      <p className="animate-pulse font-medium text-slate-500">
        Cargando tus pedidos...
      </p>
    </div>
  );
};

export default MisComprasLoading;
