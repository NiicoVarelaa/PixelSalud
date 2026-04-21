import { Minus, Plus, ReceiptText, Trash2 } from "lucide-react";
import { FALLBACK_IMAGE } from "./ticket.utils";

export const TicketItemsList = ({
  productos,
  dispatch,
  getProductImage,
  formatearMoneda,
}) => {
  if (productos.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
        <ReceiptText
          size={40}
          className="text-gray-300 mb-3"
          aria-hidden="true"
        />
        <p className="text-gray-500 font-semibold text-base">
          El ticket esta vacio
        </p>
        <p className="text-sm text-gray-400 mt-1 max-w-xs">
          Agrega productos desde el buscador de la izquierda.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2" role="list">
      {productos.map((item, index) => (
        <li
          key={index}
          className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-gray-300"
        >
          <div className="flex-1 min-w-0 pr-2 flex items-start gap-3">
            <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
              <img
                src={getProductImage(item)}
                alt={item.nombreProducto}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </div>

            <div className="min-w-0">
              <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-snug truncate">
                {item.nombreProducto}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-gray-500">
                  {formatearMoneda(item.precioUnitario)} c/u
                </span>
                {item.recetaFisica && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-orange-100 text-orange-800 uppercase tracking-wider">
                    Rx
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-100 sm:border-0">
            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5">
              <button
                onClick={() =>
                  dispatch({
                    type: "UPDATE_PRODUCT",
                    index,
                    field: "cantidad",
                    value: Math.max(1, Number(item.cantidad || 1) - 1),
                  })
                }
                className="h-8 w-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all focus-visible:ring-2 outline-none cursor-pointer"
                aria-label={`Reducir cantidad de ${item.nombreProducto}`}
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="w-8 text-center font-bold text-sm text-gray-900">
                {item.cantidad}
              </span>
              <button
                onClick={() =>
                  dispatch({
                    type: "UPDATE_PRODUCT",
                    index,
                    field: "cantidad",
                    value: Number(item.cantidad || 1) + 1,
                  })
                }
                className="h-8 w-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all focus-visible:ring-2 outline-none cursor-pointer"
                aria-label={`Aumentar cantidad de ${item.nombreProducto}`}
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>

            <div className="text-right min-w-20">
              <span className="block sm:hidden text-[10px] font-bold text-gray-400 uppercase">
                Subtotal
              </span>
              <span className="font-black text-gray-900 text-sm sm:text-base">
                {formatearMoneda(item.cantidad * item.precioUnitario)}
              </span>
            </div>

            <button
              onClick={() => dispatch({ type: "REMOVE_PRODUCT", index })}
              className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-red-500 outline-none cursor-pointer"
              aria-label={`Eliminar ${item.nombreProducto} del ticket`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
