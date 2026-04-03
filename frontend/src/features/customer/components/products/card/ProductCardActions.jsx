import { Minus, Plus, Trash2, Loader2, ShoppingCart } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <Loader2 className="w-5 h-5 animate-spin mr-2 text-white" />
  </div>
);

const ProductCardActions = ({
  stock,
  cantidadEnCarrito,
  isLoading,
  onAdd,
  onDecrease,
  onIncrease,
  onDelete,
}) => {
  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full px-3 py-3 text-sm font-semibold rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed"
      >
        Sin stock
      </button>
    );
  }

  if (cantidadEnCarrito === 0) {
    return (
      <button
        onClick={onAdd}
        aria-label="Agregar al carrito"
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 w-full px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-300 shadow-sm ${
          isLoading
            ? "bg-primary-700 cursor-not-allowed text-white"
            : "bg-primary-600 hover:bg-primary-700 text-white cursor-pointer"
        }`}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Agregar
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex w-full overflow-hidden rounded-xl border border-green-200 bg-green-50 shadow-sm">
      <button
        onClick={onDecrease}
        className="flex items-center justify-center w-1/5 py-3 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors duration-150 cursor-pointer border-r border-green-200"
        aria-label="Disminuir cantidad"
      >
        <Minus className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center justify-center flex-1 px-2 py-1">
        <span className="text-lg font-bold text-green-700 leading-none">
          {cantidadEnCarrito}
        </span>
      </div>

      <button
        onClick={onIncrease}
        className="flex items-center justify-center w-1/5 py-3 text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors duration-150 cursor-pointer border-l border-green-200"
        aria-label="Aumentar cantidad"
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        onClick={onDelete}
        className="flex items-center justify-center w-1/5 py-3 text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors duration-150 cursor-pointer border-l border-green-200"
        aria-label="Eliminar del carrito"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProductCardActions;
