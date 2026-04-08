import { useState } from "react";
import TicketVenta from "@features/admin/components/sales/shared/TicketVenta";

// Hooks customizados
import { useVentasOnlineData } from "./hooks/useVentasOnlineData";
import { useVentaOnlineForm } from "./hooks/useVentaOnlineForm";

// Componentes
import {
  VentasOnlineFilters,
  VentasOnlineTable,
  Pagination,
} from "./components";
import { VentasOnlineModal } from "./VentasOnlineModal";

const AdminVentasO = () => {
  // Estado local para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketModal, setTicketModal] = useState({
    show: false,
    idVenta: null,
  });

  // Hooks customizados
  const { obtenerDatos, handleVerDetalle, handleEstadoChange } =
    useVentasOnlineData();
  const {
    ventaForm,
    dispatch,
    editingId,
    clienteEditando,
    loadVentaForEdit,
    submitVenta,
    resetForm,
  } = useVentaOnlineForm();

  // Handlers
  const handleEditar = async (venta) => {
    const success = await loadVentaForEdit(venta);
    if (success) {
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async () => {
    const success = await submitVenta();
    if (success) {
      setIsModalOpen(false);
      resetForm();
      obtenerDatos();
    }
    return success;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handlePrintTicket = (idVenta) => {
    setTicketModal({ show: true, idVenta });
  };

  return (
    <>
      <div className="mb-4 shrink-0 space-y-1 sm:mb-5">
        <h2 className="text-2xl font-bold text-gray-900">Ventas Online</h2>
        <p className="text-sm text-gray-600">
          Gestiona pedidos web, estado de retiro y emisión de tickets
        </p>
      </div>

      <VentasOnlineFilters />

      <div className="flex flex-col gap-4 lg:min-h-0 lg:flex-1">
        <div className="lg:min-h-0 lg:flex-1 lg:overflow-hidden">
          <VentasOnlineTable
            onVerDetalle={handleVerDetalle}
            onEditar={handleEditar}
            onEstadoChange={handleEstadoChange}
            onPrintTicket={handlePrintTicket}
          />
        </div>

        <div className="mt-auto shrink-0">
          <Pagination />
        </div>
      </div>

      <VentasOnlineModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ventaForm={ventaForm}
        dispatch={dispatch}
        isEditing={!!editingId}
        editingId={editingId}
        clienteEditando={clienteEditando}
        onSubmit={handleSubmit}
      />

      <TicketVenta
        idVenta={ticketModal.idVenta}
        tipo="online"
        show={ticketModal.show}
        onClose={() => setTicketModal({ show: false, idVenta: null })}
      />
    </>
  );
};

export default AdminVentasO;
