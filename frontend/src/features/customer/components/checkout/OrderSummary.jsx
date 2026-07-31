import Default from "@assets/default.webp";
import { ShoppingBag, Tag } from "lucide-react";

export const OrderSummary = ({
  carrito,
  subtotal,
  total,
  discountCode,
  setDiscountCode,
  appliedCouponCode,
  appliedDiscount,
  handleApplyDiscount,
  handleRemoveDiscount,
  formatPrice,
}) => {
  return (
    <div className="lg:w-[420px]">
      <div className="sticky top-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-secondary-500 p-5 md:p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-2 shrink-0">
              <ShoppingBag className="h-6 w-6 text-secondary-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Resumen del pedido</h2>
              <p className="mt-1 text-sm font-medium text-white/90">
                {carrito.reduce((acc, prod) => acc + prod.cantidad, 0)}{" "}
                artículos
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="mb-6 max-h-72 space-y-3 overflow-y-auto pr-1">
            {carrito.map((product) => {
              const subtotalItem = Number(product.subtotalItem);
              const price =
                parseFloat(
                  product.precioFinal ||
                    product.precioRegular ||
                    product.precio,
                ) || 0;
              const totalProd =
                Number.isFinite(subtotalItem) && subtotalItem > 0
                  ? subtotalItem
                  : price * product.cantidad;

              return (
                <div
                  key={product.idProducto}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <img
                      src={product.img || Default}
                      alt={product.nombreProducto}
                      className="h-full w-full object-cover"
                      onError={(e) => (e.target.src = Default)}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-gray-900">
                      {product.nombreProducto}
                    </h4>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Cantidad: {product.cantidad}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(totalProd)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <label className="mb-2 flex items-center text-sm font-semibold text-gray-700">
              <Tag className="mr-1 h-4 w-4 text-primary-600" />
              Cupón de descuento
            </label>

            {appliedCouponCode ? (
              <div className="flex gap-2">
                <div className="flex flex-1 items-center justify-between rounded-lg  bg-primary-100 px-3 py-2">
                  <span className="text-sm font-semibold text-primary-800">
                    {appliedCouponCode} Aplicado
                  </span>
                  <span className="text-sm font-bold text-primary-800">
                    - {formatPrice(appliedDiscount)}
                  </span>
                </div>
                <button
                  onClick={handleRemoveDiscount}
                  className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-200 cursor-pointer"
                >
                  Quitar
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ingresar cupón"
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleApplyDiscount()}
                />
                <button
                  onClick={handleApplyDiscount}
                  className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-300 cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
            )}
          </div>

          <div className="mb-6 space-y-3 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Subtotal</span>
              <span className="text-sm font-semibold text-slate-900">
                {formatPrice(subtotal)}
              </span>
            </div>

            {appliedDiscount > 0 && (
              <div className="flex items-center justify-between text-emerald-700">
                <span className="text-sm">Descuento</span>
                <span className="text-sm font-semibold">
                  - {formatPrice(appliedDiscount)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Retiro en tienda</span>
              <span className="font-semibold text-primary-700">Gratis</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-2xl font-extrabold text-primary-700">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
