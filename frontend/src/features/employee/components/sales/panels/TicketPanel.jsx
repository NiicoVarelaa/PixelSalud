import { ShoppingCart, Receipt, DollarSign, CreditCard, Trash2, X } from "lucide-react";
import { formatMoneda } from "@features/employee/utils/ventas.utils";

const METODOS_PAGO = [
  { value: "Efectivo", icon: DollarSign, label: "Efectivo" },
  { value: "Tarjeta - Débito", icon: CreditCard, label: "Débito" },
  { value: "Tarjeta - Crédito", icon: CreditCard, label: "Crédito" },
];

const TicketPanel = ({ carrito, metodoPago, setMetodoPago, total, finalizarVenta, onVaciar, onVaciarItem }) => (
  <div className="rounded-2xl border border-gray-100 bg-white flex flex-col min-h-0 flex-1">
    <div className="flex items-center justify-between gap-3 px-5 py-4">
      <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Receipt size={16} className="text-gray-400" /> Ticket
        {carrito.length > 0 && (
          <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-green-600 px-1.5 text-[10px] font-bold text-white">{carrito.length}</span>
        )}
      </h2>
      {carrito.length > 0 && (
        <button type="button" onClick={onVaciar}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-red-500 hover:bg-red-50 cursor-pointer transition-colors">
          <Trash2 size={12} /> Vaciar
        </button>
      )}
    </div>

    <div className="flex-1 overflow-y-auto border-t border-gray-50">
      {carrito.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
            <ShoppingCart size={26} className="text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Ticket vacío</p>
          <p className="mt-1 text-xs text-gray-400 max-w-xs">Buscá un producto y agregalo al ticket</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {carrito.map((item, index) => (
            <li key={index} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors group">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.nombreProducto}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-gray-400 tabular-nums">{formatMoneda(item.precioUnitario)} c/u</span>
                  {item.recetaFisica && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Rx</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center justify-center h-7 min-w-7 rounded-lg bg-gray-100 px-2 text-xs font-bold text-gray-700 tabular-nums">{item.cantidad}</span>
                <span className="text-sm font-semibold text-gray-800 tabular-nums w-20 text-right">{formatMoneda(item.cantidad * item.precioUnitario)}</span>
              </div>
              <button type="button" onClick={() => onVaciarItem(index)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 cursor-pointer transition-colors"
                aria-label="Eliminar producto">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="border-t border-gray-100 p-5 space-y-4 shrink-0">
      <div className="space-y-2.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Método de pago</label>
        <div className="grid grid-cols-3 gap-2">
          {METODOS_PAGO.map((metodo) => (
            <button key={metodo.value} type="button" onClick={() => setMetodoPago(metodo.value)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all cursor-pointer ${metodoPago === metodo.value ? "border-green-300 bg-green-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"}`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${metodoPago === metodo.value ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                <metodo.icon size={16} />
              </div>
              <span className={`text-[10px] font-semibold ${metodoPago === metodo.value ? "text-green-700" : "text-gray-500"}`}>{metodo.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total a pagar</p>
          <p className="text-3xl font-bold text-gray-900 tabular-nums">{formatMoneda(total)}</p>
          <p className="text-[11px] text-gray-400">{carrito.length} producto{carrito.length !== 1 ? "s" : ""}</p>
        </div>
        <button type="button" onClick={finalizarVenta} disabled={carrito.length === 0}
          className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all active:scale-[0.98] cursor-pointer ${carrito.length === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white shadow-sm shadow-green-600/20 hover:bg-green-700 hover:shadow-green-600/30"}`}>
          {carrito.length === 0 ? "Ticket vacío" : (<><ShoppingCart size={18} /> Confirmar venta</>)}
        </button>
      </div>
    </div>
  </div>
);

export default TicketPanel;
