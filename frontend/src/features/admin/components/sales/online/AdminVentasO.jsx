import { useState } from "react";
import TicketVenta from "@features/admin/components/sales/shared/TicketVenta";
import { AdminLayout } from "@features/admin/components/shared";

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
    <AdminLayout
      title="Ventas Online"
      description="Gestiona pedidos web, estado de retiro y emisión de tickets"
      contentClassName="space-y-4"
      nested
    >
      <VentasOnlineFilters />

      <div className="space-y-4 lg:flex lg:flex-col lg:min-h-120">
        <VentasOnlineTable
          onVerDetalle={handleVerDetalle}
          onEditar={handleEditar}
          onEstadoChange={handleEstadoChange}
          onPrintTicket={handlePrintTicket}
        />

        <div className="lg:mt-auto">
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
    </AdminLayout>
  );
};

export default AdminVentasO;
