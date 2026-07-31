import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  CreditCard,
  Package,
  Printer,
  ShoppingBag,
} from "lucide-react";
import OrderProductCard from "@features/customer/components/orders/OrderProductCard";
import {
  ARS_FORMATTER,
  getStatusConfig,
} from "@features/customer/components/orders/ordersUtils";

const OrderCard = ({ venta, isExpanded, onToggle, onOpenTicket, index }) => {
  const status = getStatusConfig(venta.estado);
  const StatusIcon = status.icon;
  const fecha = new Date(venta.fechaPago).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.03 * index }}
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 `}
    >
      <div onClick={onToggle} className="cursor-pointer p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4 bg-slate-100/90 rounded-xl p-2">
            <div
              className={`hidden rounded-xl p-3 md:flex ${
                isExpanded
                  ? "bg-primary-600 text-slate-50"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              <Package size={30} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-lg font-bold text-slate-900">
                  Orden #{venta.idVentaO}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${status.className} shrink-0`}
                >
                  <StatusIcon size={14} strokeWidth={2.5} />
                  {status.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {fecha}
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1.5">
                  <CreditCard size={14} />
                  {venta.metodoPago}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 sm:gap-4">
            <div>
              <span className="text-xs font-medium uppercase text-slate-400">
                Total
              </span>
              <div className="text-xl font-bold text-slate-900">
                {ARS_FORMATTER.format(venta.totalPago)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenTicket(venta.idVentaO);
                }}
                className="rounded-full bg-orange-100 p-2 text-orange-600 transition-colors hover:bg-orange-200 cursor-pointer"
                title="Ver Ticket"
              >
                <Printer size={20} />
              </button>

              <div
                className={`rounded-full p-2 transition-all duration-300 ${
                  isExpanded
                    ? "rotate-180 bg-primary-600 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="overflow-hidden"
          >
            <div className="overflow-hidden border-t border-slate-100 bg-slate-50/50">
              <div className="p-5">
                <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                  <ShoppingBag size={16} className="text-primary-700" />
                  Productos ({venta.productos.length})
                </h4>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {venta.productos.map((producto, productIndex) => (
                    <OrderProductCard
                      key={`${venta.idVentaO}-${productIndex}-${producto.nombreProducto}`}
                      producto={producto}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderCard;
