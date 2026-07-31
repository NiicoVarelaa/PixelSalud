import { ReceiptText } from "lucide-react";
import { TicketDesktopHeader } from "./ventaTicket/TicketDesktopHeader";
import { TicketItemsList } from "./ventaTicket/TicketItemsList";
import { TicketMobileToggle } from "./ventaTicket/TicketMobileToggle";
import { TicketSummary } from "./ventaTicket/TicketSummary";
import { getProductImage, formatearMoneda } from "./ventaTicket/ticket.utils";
import { useProductImagesById } from "./ventaTicket/useProductImagesById";

export const VentaTicket = ({
  ventaForm,
  dispatch,
  isEditing,
  nombreVendedorOriginal,
  user,
  onSubmit,
  mobileCollapsed = false,
  onToggleMobileCollapsed,
}) => {
  const imagenesPorProducto = useProductImagesById(ventaForm.productos);

  const resolverImagen = (item) => getProductImage(item, imagenesPorProducto);

  return (
    <div className="w-full lg:w-[55%] shrink-0 lg:min-h-0 lg:flex lg:flex-col bg-gray-50/30">
      <TicketMobileToggle
        mobileCollapsed={mobileCollapsed}
        onToggleMobileCollapsed={onToggleMobileCollapsed}
        totalPago={ventaForm.totalPago}
        totalProductos={ventaForm.productos.length}
        formatearMoneda={formatearMoneda}
      />

      <div
        className={`${mobileCollapsed ? "hidden lg:flex" : "flex"} min-h-0 flex-1 flex-col ${mobileCollapsed ? "" : "max-h-[62vh] lg:max-h-none"}`}
      >
        <TicketDesktopHeader
          isEditing={isEditing}
          nombreVendedorOriginal={nombreVendedorOriginal}
          totalProductos={ventaForm.productos.length}
          user={user}
        />

        <div className="overflow-y-auto p-2 sm:p-4 max-h-[28vh] lg:max-h-none lg:flex-1">
          <TicketItemsList
            dispatch={dispatch}
            formatearMoneda={formatearMoneda}
            getProductImage={resolverImagen}
            productos={ventaForm.productos}
          />
        </div>

        <TicketSummary
          dispatch={dispatch}
          formatearMoneda={formatearMoneda}
          isEditing={isEditing}
          onSubmit={onSubmit}
          ventaForm={ventaForm}
        />
      </div>
    </div>
  );
};
