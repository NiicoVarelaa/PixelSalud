import { ChevronDown, ChevronUp, ReceiptText } from "lucide-react";

export const TicketMobileToggle = ({
  mobileCollapsed,
  onToggleMobileCollapsed,
  totalPago,
  totalProductos,
  formatearMoneda,
}) => {
  return (
    <button
      type="button"
      className="lg:hidden w-full sticky bottom-0 z-20 px-4 py-3 bg-white border-t border-b border-gray-200 flex items-center justify-between cursor-pointer shadow-[0_-6px_18px_-14px_rgba(0,0,0,0.35)]"
      onClick={onToggleMobileCollapsed}
      aria-expanded={!mobileCollapsed}
      aria-label="Mostrar u ocultar resumen del ticket"
    >
      <div className="flex items-center gap-2">
        <ReceiptText size={18} className="text-gray-500" aria-hidden="true" />
        <span className="text-sm font-bold text-gray-800">
          Resumen del Ticket
        </span>
        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-black">
          {totalProductos}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-black text-green-700">
          {formatearMoneda(totalPago)}
        </span>
        {mobileCollapsed ? (
          <ChevronDown size={18} className="text-gray-500" aria-hidden="true" />
        ) : (
          <ChevronUp size={18} className="text-gray-500" aria-hidden="true" />
        )}
      </div>
    </button>
  );
};
