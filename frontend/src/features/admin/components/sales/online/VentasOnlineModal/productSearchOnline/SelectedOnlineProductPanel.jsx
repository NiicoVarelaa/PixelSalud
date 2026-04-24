import { Minus, Plus, ShoppingBag } from "lucide-react";
import Default from "@assets/default.webp";
import { formatearPrecio, requiereReceta } from "./productSearchOnline.utils";

export const SelectedOnlineProductPanel = ({
  producto,
  cantidad,
  recetaPresentada,
  onCantidadChange,
  setRecetaPresentada,
  onAgregar,
  getProductImage,
}) => {
  const esConReceta = requiereReceta(producto);
  const stock = Number(producto.stock || 0);
  const precio = Number(producto.precio || 0);
  const cantidadNumerica = Math.max(1, Number(cantidad) || 1);
  const puedeRestar = cantidadNumerica > 1;
  const puedeSumar = stock <= 0 ? false : cantidadNumerica < stock;
  const subtotal = precio * cantidadNumerica;

  return (
    <div className="mx-auto w-full max-w-md animate-fadeIn overflow-hidden rounded-3xl border border-gray-200 bg-linear-to-b from-white to-gray-50/60 p-5 sm:p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.55)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-gray-600 shadow-sm">
          Producto seleccionado
        </span>
        {producto.categoria && (
          <span className="truncate rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-green-700 max-w-[52%] shadow-sm">
            {producto.categoria}
          </span>
        )}
      </div>

      <div className="mb-4 h-36 w-full overflow-hidden rounded-2xl border border-gray-200 bg-linear-to-br from-gray-100 via-gray-50 to-white flex items-center justify-center shadow-inner">
        <img
          src={getProductImage(producto)}
          alt={producto.nombreProducto}
          className="h-full w-full object-contain p-3"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = Default;
          }}
        />
      </div>

      <h3 className="mb-4 text-xl sm:text-2xl font-black text-gray-900 leading-tight text-balance tracking-tight">
        {producto.nombreProducto}
      </h3>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-3 shadow-sm">
          <p className="mb-1 text-xs font-black uppercase tracking-wider text-green-800/80">
            Precio
          </p>
          <p className="text-3xl leading-none font-black text-green-700">
            ${formatearPrecio(precio)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 shadow-sm">
          <p className="mb-1 text-xs font-black uppercase tracking-wider text-gray-600/80">
            Stock
          </p>
          <p className="text-3xl leading-none font-black text-gray-800">
            {stock}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
          Subtotal estimado
        </span>
        <span className="text-base sm:text-lg font-black text-gray-900">
          ${formatearPrecio(subtotal)}
        </span>
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
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider text-left">
            Cantidad
          </label>
          <span className="text-[11px] font-semibold text-gray-400">
            Max: {stock}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onCantidadChange(Number(cantidad) - 1)}
            disabled={!puedeRestar}
            className="h-12 w-12 shrink-0 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-green-500 outline-none text-gray-600 cursor-pointer"
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
            disabled={!puedeSumar}
            className="h-12 w-12 shrink-0 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-green-500 outline-none text-gray-600 cursor-pointer"
            aria-label="Aumentar cantidad"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <button
        onClick={onAgregar}
        className="w-full py-3.5 sm:py-4 bg-linear-to-r from-green-600 to-green-500 text-white text-base sm:text-lg font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-lg shadow-green-600/25 active:scale-[0.98] outline-none focus-visible:ring-4 focus-visible:ring-green-500/30 flex items-center justify-center gap-2 cursor-pointer"
      >
        <ShoppingBag size={20} aria-hidden="true" />
        Agregar al Ticket
      </button>
    </div>
  );
};
