import { Minus, Plus, ShoppingBag } from "lucide-react";
import Default from "@assets/default.webp";
import { formatearPrecio, requiereReceta } from "./productSearch.utils";

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
  const stock = Number(producto.stock || 0);
  const precio = Number(producto.precio || 0);
  const cantidadNumerica = Math.max(1, Number(cantidad) || 1);
  const puedeRestar = cantidadNumerica > 1;
  const puedeSumar = stock <= 0 ? false : cantidadNumerica < stock;
  const subtotal = precio * cantidadNumerica;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Seleccionado
        </span>
        {producto.categoria && (
          <span className="truncate rounded-md bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-green-700 max-w-[50%]">
            {producto.categoria}
          </span>
        )}
      </div>

      <div className="mb-4 flex h-28 sm:h-32 w-full items-center justify-center rounded-xl border border-gray-100 bg-gray-50/50 p-2">
        <img
          src={getProductImage(producto)}
          alt={producto.nombreProducto}
          className="h-full w-full object-contain mix-blend-multiply"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = Default;
          }}
        />
      </div>

      <h3 className="mb-4 text-lg sm:text-xl font-bold leading-tight text-gray-800 text-balance">
        {producto.nombreProducto}
      </h3>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col justify-center rounded-xl border border-green-100 bg-green-50/50 px-4 py-2.5">
          <span className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-green-700/70">
            Precio Unitario
          </span>
          <span className="text-xl sm:text-2xl font-bold text-green-700">
            ${formatearPrecio(precio)}
          </span>
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5">
          <span className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Stock
          </span>
          <span className="text-xl sm:text-2xl font-bold text-gray-700">
            {stock} u.
          </span>
        </div>
      </div>

      {esConReceta && (
        <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 p-3 transition-colors hover:bg-orange-100/50 group focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-1">
          <input
            type="checkbox"
            className="peer h-5 w-5 cursor-pointer rounded border-orange-300 text-orange-600 focus:ring-orange-500"
            checked={recetaPresentada}
            onChange={(event) => setRecetaPresentada(event.target.checked)}
            aria-label="Confirmar receta física verificada"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-orange-900 select-none peer-checked:text-orange-950">
              Receta Física Verificada
            </span>
            <span className="text-[11px] text-orange-700/80">Requerido para la venta</span>
          </div>
        </label>
      )}

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/30 p-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Cantidad a llevar
          </label>
          <div className="flex items-center rounded-lg border border-gray-300 bg-white shadow-sm overflow-hidden h-9">
            <button
              onClick={() => onCantidadChange(Number(cantidad) - 1)}
              disabled={!puedeRestar}
              className="flex h-full w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer outline-none focus-visible:bg-gray-100"
              aria-label="Disminuir cantidad"
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>
            <input
              type="number"
              min="1"
              max={producto.stock}
              className="h-full w-12 border-x border-gray-200 bg-transparent text-center text-sm font-bold text-gray-800 outline-none focus:bg-green-50 appearance-none"
              value={cantidad}
              onChange={(event) => onCantidadChange(event.target.value)}
              aria-label="Cantidad a agregar"
            />
            <button
              onClick={() => onCantidadChange(Number(cantidad) + 1)}
              disabled={!puedeSumar}
              className="flex h-full w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer outline-none focus-visible:bg-gray-100"
              aria-label="Aumentar cantidad"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200/60 pt-2">
          <span className="text-xs font-semibold text-gray-600">
            Subtotal estimado
          </span>
          <span className="text-lg font-bold text-gray-900">
            ${formatearPrecio(subtotal)}
          </span>
        </div>
      </div>

      <button
        onClick={onAgregar}
        className="mt-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm sm:text-base font-bold text-white shadow-md shadow-green-600/20 transition-all hover:bg-green-700 active:scale-[0.98] outline-none focus-visible:ring-4 focus-visible:ring-green-500/30"
      >
        <ShoppingBag size={18} aria-hidden="true" />
        Agregar al Ticket
      </button>
    </div>
  );
};