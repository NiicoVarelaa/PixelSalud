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
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1" role="list">
          {productosCategoria.map((producto) => {
            const checked = productosEnTicketIds.has(producto.idProducto);

            return (
              <li
                key={producto.idProducto}
                className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md hover:border-green-200"
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(event) =>
                      onToggleProductoTicket?.(producto, event.target.checked)
                    }
                    aria-label={`Agregar ${producto.nombreProducto} al ticket`}
                  />
                  <span className="mt-0.5 shrink-0 text-green-600">
                    {checked ? <CheckSquare size={20} /> : <Square size={20} />}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 h-20 w-full rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
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

                    <p
                      className="truncate text-sm font-bold text-gray-900"
                      title={producto.nombreProducto}
                    >
                      {producto.nombreProducto}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 truncate">
                      {producto.categoria}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-black text-green-700">
                        $
                        {formatearPrecio(
                          producto.precioFinal || producto.precio,
                        )}
                      </p>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600 border border-gray-200">
                        Stock: {producto.stock}
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
