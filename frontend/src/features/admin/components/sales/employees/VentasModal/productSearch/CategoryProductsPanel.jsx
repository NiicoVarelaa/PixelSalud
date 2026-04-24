import { CheckSquare, Square } from "lucide-react";
import Default from "@assets/default.webp";
import { formatearPrecio } from "./productSearch.utils";

export const CategoryProductsPanel = ({
  filtroCategoria,
  productosCategoria,
  productosEnTicketIds,
  onToggleProductoTicket,
  getProductImage,
}) => {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-wider text-gray-500">
          Productos en {filtroCategoria}
        </p>
        <span className="rounded-md border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">
          {productosCategoria.length}
        </span>
      </div>

      {productosCategoria.length === 0 ? (
        <div className="flex-1 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500 flex items-center justify-center">
          No hay productos para esta categoría con el filtro actual.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-1" role="list">
          {productosCategoria.map((producto) => {
            const checked = productosEnTicketIds.has(producto.idProducto);

            return (
              <li
                key={producto.idProducto}
                className={`
                  group relative overflow-hidden rounded-2xl border p-3.5 shadow-sm transition-all duration-200
                  ${
                    checked
                      ? "border-green-500 bg-linear-to-br from-green-50 to-white shadow-[0_10px_24px_-18px_rgba(22,163,74,0.75)]"
                      : "border-gray-200 bg-white hover:border-green-300 hover:shadow-[0_12px_28px_-22px_rgba(15,23,42,0.45)]"
                  }
                `}
              >
                <label className="block cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(event) =>
                      onToggleProductoTicket?.(producto, event.target.checked)
                    }
                    aria-label={`Agregar ${producto.nombreProducto} al ticket`}
                  />
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                        checked
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 bg-white text-gray-400 group-hover:border-green-400 group-hover:text-green-600"
                      }`}
                    >
                      {checked ? (
                        <CheckSquare size={15} />
                      ) : (
                        <Square size={15} />
                      )}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                        checked
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {checked ? "En ticket" : "Disponible"}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="mb-3 h-24 w-full rounded-xl border border-gray-100 bg-linear-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={getProductImage(producto)}
                        alt={producto.nombreProducto}
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = Default;
                        }}
                      />
                    </div>

                    <p
                      className="truncate text-[15px] font-extrabold text-gray-900"
                      title={producto.nombreProducto}
                    >
                      {producto.nombreProducto}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-gray-500 truncate">
                      {producto.categoria}
                    </p>

                    <div className="mt-3 flex items-end justify-between gap-2">
                      <p className="text-xl font-black leading-none text-green-700">
                        $
                        {formatearPrecio(
                          producto.precioFinal || producto.precio,
                        )}
                      </p>
                      <span className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] font-black text-gray-600">
                        Stock: {producto.stock ?? 0}
                      </span>
                    </div>
                  </div>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
