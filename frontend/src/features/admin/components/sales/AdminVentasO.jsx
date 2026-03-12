import { useState, useEffect } from "react";
import { TicketVenta } from "@components/shared";
import { AdminLayout } from "@features/admin/components/shared";

// Hooks customizados
import { useVentasOnlineData } from "./hooks/useVentasOnlineData";
import { useVentaOnlineForm } from "./hooks/useVentaOnlineForm";

// Componentes
import {
  VentasOnlineFilters,
  VentasOnlineTable,
  Pagination,
} from "../onlineSales/components";
import { VentasOnlineModal } from "../onlineSales/VentasOnlineModal";

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

  // Cargar datos al montar el componente
  useEffect(() => {
    obtenerDatos();
  }, [obtenerDatos]);

  // Handlers
  const handleEditar = async (venta) => {
    const success = await loadVentaForEdit(venta.idVentaO, venta);
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
      description="Gestión de pedidos web y envíos"
    >
      <VentasOnlineFilters />

      <VentasOnlineTable
        onVerDetalle={handleVerDetalle}
        onEditar={handleEditar}
        onEstadoChange={handleEstadoChange}
        onPrintTicket={handlePrintTicket}
      />

      <Pagination />

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
