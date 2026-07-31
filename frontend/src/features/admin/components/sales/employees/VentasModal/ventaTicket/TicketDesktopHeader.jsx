import { ReceiptText, UserCircle } from "lucide-react";

export const TicketDesktopHeader = ({
  isEditing,
  nombreVendedorOriginal,
  totalProductos,
  user,
}) => {
  return (
    <div className="hidden lg:flex px-4 sm:px-6 py-4 flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white border-b border-gray-200 shrink-0">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <ReceiptText size={20} className="text-gray-400" aria-hidden="true" />
        Resumen del Ticket
        <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-md text-xs font-black">
          {totalProductos}
        </span>
      </h3>
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 w-fit">
        <UserCircle size={16} className="text-gray-500" aria-hidden="true" />
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
          {isEditing && nombreVendedorOriginal
            ? `Editando: ${nombreVendedorOriginal}`
            : user.nombre || `Admin (ID: ${user.id})`}
        </span>
      </div>
    </div>
  );
};
