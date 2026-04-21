import { Minus, Plus, ShoppingBag } from "lucide-react";
import Default from "@assets/default.webp";
import { requiereReceta } from "./productSearch.utils";

export const SelectedProductPanel = ({
  producto,
  cantidad,
  recetaPresentada,
  onCantidadChange,
  setRecetaPresentada,
  onAgregar,
  getProductImage,
}) => {
  const esConReceta = requiereReceta(producto);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 text-center max-w-sm mx-auto w-full animate-fadeIn">
      <div className="mb-4 h-32 w-full rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
        <img
          src={getProductImage(producto)}
          alt={producto.nombreProducto}
          className="h-full w-full object-contain"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = Default;
          }}
        />
      </div>

      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-4 leading-tight">
        {producto.nombreProducto}
      </h3>

      <div className="flex justify-center gap-3 mb-6">
        <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-100 flex-1">
          <p className="text-xs text-green-800 uppercase font-bold opacity-70 mb-0.5">
            Precio
          </p>
          <p className="font-black text-green-700 text-lg">
            ${producto.precio}
          </p>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex-1">
          <p className="text-xs text-gray-600 uppercase font-bold opacity-70 mb-0.5">
            Stock
          </p>
          <p className="font-black text-gray-800 text-lg">{producto.stock}</p>
        </div>
      </div>

      {esConReceta && (
        <label className="mb-6 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start sm:items-center gap-3 cursor-pointer group transition-colors hover:bg-orange-100/50">
          <input
            type="checkbox"
            className="mt-0.5 sm:mt-0 w-5 h-5 text-orange-600 rounded border-orange-300 focus:ring-orange-500 cursor-pointer"
            checked={recetaPresentada}
            onChange={(event) => setRecetaPresentada(event.target.checked)}
            aria-label="Confirmar receta física verificada"
          />
          <span className="text-orange-900 font-semibold text-sm text-left leading-tight group-hover:text-orange-950 select-none">
            Receta Física Verificada
          </span>
        </label>
      )}

      <div className="flex flex-col gap-2 mb-6">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider text-left">
          Cantidad
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onCantidadChange(Number(cantidad) - 1)}
            className="h-12 w-12 shrink-0 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-green-500 outline-none text-gray-600 cursor-pointer"
            aria-label="Disminuir cantidad"
          >
            <Minus size={20} />
          </button>
          <input
            type="number"
            min="1"
            max={producto.stock}
            className="h-12 flex-1 w-full text-center text-xl font-bold text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
            value={cantidad}
            onChange={(event) => onCantidadChange(event.target.value)}
            aria-label="Cantidad a agregar"
          />
          <button
            onClick={() => onCantidadChange(Number(cantidad) + 1)}
            className="h-12 w-12 shrink-0 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-green-500 outline-none text-gray-600 cursor-pointer"
            aria-label="Aumentar cantidad"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <button
        onClick={onAgregar}
        className="w-full py-3.5 sm:py-4 bg-green-600 text-white text-base sm:text-lg font-bold rounded-xl hover:bg-green-700 transition-all shadow-md shadow-green-600/20 active:scale-[0.98] outline-none focus-visible:ring-4 focus-visible:ring-green-500/30 flex items-center justify-center gap-2 cursor-pointer"
      >
        <ShoppingBag size={20} aria-hidden="true" />
        Agregar al Ticket
      </button>
    </div>
  );
};
