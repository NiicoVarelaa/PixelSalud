import { Package } from "lucide-react";
import Default from "@assets/default.webp";
import {
  ARS_FORMATTER,
  resolveProductImage,
} from "@features/customer/components/orders/ordersUtils";

const OrderProductCard = ({ producto }) => {
  const imageSrc = resolveProductImage(producto.img);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={producto.nombreProducto}
            className="h-full w-full bg-white p-1 object-contain"
            onError={(event) => {
              event.currentTarget.src = Default;
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Package size={20} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">
          {producto.nombreProducto}
        </p>

        <div className="mt-1 flex flex-col items-start gap-1 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-xs text-slate-500">
            {producto.cantidad} x{" "}
            {ARS_FORMATTER.format(producto.precioUnitario)}
          </p>
          <p className="text-sm font-semibold text-slate-700 sm:shrink-0 sm:text-right">
            {ARS_FORMATTER.format(producto.cantidad * producto.precioUnitario)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderProductCard;
