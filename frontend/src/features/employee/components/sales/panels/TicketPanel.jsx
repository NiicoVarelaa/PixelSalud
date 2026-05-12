import { ShoppingCart, Receipt, DollarSign, CreditCard, X } from "lucide-react";
import { formatMoneda } from "@features/employee/utils/ventas.utils";

const METODOS_PAGO = [
  { value: "Efectivo", icon: DollarSign, label: "Efectivo" },
  { value: "Tarjeta - Débito", icon: CreditCard, label: "Débito" },
  { value: "Tarjeta - Crédito", icon: CreditCard, label: "Crédito" },
];

const TicketPanel = ({ carrito, metodoPago, setMetodoPago, total, finalizarVenta, onVaciar, onVaciarItem }) => (
  <div className="rounded-2xl border border-gray-100 bg-white flex flex-col min-h-0 flex-1">
    <div className="flex items-center justify-between gap-3 p-5 pb-3">
      <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Receipt size={16} className="text-gray-400" /> Ticket
        {carrito.length > 0 && (
          <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-green-600 px-1.5 text-[10px] font-bold text-white">{carrito.length}</span>
        )}
      </h2>
      {carrito.length > 0 && (
        <button type="button" onClick={onVaciar}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-red-500 hover:bg-red-50 cursor-pointer transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          Vaciar
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
          <p className="mt-1 text-xs text-gray-400 max-w-xs">Busca un producto en el panel izquierdo y agrégalo al ticket</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
              <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Producto</th>
              <th className="px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 w-16">Cant</th>
              <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400 w-24">Subtotal</th>
              <th className="px-4 py-2.5 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {carrito.map((item, index) => (
              <tr key={index} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-2.5">
                  <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{item.nombreProducto}</p>
                  <p className="text-xs text-gray-400">
                    {formatMoneda(item.precioUnitario)} c/u
                    {item.recetaFisica && (
                      <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Rx</span>
                    )}
                  </p>
                </td>
                <td className="px-4 py-2.5 text-center"><span className="text-sm font-semibold text-gray-700">{item.cantidad}</span></td>
                <td className="px-4 py-2.5 text-right"><span className="text-sm font-semibold text-gray-800">{formatMoneda(item.cantidad * item.precioUnitario)}</span></td>
                <td className="px-4 py-2.5">
                  <button type="button" onClick={() => onVaciarItem(index)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Eliminar producto">
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
