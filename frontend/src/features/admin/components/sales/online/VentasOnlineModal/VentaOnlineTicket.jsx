import {
  getProductImage,
  formatearMoneda,
} from "./ventaOnlineTicket/ticket.utils";
import { TicketDesktopHeader } from "./ventaOnlineTicket/TicketDesktopHeader";
import { TicketItemsList } from "./ventaOnlineTicket/TicketItemsList";
import { TicketMobileToggle } from "./ventaOnlineTicket/TicketMobileToggle";
import { TicketSummary } from "./ventaOnlineTicket/TicketSummary";
import { useProductImagesById } from "./ventaOnlineTicket/useProductImagesById";

export const VentaOnlineTicket = ({
  ventaForm,
  dispatch,
  isEditing,
  clienteEditando,
  onSubmit,
  mobileCollapsed = false,
  onToggleMobileCollapsed,
}) => {
  const imagenesPorProducto = useProductImagesById(ventaForm.productos);

  const resolverImagen = (item) => getProductImage(item, imagenesPorProducto);

  return (
    <div className="w-full lg:w-[55%] shrink-0 flex flex-col lg:min-h-0 bg-gray-50/30">
      <TicketMobileToggle
        mobileCollapsed={mobileCollapsed}
        onToggleMobileCollapsed={onToggleMobileCollapsed}
        totalPago={ventaForm.totalPago}
        totalProductos={ventaForm.productos.length}
        formatearMoneda={formatearMoneda}
      />

      <div
        className={`${mobileCollapsed ? "hidden lg:flex" : "flex"} min-h-0 flex-1 flex-col`}
      >
        <TicketDesktopHeader
          isEditing={isEditing}
          clienteEditando={clienteEditando}
          totalProductos={ventaForm.productos.length}
        />

        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
          <TicketItemsList
            productos={ventaForm.productos}
            dispatch={dispatch}
            getProductImage={resolverImagen}
            formatearMoneda={formatearMoneda}
          />
        </div>

        <TicketSummary
          ventaForm={ventaForm}
          dispatch={dispatch}
          isEditing={isEditing}
          onSubmit={onSubmit}
          formatearMoneda={formatearMoneda}
        />
      </div>
    </div>
  );
};
