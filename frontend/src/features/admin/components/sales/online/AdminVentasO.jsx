import { useState } from "react";
import TicketVenta from "@features/admin/components/sales/shared/TicketVenta";

import { useVentasOnlineData } from "./hooks/useVentasOnlineData";
import { useVentaOnlineForm } from "./hooks/useVentaOnlineForm";

import {
  VentasOnlineFilters,
  VentasOnlineTable,
  Pagination,
} from "./components";
import { VentasOnlineModal } from "./VentasOnlineModal";

const AdminVentasO = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketModal, setTicketModal] = useState({
    show: false,
    idVenta: null,
  });

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
      {" "}
      <VentasOnlineFilters />
      <div className="flex min-w-0 flex-col gap-2">
        <div className="min-w-0">
          <VentasOnlineTable
            onVerDetalle={handleVerDetalle}
            onEditar={handleEditar}
            onEstadoChange={handleEstadoChange}
            onPrintTicket={handlePrintTicket}
          />
        </div>

        <div className="mt-auto min-w-0 shrink-0">
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
